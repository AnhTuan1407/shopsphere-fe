import FlashSaleItem from "../models/flashSaleItem.model";

type Props = {
    item: FlashSaleItem;
};

const FlashSaleProductCard = ({ item }: Props) => {
    const percent = Math.round(
        ((item.totalQuantity - item.soldQuantity) / item.totalQuantity) * 100
    );

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
            }}
        >
            {/* Ảnh sản phẩm */}
            <div
                style={{
                    height: "6rem",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                }}
            >
                <img
                    src={item.imageUrl}
                    alt={item.productName}
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* Tên sản phẩm */}
            <div
                style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "0.25rem",
                }}
                title={item.productName}
            >
                {item.productName}
            </div>

            {/* Loại sản phẩm */}
            <div
                style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                }}
            >
                {item.variantType}
            </div>

            {/* Giá gốc */}
            <div
                style={{
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    textDecoration: "line-through",
                    marginBottom: "0.25rem",
                }}
            >
                {item.originalPrice.toLocaleString()}₫
            </div>

            {/* Giá flash sale */}
            <div
                style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#ef4444",
                    marginBottom: "0.5rem",
                }}
            >
                {item.flashSalePrice.toLocaleString()}₫
            </div>

            {/* Thanh tiến độ */}
            <div
                style={{
                    width: "100%",
                    height: "0.5rem",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    marginBottom: "0.25rem",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: "linear-gradient(to right, #f97316, #ef4444)",
                    }}
                />
            </div>

            {/* Còn lại bao nhiêu sản phẩm */}
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Còn lại: {item.totalQuantity - item.soldQuantity}/{item.totalQuantity}
            </div>
        </div>
    );
};

export default FlashSaleProductCard;
