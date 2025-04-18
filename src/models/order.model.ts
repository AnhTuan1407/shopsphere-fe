import OrderInfo from "./orderInfo.model";

type Order = {
    id: number,
    profileId: string,
    orderDate: Date,
    statusOrder: string,
    totalPrice: number,
    orderItems: [
        {
            id: number,
            productVariantId: number,
            supplierId: number,
            quantity: number,
            pricePerUnit: number
        }
    ],
    orderInfo: OrderInfo,
    paymentMethod: string,
    shippingFee?: number;
    voucherId?: number,
    note?: string,
}

export default Order;