// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface VariantSearch extends Paginator {
    deleted_flg: boolean
    name?: string
    attribute_id?: string
}