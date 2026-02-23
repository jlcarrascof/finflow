export interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  type: 'client' | 'supplier'
  createdAt: string
  updatedAt: string
}

export interface CreateContactDto {
  name: string
  email: string
  phone?: string
  type: 'client' | 'supplier'
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}
