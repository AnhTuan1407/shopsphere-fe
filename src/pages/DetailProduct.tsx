import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import arrow from "../assets/arrow.svg";
import deliveryIcon from "../assets/delivery-icon.svg";
import privacyIcon from "../assets/privacy-icon.svg";
import starRating from "../assets/star-rating.svg";
import ButtonField from "../components/ButtonField";
import CardProductVariant from "../components/CardProductVariant";
import { useCart } from "../contexts/CartContext";
import Product from "../models/product.model";
import ProductVariants from "../models/productVariants.model";
import ReviewPage from "../pages/ReviewPage";
import cartService from "../services/cart.service";
import productService from "../services/product.service";
import reviewService from "../services/review.service";
import StarRating from "../components/StarRating";

const DetailProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product>({
        variants: [],
    });

    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewCount, setReviewCount] = useState<any>(0);
    const [averageRating, setAverageRating] = useState<any>(0);
    const [imgView, setImgView] = useState<any>();
    const { cartItemCount, setCartItemCount } = useCart();

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

        const fetchCountReview = async () => {
            try {
                const response = await reviewService.countReviewByProductId(Number(id));
                if (response.code === 1000) {
                    setReviewCount(response.result as Number);
                }
            } catch (error) {
                console.log(error);
            }
        }

        const fetchAverageRating = async () => {
            try {
                const response = await reviewService.averageRatingByProductId(Number(id));
                if (response.code === 1000) {
                    setAverageRating(response.result as Number);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchProduct();
        fetchCountReview();
        fetchAverageRating();
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
        setImgView(variant.imageUrl);
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

    const handleAddToCart = () => {
        const token = localStorage.getItem("token");
        const profileId = localStorage.getItem("profileId");
        if (!token || !profileId) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/sign-in");
            return;
        }

        const cartItem = {
            productId: Number(id),
            productVariantId: selectedVariant?.id,
            price: selectedVariant?.price,
            quantity: quantity,
            profileId: profileId,
            supplierId: product.supplier?.id,
        };

        const addToCart = async () => {
            try {
                const response = await cartService.addToCart(cartItem);
                if (response.code === 1000) {
                    const profileId = localStorage.getItem("profileId")
                    if (profileId) {
                        const cartResponse = await cartService.getCartByProfileId(profileId);

                        if (cartResponse?.result) {
                            const cart = cartResponse.result as { cartItems: { length: number }[] };
                            setCartItemCount(cart.cartItems.length);
                        }
                    }

                    toast.success("Thêm vào giỏ hàng thành công!");
                } else {
                    toast.error("Thêm vào giỏ hàng thất bại!");
                }
            } catch (error) {
                console.error(error);
                toast.error(`Đã xảy ra lỗi khi thêm vào giỏ hàng: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        addToCart();
    }

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
                    fontSize: "0.75rem",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
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
                    backgroundColor: "#fff",
                    padding: "0.625rem"
                }}>
                    <div style={{
                        flexBasis: "40%",
                        padding: "15px"
                    }}>
                        <img src={imgView ? imgView : product.imageUrl} alt="img-product" style={{
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
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{
                                            borderBottom: "1px solid #222",
                                            paddingBottom: "1px",
                                            marginRight: "5px",
                                            fontWeight: "500"
                                        }}>
                                            {averageRating?.toFixed(1)}
                                        </div>
                                        <StarRating rating={Number(averageRating)} />
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
                                        {reviewCount}
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
                                    }}>
                                        {product.variants && product.variants.length > 0 && product.variants[0].quantitySold
                                            ? `${product.variants.reduce((total, variant) => total + (variant.quantitySold || 0), 0)}`
                                            : 0}
                                    </div>
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
                                    {selectedVariant?.price?.toLocaleString("vi-VN")}
                                </div>
                            </div>
                            <div style={{
                                color: "#929292",
                                textDecoration: "line-through",
                                margin: "0 10px"
                            }}>
                                ₫{((selectedVariant?.price ?? 0) * 128 / 100).toLocaleString("vi-VN")};
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
                                    <div style={{ fontSize: "11px", color: "#757575" }}>
                                        Tặng Voucher ₫{((selectedVariant?.price ?? 0) * 30 / 100).toLocaleString("vi-VN")} nếu đơn giao sau thời gian trên
                                    </div>
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
                                        imageUrl={variant.imageUrl}
                                        version={variant.version}
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

                                    onClick={handleAddToCart}
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

                {/* Supplier information */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: ".125rem",
                        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                        marginTop: "0.9375rem",
                        overflow: "hidden",
                        padding: "0.625rem",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div style={{
                        padding: "20px 20px 25px",
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "440px",
                    }}>
                        <div style={{
                            height: "80px",
                            width: "80px",
                            border: "1px solid rgba(0, 0, 0, .09)",
                            borderRadius: "50%",
                            marginRight: "1.25rem",
                            cursor: "pointer",
                        }}
                            onClick={() => navigate(`/supplier/${product.supplier?.id}`)}
                        >
                            <img src="/assets/supplier-avatar.jpg" alt="avatar-supplier" style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }} />
                        </div>
                        <div style={{
                            paddingRight: "20px",
                            borderRight: "1px solid rgba(0, 0, 0, .09)"
                        }}>
                            <div style={{ fontSize: "1rem", fontWeight: "500", textDecoration: "none", cursor: "pointer" }}>
                                <div
                                    onClick={() => navigate(`/supplier/${product.supplier?.id}`)}
                                >{product.supplier?.name}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
                                <div style={{
                                    padding: "5px 10px",
                                    marginRight: "10px",
                                    backgroundColor: "rgba(208, 1, 27, .08)",
                                    border: "1px solid #d0011b",
                                    color: "#d0011b",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                }}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chat-right-text-fill" viewBox="0 0 16 16">
                                            <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
                                        </svg>
                                    </span> Chat ngay
                                </div>
                                <div style={{
                                    padding: "5px 10px",
                                    marginRight: "10px",
                                    backgroundColor: "#fff",
                                    border: "1px solid rgba(0, 0, 0, .09)",
                                    color: "#555555",
                                    cursor: "pointer",
                                }}
                                    onClick={() => navigate(`/supplier/${product.supplier?.id}`)}
                                >
                                    <span style={{ marginRight: "5px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-shop" viewBox="0 0 16 16">
                                            <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                                        </svg>
                                    </span>
                                    Xem shop
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, auto)",
                        gap: "20px 50px",
                        color: "rgba(0, 0, 0, .4)",
                        flexGrow: "1",
                        padding: "20px",
                        paddingLeft: "0",
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Đánh giá</label>
                            <span style={{ color: "#d0011b" }}>43,3k</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Tỉ lệ phản hồi</label>
                            <span style={{ color: "#d0011b" }}>95%</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Tham gia</label>
                            <span style={{ color: "#d0011b" }}>4 năm trước</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Sản phẩm</label>
                            <span style={{ color: "#d0011b" }}>203</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Thời gian phản hồi</label>
                            <span style={{ color: "#d0011b" }}>trong vài giờ</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <label>Người theo dõi</label>
                            <span style={{ color: "#d0011b" }}>185,5k</span>
                        </div>
                    </div>
                </div>

                {/* Review */}
                {product?.id && <ReviewPage productId={product.id} />}
            </div >
        </>
    );
}

export default DetailProduct;