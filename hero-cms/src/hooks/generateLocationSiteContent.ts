import { APIError, type CollectionBeforeChangeHook } from 'payload'

// Writes every piece of page copy for a Location Site using Claude.
// Runs when "Generate content on save" is ticked, then unticks itself.
// If it fails, the save is stopped with an error message and nothing is overwritten.

const MODEL = 'claude-sonnet-5-5'

type Trade = {
  key: string // plumbing | heating | electrics
  label: string // Plumbing
  noun: string // Plumbers
  slug: string // location-sites-plumbing
}

const ISSUE_COUNT = 4
const STEP_COUNT = 3
const REASON_COUNT = 3

// The shape Claude must return (enforced by the API's structured output setting).
// Counts and lengths can't be enforced by the schema, so they're stated in descriptions
// and checked after the response arrives.
const card = (titleMax: number, textMax: number) => ({
  type: 'object',
  properties: {
    title: { type: 'string', description: `Max ${titleMax} characters` },
    text: { type: 'string', description: `Max ${textMax} characters` },
  },
  required: ['title', 'text'],
  additionalProperties: false,
})

const cards = (count: number, titleMax: number, textMax: number) => ({
  type: 'array',
  description: `Exactly ${count} items`,
  items: card(titleMax, textMax),
})

const PAGE_SCHEMA = {
  type: 'object',
  properties: {
    heroEyebrow: { type: 'string', description: 'Max 60 characters' },
    heroHeadline: {
      type: 'string',
      description: 'Max 60 characters. Must contain the location name exactly as given.',
    },
    issuesHeading: { type: 'string', description: 'Max 45 characters' },
    issuesSubheading: { type: 'string', description: 'Max 90 characters' },
    issues: cards(ISSUE_COUNT, 35, 200),
    reviewsHeading: {
      type: 'string',
      description:
        'Max 50 characters. Invites the reader to join happy local customers and names the location. No numbers or customer counts.',
    },
    reviewsText: {
      type: 'string',
      description:
        'Max 170 characters. One sentence saying we cover the whole of the location, naming 5-7 of its most populated districts or neighbourhoods WITHIN the location.',
    },
    stepsHeading: { type: 'string', description: 'Max 45 characters' },
    steps: cards(STEP_COUNT, 35, 200),
    reasonsHeading: {
      type: 'string',
      description:
        'Max 45 characters, in the style "Why Liverpool Chooses Us", using the location name',
    },
    reasonsIntro: {
      type: 'string',
      description:
        'Max 170 characters. Says we also cover the surrounding area, naming 5-7 real towns or areas OUTSIDE the location but nearby. Must not repeat places named in reviewsText.',
    },
    reasons: cards(REASON_COUNT, 35, 160),
    faqsHeading: { type: 'string', description: 'Max 45 characters' },
    faqs: {
      type: 'array',
      description: 'Exactly 3 items',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'Max 60 characters' },
          answer: { type: 'string', description: 'Max 250 characters' },
        },
        required: ['question', 'answer'],
        additionalProperties: false,
      },
    },
    checkHeading: { type: 'string', description: 'Max 40 characters' },
    checkBullets: {
      type: 'array',
      description: 'Exactly 3 items',
      items: { type: 'string', description: 'Max 60 characters' },
    },
    areas: {
      type: 'array',
      description: 'Exactly 6 items',
      items: { type: 'string', description: 'A real district, suburb or nearby town' },
    },
    footerBlurb: { type: 'string', description: 'Max 140 characters' },
    metaTitle: { type: 'string', description: 'Max 60 characters' },
    metaDescription: { type: 'string', description: 'Max 155 characters' },
  },
  required: [
    'heroEyebrow',
    'heroHeadline',
    'issuesHeading',
    'issuesSubheading',
    'issues',
    'reviewsHeading',
    'reviewsText',
    'stepsHeading',
    'steps',
    'reasonsHeading',
    'reasonsIntro',
    'reasons',
    'faqsHeading',
    'faqs',
    'checkHeading',
    'checkBullets',
    'areas',
    'footerBlurb',
    'metaTitle',
    'metaDescription',
  ],
  additionalProperties: false,
}

type GeneratedPage = {
  heroEyebrow: string
  heroHeadline: string
  issuesHeading: string
  issuesSubheading: string
  issues: { title: string; text: string }[]
  reviewsHeading: string
  reviewsText: string
  stepsHeading: string
  steps: { title: string; text: string }[]
  reasonsHeading: string
  reasonsIntro: string
  reasons: { title: string; text: string }[]
  faqsHeading: string
  faqs: { question: string; answer: string }[]
  checkHeading: string
  checkBullets: string[]
  areas: string[]
  footerBlurb: string
  metaTitle: string
  metaDescription: string
}

const SYSTEM_PROMPT = `You write copy for single-page local emergency trades websites in the UK. Each site targets one town or city and must rank in local organic search.

Rules:
- British English spelling and phrasing throughout.
- Write genuinely local copy: mention real districts, neighbourhoods, nearby towns or well-known local features of the location where it fits naturally. Only use places you are confident exist in or near that location.
- Every site must read differently. Never reuse the example phrasing you are shown from other sites; find fresh angles and wording.
- Use the target keywords naturally. Never stuff keywords or repeat the same phrase.
- Card content: write exactly one card per brief, in the same order, covering what the brief describes.
- Claims: you may ONLY make claims that appear in the Approved Facts & Promises list or the briefs. Never invent guarantees, prices, response times, statistics, years of experience, accreditations, reviews or testimonials.
- Never mention "Emergency Hero" or any other company name. Refer to the business as the brand name given, or as "we".
- The hero headline must contain the location name exactly as given.
- Keep within every character limit. Short, clear, confident sentences. No exclamation-mark overload, no clichés such as "look no further", "second to none" or "we pride ourselves".
- Return only the JSON object described by the schema.`

type Args = Parameters<CollectionBeforeChangeHook>[0]

const otherSitesExamples = async (req: Args['req'], trade: Trade, ownId?: string | number) => {
  const others = await req.payload.find({
    collection: trade.slug as any,
    where: ownId ? { id: { not_equals: ownId } } : {},
    limit: 15,
    depth: 0,
    overrideAccess: true,
    sort: '-updatedAt',
  })
  return others.docs
    .map((doc: any) =>
      [doc?.hero?.headline, doc?.issues?.heading, doc?.issues?.issue1?.title]
        .filter(Boolean)
        .join(' | '),
    )
    .filter(Boolean)
}

const callClaude = async (prompt: string): Promise<GeneratedPage> => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set on the CMS server')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: PAGE_SCHEMA } },
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Claude API error ${response.status}: ${detail.slice(0, 300)}`)
  }

  const result = await response.json()
  if (result?.stop_reason === 'max_tokens')
    throw new Error('Claude ran out of space writing the page')
  if (result?.stop_reason === 'refusal') throw new Error('Claude declined to write this page')
  const text = result?.content?.find((block: any) => block.type === 'text')?.text
  if (!text) throw new Error('Claude did not return page content')
  try {
    return JSON.parse(text) as GeneratedPage
  } catch {
    throw new Error('Claude returned content that could not be read')
  }
}

const checkPage = (page: GeneratedPage, locationName: string): string | null => {
  if (!page.heroHeadline?.toLowerCase().includes(locationName.toLowerCase())) {
    return 'headline did not include the location name'
  }
  if (page.issues?.length !== ISSUE_COUNT) return 'wrong number of issue cards'
  if (page.steps?.length !== STEP_COUNT) return 'wrong number of booking steps'
  if (page.reasons?.length !== REASON_COUNT) return 'wrong number of reasons'
  if ((page.faqs?.length ?? 0) < 3) return 'fewer than 3 FAQs'
  if ((page.checkBullets?.length ?? 0) < 3) return 'fewer than 3 tick points'
  if ((page.areas?.length ?? 0) < 6) return 'fewer than 6 areas'
  if (/emergency\s*hero/i.test(JSON.stringify(page))) return 'mentioned Emergency Hero'
  return null
}

const toCards = (prefix: string, items: { title: string; text: string }[]) =>
  Object.fromEntries(
    items.map((item, i) => [`${prefix}${i + 1}`, { title: item.title, description: item.text }]),
  )

export const generateLocationSiteContent =
  (trade: Trade): CollectionBeforeChangeHook =>
  async ({ data, req, originalDoc }) => {
    if (!data?.generateContent) return data

    const locationName = (data.locationName ?? originalDoc?.locationName ?? '').trim()
    const brandName = (data.brandName ?? originalDoc?.brandName ?? '').trim()
    const keywords = (data.keywords ?? originalDoc?.keywords ?? '').trim()

    if (!locationName || !brandName) {
      throw new APIError(
        'Add a Location Name and Brand Name before generating content.',
        400,
        null,
        true,
      )
    }

    try {
      const globals: any = await req.payload.findGlobal({
        slug: 'location-sites-globals',
        depth: 0,
        overrideAccess: true,
      } as any)
      const tradeGlobals = globals?.[trade.key] ?? {}
      const approvedClaims = (globals?.allSites?.approvedClaims ?? '').trim()

      const briefs = (prefix: string, count: number) =>
        Array.from({ length: count }, (_, i) => {
          const brief = (tradeGlobals?.[`${prefix}${i + 1}`]?.brief ?? '').trim()
          return `${i + 1}. ${brief || '(no brief — choose a sensible, distinct topic)'}`
        }).join('\n')

      const examples = await otherSitesExamples(req, trade, originalDoc?.id)

      const prompt = `Write the page copy for this site.

