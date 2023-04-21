// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface CategorySearch extends Paginator {
    name?: string
    parent_id?: string
    status?: number
    popular?: number
}