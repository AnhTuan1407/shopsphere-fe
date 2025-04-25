import { Card } from 'antd';
import Product from '../models/product.model';
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

type Props = Product;

const CardProduct = ({
    id,
    name,
    description,
    imageUrl,
    variants
}: Props) => {
    const findMinPrice = () => {
        if (!variants || variants.length === 0) return "Liên hệ";

        let minPrice = variants[0].price || 0;

        for (let i = 1; i < variants.length; i++) {
            if ((variants[i].price || 0) < minPrice) {
                minPrice = variants[i].price || 0;
            }
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(minPrice);
    };

    const navigate = useNavigate();

    return (
        <>
            <div
                style={{
                    width: "200px",
                    border: "1px solid #ddd",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    background: "#fff",
                    padding: "10px",
                    transition: "transform 0.3s ease",
                    cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}

                onClick={() => navigate(`/products/${id}`)}
            >

                <img
                    src={imageUrl}
                    alt={name}
                    style={{ width: "100%", maxHeight: "175px", objectFit: "cover" }}
                />

                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        marginTop: "10px",
                        color: "#333",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                        padding: "0 5px",
                        height: "36px",
                    }}
                >
                    {name}
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#FF424E",
                            marginTop: "8px",
                            padding: "0 5px",
                        }}
                    >
                        {findMinPrice()}
                    </div>
                    <div style={{
                        border: "1px solid red",
                        color: "red",
                        marginTop: "8px",
                        padding: "0 5px",
                        fontSize: "12px"
                    }}>
                        Rẻ vô địch
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px",
                        padding: "0 5px",
                    }}
                >
                    <div style={{ fontSize: "12px", color: "#757575" }}>
                        {variants && variants.length > 0 && variants[0].quantitySold
                            ? `Đã bán ${variants.reduce((total, variant) => total + (variant.quantitySold || 0), 0)}`
                            : "Mới ra mắt"}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardProduct;