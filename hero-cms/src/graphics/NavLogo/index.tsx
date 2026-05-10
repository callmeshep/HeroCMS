import React from 'react'
import Link from 'next/link'
import { Logo } from '../Logo/index'

export const NavLogo: React.FC = () => {
  return (
    <Link href="/admin">
      <Logo />
    </Link>
  )
}
