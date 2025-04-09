import Category from "./category.model";
import ProductVariants from "./productVariants.model";
import Supplier from "./supplier.model";

type Product = {
    id?: number,
    name?: string,
    description?: string,
    imageUrl?: string,
    category?: Category,
    supplier?: Supplier,
    variants?: Array<ProductVariants>
}

export default Product;