Trade: ${trade.label} (${trade.noun.toLowerCase()})
Location: ${locationName}
Brand name: ${brandName}
Target keywords: ${keywords || '(none given — use natural local search terms for this trade)'}

Issue card briefs (one card each, in this order):
${briefs('issue', ISSUE_COUNT)}

Booking step briefs (one step each, in this order):
${briefs('step', STEP_COUNT)}

"Why choose us" briefs (one card each, in this order):
${briefs('reason', REASON_COUNT)}

Approved Facts & Promises (the only claims you may make):
${approvedClaims || '(none — make no claims beyond the briefs)'}

FAQs: 3 questions a local customer would genuinely ask about emergency ${trade.label.toLowerCase()} in ${locationName}.
Availability check tick points: 3 short points; at least one should mention ${locationName}.
Reviews section text: name the most populated districts within ${locationName} itself.
"Why choose us" intro: name nearby towns and areas surrounding ${locationName} (not inside it), different from the districts above.
Areas (footer list): 6 real districts, suburbs or nearby towns covered from ${locationName}.

${
  examples.length
    ? `Wording already used on other ${trade.label} sites — do NOT reuse or closely echo any of it:\n${examples.map((e) => `- ${e}`).join('\n')}`
    : ''
}`

      let page = await callClaude(prompt)
      let problem = checkPage(page, locationName)
      if (problem) {
        // One retry with the problem pointed out
        page = await callClaude(
          `${prompt}\n\nYour previous attempt was rejected because the ${problem}. Fix this.`,
        )
        problem = checkPage(page, locationName)
        if (problem) throw new Error(`generated content was rejected (${problem})`)
      }

      data.hero = { eyebrow: page.heroEyebrow, headline: page.heroHeadline }
      data.issues = {
        heading: page.issuesHeading,
        subheading: page.issuesSubheading,
        ...toCards('issue', page.issues),
      }
      data.reviews = { heading: page.reviewsHeading, text: page.reviewsText }
      data.steps = { heading: page.stepsHeading, ...toCards('step', page.steps) }
      data.reasons = {
        heading: page.reasonsHeading,
        intro: page.reasonsIntro,
        ...toCards('reason', page.reasons),
      }
      data.faqsHeading = page.faqsHeading
      data.faqs = page.faqs
        .slice(0, 6)
        .map((faq) => ({ question: faq.question, answer: faq.answer }))
      data.check = {
        heading: page.checkHeading,
        bullets: page.checkBullets.slice(0, 4).map((text) => ({ text })),
      }
      data.areas = page.areas.slice(0, 8).map((area) => ({ area }))
      data.footerBlurb = page.footerBlurb
      data.seo = { metaTitle: page.metaTitle, metaDescription: page.metaDescription }

      data.generateContent = false
      return data
    } catch (error: any) {
      req.payload.logger.error(`Location site content generation failed: ${error?.message}`)
      throw new APIError(
        `Content generation failed: ${error?.message ?? 'unknown error'}. Nothing was changed — try saving again.`,
        400,
        null,
        true,
      )
    }
  }
