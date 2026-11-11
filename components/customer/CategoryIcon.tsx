import { Paintbrush, Hand, Disc3, Leaf, Music, type LucideIcon, type LucideProps } from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = { Paint: Paintbrush, Clay: Hand, Throwing: Disc3, Seasonal: Leaf, Music }

export function CategoryIcon({ category, ...props }: LucideProps & { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Hand
  return <Icon aria-hidden="true" {...props} />
}
