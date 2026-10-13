import type { Endpoint, PayloadRequest } from 'payload'

// Endpoints used by the Location Sites renderer (hero-location-renderer).
// Both require the shared secret in the "x-location-sites-secret" header,
// set as LOCATION_SITES_SECRET on the CMS and on the renderer.
//
// GET  /api/location-sites/page?host=liverpoolemergencyplumbers.co.uk
// GET  /api/location-sites/page?trade=plumbing&id=12        (preview — Drafts allowed)
// POST /api/location-sites/submit  { host | trade+id, postcode, phone }

const TRADES = ['plumbing', 'heating', 'electrics'] as const
type Trade = (typeof TRADES)[number]

// Reviews that mention any of these places are left out, so a review never
// contradicts the site's location. Matched as whole words, case-insensitive.
// (Words that are also everyday words or common first names — e.g. Bath, Reading, Barry — are left out.)
const PLACE_NAMES = [
  // England — cities and large towns
  'London',
  'Manchester',
  'Liverpool',
  'Birmingham',
  'Leeds',
  'Sheffield',
  'Bristol',
  'Newcastle',
  'Nottingham',
  'Leicester',
  'Coventry',
  'Bradford',
  'Hull',
  'Stoke',
  'Wolverhampton',
  'Derby',
  'Southampton',
  'Portsmouth',
  'Plymouth',
  'Luton',
  'Northampton',
  'Milton Keynes',
  'Brighton',
  'Hove',
  'Bournemouth',
  'Poole',
  'Swindon',
  'Oxford',
  'Cambridge',
  'Norwich',
  'Ipswich',
  'Peterborough',
  'Exeter',
  'Gloucester',
  'Cheltenham',
  'York',
  'Lincoln',
  'Chester',
  'Preston',
  'Blackpool',
  'Blackburn',
  'Bolton',
  'Bury',
  'Rochdale',
  'Oldham',
  'Stockport',
  'Salford',
  'Wigan',
  'Warrington',
  'Widnes',
  'Runcorn',
  'St Helens',
  'Southport',
  'Wirral',
  'Birkenhead',
  'Bootle',
  'Crosby',
  'Huyton',
  'Knowsley',
  'Sefton',
  'Trafford',
  'Tameside',
  'Burnley',
  'Lancaster',
  'Carlisle',
  'Sunderland',
  'Gateshead',
  'Durham',
  'Middlesbrough',
  'Darlington',
  'Hartlepool',
  'Stockton',
  'Huddersfield',
  'Halifax',
  'Wakefield',
  'Barnsley',
  'Rotherham',
  'Doncaster',
  'Harrogate',
  'Scarborough',
  'Grimsby',
  'Scunthorpe',
  'Mansfield',
  'Chesterfield',
  'Telford',
  'Shrewsbury',
  'Walsall',
  'Dudley',
  'West Bromwich',
  'Solihull',
  'Sutton Coldfield',
  'Worcester',
  'Hereford',
  'Redditch',
  'Nuneaton',
  'Rugby',
  'Warwick',
  'Leamington',
  'Stafford',
  'Crewe',
  'Macclesfield',
  'Basingstoke',
  'Guildford',
  'Woking',
  'Crawley',
  'Croydon',
  'Watford',
  'St Albans',
  'Stevenage',
  'Harlow',
  'Chelmsford',
  'Colchester',
  'Southend',
  'Basildon',
  'Maidstone',
  'Canterbury',
  'Dover',
  'Ashford',
  'Margate',
  'Medway',
  'Chatham',
  'Gillingham',
  'Slough',
  'High Wycombe',
  'Aylesbury',
  'Bedford',
  'Kettering',
  'Corby',
  'Wellingborough',
  'Salisbury',
  'Taunton',
  'Yeovil',
  'Torquay',
  'Truro',
  'Weymouth',
  'Eastbourne',
  'Hastings',
  'Worthing',
  'Chichester',
  'Winchester',
  'Bracknell',
  'Wokingham',
  'Newbury',
  'Merseyside',
  'Lancashire',
  'Yorkshire',
  'Cheshire',
  'Cumbria',
  'Midlands',
  'Essex',
  'Kent',
  'Surrey',
  'Sussex',
  'Devon',
  'Cornwall',
  'Somerset',
  'Dorset',
  'Hampshire',
  'Berkshire',
  'Norfolk',
  'Suffolk',
  // Scotland
  'Glasgow',
  'Edinburgh',
  'Aberdeen',
  'Dundee',
  'Inverness',
  'Stirling',
  'Perth',
  'Paisley',
  'Livingston',
  'Falkirk',
  'Kilmarnock',
  'Ayr',
  // Wales
  'Cardiff',
  'Swansea',
  'Newport',
  'Wrexham',
  'Bangor',
  'Bridgend',
  'Llanelli',
  // Northern Ireland
  'Belfast',
  'Derry',
  'Lisburn',
  'Newry',
  'Armagh',
]

const placePattern = new RegExp(
  `\\b(${PLACE_NAMES.map((p) => p.replace(/\s+/g, '\\s+')).join('|')})\\b`,
  'i',
)
const postcodePattern = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i
const heroPattern = /\bhero/i

