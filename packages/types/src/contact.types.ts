export interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  address?:  string   
  taxId?:    string   
  createdAt: string
  updatedAt: string
}

export interface CreateContactDto {
  name: string
  email: string
  phone?: string
  address?: string
  taxId?: string
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}
