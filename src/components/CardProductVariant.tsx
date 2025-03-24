import { Variant } from "antd/es/config-provider";
import ProductVariants from "../models/productVariants.model";

type Props = ProductVariants & {
    handleOnSelect: (Variant: ProductVariants) => void;
    isSelected: boolean;
};

const CardProductVariant = ({
    id,
    color,
    size,
    imageUrl,
    price,
    availableQuantity,
    rating,
    quantitySold,
    handleOnSelect,
    isSelected,
}: Props) => {
    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "2px",
                boxSizing: "border-box",
                cursor: "pointer",
                justifyContent: "center",
                margin: "4px 4px 0 0",
                minHeight: "2.5rem",
                minWidth: "5rem",
                outline: "0",
                overflow: "hidden",
                padding: "0.5rem",
                wordBreak: "break-word",
                textAlign: "left",
                position: "relative",
                color: "black",
                maxWidth: "6rem",
                border: isSelected ? "1px solid #ee4d2d" : "1px solid rgba(0, 0, 0, .09)",
            }}
                // onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid #ee4d2d", e.currentTarget.style.color = "#ee4d2d")}
                // onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid #757575", e.currentTarget.style.color = "black")}

                onClick={() => handleOnSelect({
                    id,
                    color,
                    size,
                    imageUrl,
                    price,
                    availableQuantity,
                    rating,
                    quantitySold,
                })}

            >
                <img src={imageUrl} alt="variant" style={{
                    height: "1.5rem",
                    width: "1.5rem",
                    marginRight: "0.5rem",
                }} />
                <div style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "10px"
                }}>
                    {color || size || ""}
                </div>
            </div>
        </>
    );
}

export default CardProductVariant;