export interface Item {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface CreateItemDto {
  name: string
  description?: string
  price: number
  stock: number
  category: string
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}