const reviewIsUsable = (review: any) => {
  const text = `${review?.title ?? ''} ${review?.reviewBody ?? ''}`
  if (!review?.reviewBody?.trim()) return false
  return !heroPattern.test(text) && !placePattern.test(text) && !postcodePattern.test(text)
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

const authorised = (req: PayloadRequest) => {
  const secret = process.env.LOCATION_SITES_SECRET
  return Boolean(secret) && req.headers.get('x-location-sites-secret') === secret
}

const cleanHost = (host: string) =>
  host
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[:/?#].*$/, '')

// Finds the site for a domain (Live only) or for a trade + id (preview, any status)
const findSite = async (
  req: PayloadRequest,
  params: { host?: string | null; trade?: string | null; id?: string | null },
): Promise<{ trade: Trade; site: any } | null> => {
  if (params.trade && params.id) {
    const trade = params.trade as Trade
    if (!TRADES.includes(trade)) return null
    try {
      const site = await req.payload.findByID({
        collection: `location-sites-${trade}` as any,
        id: params.id,
        depth: 1,
        overrideAccess: true,
      })
      return site ? { trade, site } : null
    } catch {
      return null
    }
  }

  if (!params.host) return null
  const host = cleanHost(params.host)
  for (const trade of TRADES) {
    const result = await req.payload.find({
      collection: `location-sites-${trade}` as any,
      where: { and: [{ domain: { equals: host } }, { status: { equals: 'live' } }] },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    if (result.docs[0]) return { trade, site: result.docs[0] }
  }
  return null
}

// Removes internal fields the public site never needs
const publicSite = (site: any) => {
  const { keywords, generateContent, tenant, ...rest } = site ?? {}
  const { ghlTag, ...tracking } = rest.tracking ?? {}
  return { ...rest, tracking }
}

const publicTradeGlobals = (tradeGlobals: any) => {
  const strip = (group: any) => {
    if (!group || typeof group !== 'object') return group
    const { brief, ...rest } = group
    return rest
  }
  return Object.fromEntries(
    Object.entries(tradeGlobals ?? {}).map(([key, value]) => [
      key,
      /^(issue|step|reason)\d+$/.test(key) ? strip(value) : value,
    ]),
  )
}

export const locationSitesEndpoints: Endpoint[] = [
  {
    path: '/location-sites/page',
    method: 'get',
    handler: async (req) => {
      if (!authorised(req)) return json({ error: 'Unauthorised' }, 401)

      const params = req.searchParams
      const found = await findSite(req, {
        host: params?.get('host'),
        trade: params?.get('trade'),
        id: params?.get('id'),
      })
      if (!found) return json({ error: 'Not found' }, 404)

      const globals: any = await req.payload.findGlobal({
        slug: 'location-sites-globals',
        depth: 1,
        overrideAccess: true,
      } as any)

      const reviews = await req.payload.find({
        collection: 'reviews' as any,
        where: {
          and: [
            { serviceType: { equals: found.trade } },
            { visible: { equals: true } },
            { rating: { in: ['4', '5'] } },
          ],
        },
        sort: '-date',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })

      const { approvedClaims, ghlTenant, ghlPipeline, ghlStage, ghlTags, ...allSites } =
        globals?.allSites ?? {}

      return json({
        trade: found.trade,
        site: publicSite(found.site),
        allSites,
        tradeGlobals: publicTradeGlobals(globals?.[found.trade]),
        reviews: reviews.docs
          .filter(reviewIsUsable)
          .slice(0, 12)
          .map((review: any) => ({
            id: review.id,
            name: review.customerName,
            rating: Number(review.rating) || 5,
            title: review.title || '',
            body: review.reviewBody,
          })),
      })
    },
  },
  {
    path: '/location-sites/submit',
    method: 'post',
    handler: async (req) => {
      if (!authorised(req)) return json({ error: 'Unauthorised' }, 401)

      let body: any = {}
      try {
        body = (await req.json?.()) ?? {}
      } catch {
        return json({ error: 'Invalid request' }, 400)
      }

      const postcode = String(body.postcode ?? '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, ' ')
      const phone = String(body.phone ?? '').trim()

      if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(postcode)) {
        return json({ error: 'Please enter a valid UK postcode' }, 400)
      }
      if (phone.replace(/\D/g, '').length < 10) {
        return json({ error: 'Please enter a valid phone number' }, 400)
      }

      const found = await findSite(req, { host: body.host, trade: body.trade, id: body.id })
      if (!found) return json({ error: 'Site not found' }, 404)

      const tenantId =
        typeof found.site.tenant === 'object' ? found.site.tenant?.id : found.site.tenant

      await req.payload.create({
        collection: 'location-sites-submissions' as any,
        data: {
          tenant: tenantId,
          postcode,
          phone,
          service: found.trade,
          brandName: found.site.brandName,
          locationName: found.site.locationName,
          domain: found.site.domain || '(preview)',
        } as any,
        overrideAccess: true,
      })

      return json({ ok: true })
    },
  },
]
