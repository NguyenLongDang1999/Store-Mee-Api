// ** Utils Imports
import { Paginator } from 'src/utils/interfaces'

export interface ProductSearch extends Paginator {
    sku?: string
    name?: string
    brand_id?: string
    category_id?: string
    quantity?: number
    price?: number
    price_discount?: number
    type_discount?: number
    status?: number
    popular?: number
}