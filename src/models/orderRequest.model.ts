type Product = {
    productVariantId: number;
    quantity: number;
    price: number;
    variantPrice: number;
    productImage: string;
    productName: string;
    variantColor?: string;
    variantSize?: string;
};

type OrderRequest = {
    profileId: string;
    orderInfoId: number;
    products: Product[];
};

export default OrderRequest;