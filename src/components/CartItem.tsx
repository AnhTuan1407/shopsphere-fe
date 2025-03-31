import { useEffect, useState } from "react";

type Props = {
    id?: number,
    productName?: string,
    productImage?: string,
    categoryName?: string,
    variantColor?: string,
    variantSize?: string,
    variantPrice?: number,
    quantity?: number,
    selected?: boolean,
    onUpdateQuantity?: (itemId: number, newQuantity: number) => void,
    onSelectItem?: (itemId: number, isSelected: boolean) => void,
    onDeleteItem?: (itemId: number) => void,
}

const CartItem = ({
    id,
    productName,
    productImage,
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedState(prev => !prev);
        onSelectItem && id && onSelectItem(id, e.target.checked);
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


    return (
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
            {/* Checkbox */}
            <div style={{ flexBasis: "5%", textAlign: "center" }}>
                <input type="checkbox" checked={selectedState} onChange={handleCheckboxChange} />
            </div>

            {/* Product Image */}
            <div style={{ flexBasis: "15%", textAlign: "center" }}>
                <img
                    src={productImage}
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
            <div style={{ flexBasis: "15%", textAlign: "center", fontSize: "14px", color: "#888" }}>
                ₫{variantPrice?.toLocaleString("vi-VN")}
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
                ₫{(quantityState * (variantPrice || 0)).toLocaleString("vi-VN")}
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
