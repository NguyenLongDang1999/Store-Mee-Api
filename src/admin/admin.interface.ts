// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface AdminSearch extends Paginator {
    deleted_flg: boolean
    name?: string
    email?: string
    phone?: string
    gender?: number
    role?: number
    created_at?: Date | string
}

export interface AdminList {
    id: string
    name: string
    email: string
    phone: string
    gender: number
    role: number
    image_uri: string
}