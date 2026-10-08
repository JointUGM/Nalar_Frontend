import { Link } from 'react-router'
import type { LinkProps } from 'react-router'
import { buttonClass } from './buttonStyles'

/** A real link that looks like a Button, for navigation that must not be a button. */
export function ButtonLink({ tone = 'primary', className, ...props }: LinkProps & { tone?: 'primary' | 'secondary' | 'ghost' }) {
  return <Link {...props} className={buttonClass(tone, 'adult', className)} />
}
