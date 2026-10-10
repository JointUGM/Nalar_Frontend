import { createContext } from 'react'

/** The top-bar element a teacher page renders its title into; null outside the shell. */
export const PageHeadSlot = createContext<HTMLElement | null>(null)
