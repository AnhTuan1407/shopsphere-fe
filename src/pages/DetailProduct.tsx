import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import deliveryIcon from "../assets/delivery-icon.svg";
import privacyIcon from "../assets/privacy-icon.svg";
import starRating from "../assets/star-rating.svg";
import CardProductVariant from "../components/CardProductVariant";
import Product from "../models/product.model";
import ProductVariants from "../models/productVariants.model";
import productService from "../services/product.service";
import ButtonField from "../components/ButtonField";

const DetailProduct = () => {
    const [product, setProduct] = useState<Product>({
        variants: [],
    });

    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(Number(id));
                setProduct(data);
                setSelectedVariant(data.variants?.[0]);
                setSelectedVariantId(data.variants?.[0]?.id || null);
            } catch (error) {
                console.log(error);
            }
        }

        fetchProduct();
    }, [])

    const getDeliveryDateRange = () => {
        const today = new Date();
        const startDate = new Date(today);
        const endDate = new Date(today);

        startDate.setDate(today.getDate() + 2);
        endDate.setDate(today.getDate() + 4);

        const formatDate = (date: Date) => {
            const day = date.getDate();
            const month = date.toLocaleString("vi-VN", { month: "short" });
            return `${day} ${month}`;
        };

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const handleSelectVariant = (variant: ProductVariants) => {
        setSelectedVariant(variant);
        setSelectedVariantId(variant?.id ?? null);
    };

    const handleIncrease = () => {
        setQuantity((prev) => {
            if (selectedVariant?.availableQuantity && prev >= selectedVariant.availableQuantity) {
                return selectedVariant.availableQuantity; // Không cho tăng quá số lượng có sẵn
            }
            return prev + 1;
        });
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Không cho giảm dưới 1
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value)); // Đảm bảo số lượng không nhỏ hơn 1
        if (selectedVariant?.availableQuantity && value > selectedVariant.availableQuantity) {
            setQuantity(selectedVariant.availableQuantity); // Đặt về số lượng có sẵn nếu vượt quá
        } else {
            setQuantity(value);
        }
    };

    return (
        <>
            <div style={{
                height: "calc(100vh-306px)",
                width: "1200px",
                margin: "0 auto",
                padding: "2rem 4rem",
                overflowY: 'auto',
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.75rem"
                }}>
                    <a href="/">Shopee</a>
                    <span><img src={arrow} alt="arrow" style={{ margin: "0 5px", height: "10px", width: "10px" }} /></span>
                    <a>{product.category?.name}</a>
                    <span><img src={arrow} alt="arrow" style={{ margin: "0 5px", height: "10px", width: "10px" }} /></span>
                    <p>{product.name}</p>
                </div>

                {/* Product Information */}
                <div style={{
                    display: "flex",
                    backgroundColor: "#fff"
                }}>
                    <div style={{
                        flexBasis: "40%",
                        padding: "15px"
                    }}>
                        <img src={product.imageUrl} alt="img-product" style={{
                            objectFit: "contain",
                            width: "400px",

                        }} />
                    </div>

                    <div style={{
                        flexBasis: "60%",
                        padding: "20px 35px 0 20px"
                    }}>
                        <div style={{
                            fontSize: "1.15rem",
                            fontWeight: "500"
                        }}>
                            {product.name}
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "0.625rem",
                            minHeight: "1.55rem",
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    borderRight: "1px solid rgba(0, 0, 0, .14)",
                                }}>

                                    {/* Rating */}
                                    <div style={{
                                        borderBottom: "1px solid #222",
                                        paddingBottom: "1px",
                                        marginRight: "1px",
                                        fontWeight: "500"
                                    }}>
                                        4.7
                                    </div>
                                    <div style={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>
                                        <div style={{
                                            backgroundImage: `url(${starRating})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "contain",
                                            width: "13px",
                                            height: "13px",
                                        }}>

                                        </div>
                                        <div style={{
                                            backgroundImage: `url(${starRating})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "contain",
                                            width: "13px",
                                            height: "13px",
                                        }}>

                                        </div>
                                        <div style={{
                                            backgroundImage: `url(${starRating})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "contain",
                                            width: "13px",
                                            height: "13px",
                                        }}>

                                        </div>
                                        <div style={{
                                            backgroundImage: `url(${starRating})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "contain",
                                            width: "13px",
                                            height: "13px",
                                        }}>

                                        </div>
                                        <div style={{
                                            backgroundImage: `url(${starRating})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "contain",
                                            width: "13px",
                                            height: "13px",
                                        }}>

                                        </div>
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div style={{
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    borderRight: "1px solid rgba(0, 0, 0, .14)",
                                }}>
                                    <div style={{
                                        borderBottom: "1px solid #222",
                                        paddingBottom: "1px",
                                        margin: "0 10px",
                                    }}>
                                        13
                                    </div>
                                    <div>
                                        Đánh giá
                                    </div>
                                </div>

                                {/* Quantity Sold */}
                                <div style={{
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 10px",
                                }}>
                                    <div style={{
                                        borderBottom: "1px solid #222",
                                        paddingBottom: "1px",
                                        margin: "0 10px",
                                    }}>899</div>
                                    <div>Sold</div>
                                </div>
                            </div>
                            <div>
                                Tố cáo
                            </div>
                        </div>

                        {/* Price */}
                        <div style={{
                            padding: "15px 20px",
                            backgroundColor: "#fafafa",
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <span style={{
                                    color: "#ee4d2d",
                                    fontSize: "20px",
                                    fontWeight: "500px",
                                }}>₫</span>
                                <div style={{
                                    color: "#ee4d2d",
                                    fontSize: "28px",
                                    fontWeight: "500px",
                                }}>
                                    {selectedVariant?.price}
                                </div>
                            </div>
                            <div style={{
                                color: "#929292",
                                textDecoration: "line-through",
                                margin: "0 10px"
                            }}>
                                ₫{(selectedVariant?.price ?? 0) * 128 / 100};
                            </div>
                            <div style={{
                                backgroundColor: "#feeeea",
                                color: "#ee4d2d",
                                display: "inline-block",
                                fontSize: "12px",
                                fontWeight: "700",
                                height: "18px",
                                padding: "0 4px"
                            }}>
                                -28%
                            </div>
                        </div>

                        {/* Delivery */}
                        <div style={{
                            display: "flex",
                            marginTop: "15px",
                        }}>
                            <div style={{
                                color: "#757575",
                                fontWeight: "400",
                                marginRight: "10px",
                                textTransform: "capitalize",
                                fontSize: "12px",
                                width: "6.25rem",
                                flexWrap: "wrap",
                            }}>
                                Vận chuyển
                            </div>
                            <div style={{
                                display: "flex",
                            }}>
                                <div style={{
                                    marginRight: "5px",
                                }}>
                                    <img src={deliveryIcon} alt="delivery-icon" />
                                </div>

                                <div style={{
                                    fontSize: "12px",
                                }}>
                                    <div>Nhận từ {getDeliveryDateRange()}</div>
                                    <div>Miễn phí vận chuyển</div>
                                    <div style={{ fontSize: "11px", color: "#757575" }}>Tặng Voucher ₫{(selectedVariant?.price ?? 0) * 30 / 100} nếu đơn giao sau thời gian trên</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            marginTop: "15px",
                        }}>
                            <div style={{
                                color: "#757575",
                                fontWeight: "400",
                                marginRight: "10px",
                                textTransform: "capitalize",
                                fontSize: "12px",
                                width: "6.25rem",
                                flexWrap: "wrap",
                            }}>
                                An tâm mua hàng cùng shopee
                            </div>
                            <div style={{
                                display: "flex"
                            }}>
                                <div style={{ marginRight: "5px", }}>
                                    <img src={privacyIcon} alt="" />
                                </div>
                                <div style={{ fontSize: "12px" }}>Trả hàng miễn phí 15 ngày</div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div style={{
                            display: "flex",
                            marginTop: "15px",
                        }}>
                            <div style={{
                                color: "#757575",
                                fontWeight: "400",
                                marginRight: "10px",
                                textTransform: "capitalize",
                                fontSize: "12px",
                                width: "6.25rem",
                                flexWrap: "wrap",
                            }}>
                                Loại
                            </div>

                            <div style={{
                                display: "flex",
                                flexBasis: "32rem",
                                flexWrap: "wrap",
                                overflowY: "auto",
                                maxHeight: "14rem",
                                maxWidth: "32rem",
                                overflow: "scroll",
                            }}>
                                {(product.variants ?? []).map((variant) => (
                                    <CardProductVariant
                                        key={variant.id}
                                        id={variant.id}
                                        color={variant.color}
                                        size={variant.size}
                                        imageUrl={product.imageUrl}
                                        price={variant.price}
                                        availableQuantity={variant.availableQuantity}
                                        rating={variant.rating}
                                        quantitySold={variant.quantitySold}
                                        handleOnSelect={handleSelectVariant}
                                        isSelected={variant.id === selectedVariantId}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div style={{
                            display: "flex",
                            marginTop: "15px",
                        }}>
                            <div style={{
                                color: "#757575",
                                fontWeight: "400",
                                marginRight: "10px",
                                textTransform: "capitalize",
                                fontSize: "12px",
                                width: "6.25rem",
                                flexWrap: "wrap",
                            }}>
                                Số lượng
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                {/* Nút giảm */}
                                <button
                                    onClick={handleDecrease}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        borderRadius: "2px 0 0 2px",
                                    }}
                                >
                                    -
                                </button>

                                {/* Ô nhập số lượng */}
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange} // Gọi hàm kiểm tra số lượng
                                    style={{
                                        width: "50px",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "5px",
                                    }}
                                />

                                {/* Nút tăng */}
                                <button
                                    onClick={handleIncrease}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        padding: "5px 10px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        borderRadius: "0 2px 2px 0",
                                    }}
                                >
                                    +
                                </button>

                                {/* Hiển thị số lượng sản phẩm có sẵn */}
                                <div style={{
                                    color: "#757575",
                                    fontSize: "12px",
                                    marginLeft: "10px",
                                }}>
                                    {selectedVariant?.availableQuantity} sản phẩm có sẵn
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            marginTop: "15px",
                        }}>
                            <div style={{
                                marginRight: "15px",
                            }}>
                                <button style={{
                                    cursor: "pointer",
                                    backgroundColor: "#feeeea",
                                    color: "#ee4d2d",
                                    border: "1px solid #ee4d2d",
                                    padding: "0.8rem 1.5rem",
                                    borderRadius: "2px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    transition: "background-color 0.3s, color 0.3s",
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#feeeea";
                                        e.currentTarget.style.color = "#ee4d2d";
                                    }}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>

                            <div>
                                <ButtonField>Mua ngay</ButtonField>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default DetailProduct;