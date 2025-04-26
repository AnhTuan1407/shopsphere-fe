import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import FlashSale from '../models/flashSale.model';
import Product from '../models/product.model';
import saleService from '../services/sale.service';
import FlashSaleItem from '../models/flashSaleItem.model';

const { Meta } = Card;

type Props = Product;

const CardProduct = ({
    id,
    name,
    description,
    imageUrl,
    variants
}: Props) => {
    const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
    const [flashSaleItem, setFlashSaleItem] = useState<FlashSaleItem | null>(null);

    // Trả về giá thấp nhất dưới dạng số hoặc null nếu không có giá
    const findMinPrice = (): number | null => {
        if (!variants || variants.length === 0) return null;

        let minPrice = variants[0].price || 0;

        for (let i = 1; i < variants.length; i++) {
            if ((variants[i].price || 0) < minPrice) {
                minPrice = variants[i].price || 0;
            }
        }

        return minPrice;
    };

    // Hàm hiển thị giá định dạng tiền tệ hoặc "Liên hệ" nếu không có giá
    const formatPrice = (price: number | null): string => {
        if (price === null) return "Liên hệ";

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateDiscountedPrice = (): number | null => {
        if (!flashSaleItem) return null;

        const originalPrice = findMinPrice();
        if (originalPrice === null) return null;

        if (flashSaleItem.discountType === 'PERCENTAGE') {
            const discountAmount = originalPrice * (flashSaleItem.discountValue / 100);
            return originalPrice - discountAmount;
        } else if (flashSaleItem.discountType === 'AMOUNT') {
            return originalPrice - flashSaleItem.discountValue;
        }

        return originalPrice;
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlashSale = async () => {
            try {
                const response = await saleService.getAllFlashSalesActive();
                if (response.code === 1000) {
                    const flashSaleData = response.result as FlashSale[];
                    setFlashSales(flashSaleData);

                    // Tìm flash sale item cho sản phẩm hiện tại
                    for (const flashSale of flashSaleData) {
                        const foundItem = flashSale.flashSaleItems.find(item => item.productId === id);
                        if (foundItem) {
                            setFlashSaleItem(foundItem);
                            break;
                        }
                    }
                }
                else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra");
            }
        }

        fetchFlashSale();
    }, [id]);

    const minPrice = findMinPrice();
    const discountedPrice = calculateDiscountedPrice();
    const hasFlashSale = flashSaleItem !== null && minPrice !== null;

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
                    <div style={{
                        marginTop: "8px",
                        padding: "0 5px",
                    }}>
                        {hasFlashSale ? (
                            <div>
                                <span
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: "#FF424E",
                                    }}
                                >
                                    {formatPrice(discountedPrice)}
                                </span>
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#757575",
                                        textDecoration: "line-through",
                                        marginLeft: "5px"
                                    }}
                                >
                                    {formatPrice(minPrice)}
                                </span>
                            </div>
                        ) : (
                            <div
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "#FF424E",
                                }}
                            >
                                {formatPrice(minPrice)}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
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
                    <div style={{
                        border: "1px solid red",
                        color: "red",
                        marginTop: "8px",
                        padding: "0 5px",
                        fontSize: "12px"
                    }}>
                        {hasFlashSale ? "Flash Sale" : "Rẻ vô địch"}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardProduct;