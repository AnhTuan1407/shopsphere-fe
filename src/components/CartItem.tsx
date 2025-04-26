import { useEffect, useState } from "react";
import FlashSale from "../models/flashSale.model";
import FlashSaleItem from "../models/flashSaleItem.model";
import saleService from "../services/sale.service";
import { toast } from "react-toastify";

type Props = {
    id?: number,
    productId?: number,
    productVariantId?: number,
    productName?: string,
    productImage?: string,
    variantImage?: string,
    categoryName?: string,
    variantColor?: string,
    variantSize?: string,
    variantPrice?: number,
    quantity?: number,
    selected?: boolean,
    onUpdateQuantity?: (itemId: number, newQuantity: number) => void,
    onSelectItem?: (itemId: number, isSelected: boolean, totalUnitPrice: number, unitPrice: number) => void,
    onDeleteItem?: (itemId: number) => void,
}

const CartItem = ({
    id,
    productId,
    productVariantId,
    productName,
    productImage,
    variantImage,
    categoryName,
    variantColor,
    variantSize,
    variantPrice,
    quantity = 1,
    selected,
    onUpdateQuantity,
    onSelectItem,
    onDeleteItem
}: Props) => {
    const [quantityState, setQuantityState] = useState(quantity);
    const [selectedState, setSelectedState] = useState(selected);

    const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
    const [flashSaleItem, setFlashSaleItem] = useState<FlashSaleItem | null>(null);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        const unitPrice = flashSaleItem?.flashSalePrice;
        const totalUnitPrice = calculateTotalPrice();

        setSelectedState(isChecked);

        onSelectItem && id && onSelectItem(id, isChecked, totalUnitPrice, unitPrice!);
    };

    useEffect(() => {
        setQuantityState(quantity);
        setSelectedState(selected);
    }, [quantity, selected]);

    const handleIncrease = () => {
        if (!id) return;

        const newQuantity = quantityState + 1;
        setQuantityState(newQuantity);
        onUpdateQuantity?.(id, newQuantity);
    };

    const handleDecrease = () => {
        if (!id || quantityState <= 1) return;

        const newQuantity = quantityState - 1;
        setQuantityState(newQuantity);
        onUpdateQuantity?.(id, newQuantity);
    };

    // Fetch Flash Sales
    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const response = await saleService.getAllFlashSalesActive();
                if (response.code === 1000) {
                    const flashSaleData = response.result as FlashSale[];
                    setFlashSales(flashSaleData);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách flash sale:", error);
            }
        };

        fetchFlashSales();
    }, []);

    // Kiểm tra sản phẩm có trong flash sale không
    useEffect(() => {
        if (!productId || !flashSales.length) return;

        // Tìm flash sale item cho sản phẩm hiện tại
        for (const flashSale of flashSales) {
            const foundItem = flashSale.flashSaleItems.find(item =>
                item.productId === productId &&
                (!productVariantId || item.productVariantId === productVariantId)
            );

            if (foundItem) {
                setFlashSaleItem(foundItem);
                return;
            }
        }

        // Nếu không tìm thấy, reset flash sale item
        setFlashSaleItem(null);
    }, [productId, flashSales, productVariantId]);

    // Tính giá giảm giá
    const calculateDiscountedPrice = () => {
        if (!flashSaleItem || !variantPrice) return null;

        const originalPrice = variantPrice || 0;

        if (flashSaleItem.discountType === 'PERCENTAGE') {
            const discountAmount = originalPrice * (flashSaleItem.discountValue / 100);
            return originalPrice - discountAmount;
        } else if (flashSaleItem.discountType === 'AMOUNT') {
            return originalPrice - flashSaleItem.discountValue;
        }

        return originalPrice;
    };

    // Tính phần trăm giảm giá
    const calculateDiscountPercentage = () => {
        if (!flashSaleItem || !variantPrice) return 0;

        const originalPrice = variantPrice || 0;
        if (originalPrice === 0) return 0;

        if (flashSaleItem.discountType === 'PERCENTAGE') {
            return flashSaleItem.discountValue;
        } else if (flashSaleItem.discountType === 'AMOUNT') {
            return Math.round((flashSaleItem.discountValue / originalPrice) * 100);
        }

        return 0;
    };

    const discountedPrice = calculateDiscountedPrice();
    const discountPercentage = calculateDiscountPercentage();

    // Tính giá tổng dựa trên giá giảm nếu sản phẩm có trong flash sale
    const calculateTotalPrice = () => {
        if (flashSaleItem && discountedPrice) {
            return quantityState * discountedPrice;
        }
        return quantityState * (variantPrice || 0);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
            {/* Checkbox */}
            <div style={{ flexBasis: "5%", textAlign: "center" }}>
                <input type="checkbox" checked={selectedState} onChange={handleCheckboxChange} />
            </div>

            {/* Product Image */}
            <div style={{ flexBasis: "15%", textAlign: "center" }}>
                <img
                    src={variantImage}
                    alt="product"
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                />
            </div>

            {/* Product Name */}
            <div style={{ flexBasis: "28%", paddingLeft: "10px", fontSize: "14px", color: "#333", fontWeight: "500" }}>
                <div>{productName}</div>
                <div style={{ color: "#888", fontSize: "14px", fontWeight: "400" }}>
                    Loại: {variantColor ? variantColor : variantSize}
                </div>
            </div>

            {/* Unit Price */}
            <div style={{ flexBasis: "15%", textAlign: "center", fontSize: "14px" }}>
                {flashSaleItem ? (
                    <div>
                        <div style={{ color: "#ee4d2d", fontWeight: "500" }}>
                            ₫{discountedPrice!.toLocaleString("vi-VN")}
                        </div>
                        <div style={{ textDecoration: "line-through", color: "#888", fontSize: "12px" }}>
                            ₫{variantPrice!.toLocaleString("vi-VN")}
                        </div>
                        <div style={{ color: "#ee4d2d", fontSize: "12px", backgroundColor: "#fff0ee", padding: "1px 4px", display: "inline-block", borderRadius: "2px", margin: "2px 0" }}>
                            -{discountPercentage}%
                        </div>
                    </div>
                ) : (
                    <div style={{ color: "#888" }}>
                        ₫{variantPrice!.toLocaleString("vi-VN")}
                    </div>
                )}
            </div>

            {/* Quantity */}
            <div style={{ flexBasis: "15%", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* Decrease Button */}
                    <button
                        onClick={handleDecrease}
                        style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: "4px 0 0 4px",
                        }}
                    >
                        -
                    </button>

                    {/* Quantity Input */}
                    <input
                        type="number"
                        value={quantityState}
                        readOnly
                        style={{
                            width: "50px",
                            textAlign: "center",
                            border: "1px solid #ccc",
                            borderLeft: "none",
                            borderRight: "none",
                            padding: "5px",
                        }}
                    />

                    {/* Increase Button */}
                    <button
                        onClick={handleIncrease}
                        style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: "0 4px 4px 0",
                        }}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Total Price */}
            <div style={{ flexBasis: "15%", textAlign: "center", fontSize: "14px", color: "#ee4d2d", fontWeight: "bold" }}>
                ₫{calculateTotalPrice().toLocaleString("vi-VN")}
            </div>

            {/* Delete Button */}
            <div style={{ flexBasis: "7%", textAlign: "center" }}>
                <button
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#888",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}

                    onClick={() => {
                        if (id) {
                            onDeleteItem?.(id);
                        }
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default CartItem;