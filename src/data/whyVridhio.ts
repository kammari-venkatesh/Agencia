import type { LucideIcon } from 'lucide-react'
import { Headphones, Layers, Scale, Target, Zap } from 'lucide-react'

export type WhyVridhioItem = {
  text: string
  icon: LucideIcon
}

export const whyVridhioHeading = 'Why Vridhio?'

export const whyVridhioSubheading =
  'More than just an agency — a complete technology, automation, and growth partner for modern businesses.'

export const whyVridhioItems: WhyVridhioItem[] = [
  { text: '✔ We focus on results, not just design', icon: Target },
  { text: '✔ Complete solution (Design + Tech + Marketing)', icon: Layers },
  { text: '✔ Fast turnaround time', icon: Zap },
  { text: '✔ Affordable & scalable pricing', icon: Scale },
  { text: '✔ Dedicated support', icon: Headphones },
]

export const whyVridhioTrustPills = [
  'Built for modern businesses',
  'Strategy + Technology + Growth',
  'Designed to scale with your business',
]
