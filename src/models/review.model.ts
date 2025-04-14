import Product from "./product.model"
import ProductVariants from "./productVariants.model"
import Profile from "./profile.model"
import ReviewImage from "./reviewImage.model";

type Review = {
    id: number,
    product: Product,
    productVariant: ProductVariants,
    profile: Profile,
    rating: number,
    quality: string,
    createdAt: Date,
    likeCount: number,
    supplierReply: string,
    trueToDescription: string,
    comment: string,
    images: Array<ReviewImage>,
}

export default Review;