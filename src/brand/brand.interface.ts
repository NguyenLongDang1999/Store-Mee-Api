// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface BrandSearch extends Paginator {
    deleted_flg: boolean
    name?: string
    category_id?: string
    status?: number
    popular?: number
}