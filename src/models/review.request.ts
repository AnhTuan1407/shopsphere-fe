type ReviewRequest = {
    productId: number,
    productVariantId: number,
    profileId: string,
    rating: number,
    quality: string,
    trueToDescription: string,
    comment: string,
    imageUrls: Array<string>,
}

export default ReviewRequest;