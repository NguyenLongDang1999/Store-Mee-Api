// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface AttributeSearch extends Paginator {
    deleted_flg: boolean
    name?: string
    category_id?: string
}