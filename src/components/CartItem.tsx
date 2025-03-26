
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
}

const CartItem = ({
    id,
    productName,
    productImage,
    categoryName,
    variantColor,
    variantSize,
    variantPrice,
    quantity,
    selected,
}: Props) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            borderBottom: "1px solid #f0f0f0",
        }}>
            {/* Checkbox */}
            <div style={{
                flexBasis: "5%",
                textAlign: "center",
            }}>
                <input type="checkbox" checked={selected} />
            </div>

            {/* Product Image */}
            <div style={{
                flexBasis: "15%",
                textAlign: "center",
            }}>
                <img
                    src={productImage}
                    alt="product"
                    style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "4px",
                    }}
                />
            </div>

            {/* Product Name */}
            <div style={{
                flexBasis: "28%",
                paddingLeft: "10px",
                fontSize: "14px",
                color: "#333",
                fontWeight: "500",
            }}>
                <div>
                    {productName}
                </div>
                <div style={{
                    color: "#888",
                    fontSize: "14px",
                    fontWeight: "400",
                }}>
                    Loại: {variantColor ? variantColor : variantSize}
                </div>
            </div>

            {/* Unit Price */}
            <div style={{
                flexBasis: "15%",
                textAlign: "center",
                fontSize: "14px",
                color: "#888",
            }}>
                ₫{variantPrice}
            </div>

            {/* Quantity */}
            <div style={{
                flexBasis: "15%",
                textAlign: "center",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {/* Decrease Button */}
                    <button style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px 0 0 4px",
                    }}>
                        -
                    </button>

                    {/* Quantity Input */}
                    <input
                        type="number"
                        value={quantity}
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
                    <button style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "0 4px 4px 0",
                    }}>
                        +
                    </button>
                </div>
            </div>

            {/* Total Price */}
            <div style={{
                flexBasis: "15%",
                textAlign: "center",
                fontSize: "14px",
                color: "#ee4d2d",
                fontWeight: "bold",
            }}>
                {quantity! * variantPrice!}
            </div>

            {/* Delete Button */}
            <div style={{
                flexBasis: "7%",
                textAlign: "center",
            }}>
                <button style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    fontSize: "16px",
                }}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default CartItem;