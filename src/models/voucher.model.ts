type Voucher = {
    id: number,
    code: string,
    title: string,
    description: string,
    voucherType: string,
    discountPercent?: number,
    discountAmount?: number,
    minOrderAmount?: number,
    maxDiscountAmount?: number,
    creatorType: string,
    creatorId?: number,
    startDate: Date,
    endDate: Date,
    totalQuantity: number,
    perUserLimit: number,
    applicablePayment: string,
    applicableProducts: Array<VoucherApplicableProductResponse>,
    applicableCategories: Array<VoucherApplicableCategoryResponse>,
}

type VoucherApplicableProductResponse = {
    productId: number,
    name: string
}

type VoucherApplicableCategoryResponse = {
    categoryId: number,
    name: string
}

export default Voucher;