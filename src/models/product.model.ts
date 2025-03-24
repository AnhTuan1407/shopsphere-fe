import Category from "./category.model";
import ProductVariants from "./productVariants.model";

type Product = {
    id?: number,
    name?: string,
    description?: string,
    imageUrl?: string,
    category?: Category
    variants?: Array<ProductVariants>
}

export default Product;