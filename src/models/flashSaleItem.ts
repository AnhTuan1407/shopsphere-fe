type FlashSaleItem = {
    id: number,
    productId: number,
    productVariantId: number,
    originalPrice: number,
    flashSalePrice: number,
    discountType: string,
    discountValue: number,
    totalQuantity: number,
    soldQuantity: number,
    maxPerUser: number,
    status: string,
    productName: string,
    variantType: string,
    imageUrl: string,
}

export default FlashSaleItem;