export interface CollectionCategory {
  id: string
  name: string
}

export interface Collection {
  id: string
  label: string
  description: string | null
  image: string
  color: string | null
  category: CollectionCategory
}
