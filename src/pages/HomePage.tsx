import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardCategory from "../components/CardCategory";
import CardProduct from "../components/CardProduct";
import Category from "../models/category.model";
import Product from "../models/product.model";
import FlashSale from "../models/flashSale.model";
import categoryService from "../services/category.service";
import productService from "../services/product.service";
import saleService from "../services/sale.service";
import { toast } from 'react-toastify';
import DynamicBanner from "../components/DynamicBanner";

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
    const [activeFlashSale, setActiveFlashSale] = useState<FlashSale | null>(null);
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [countdown, setCountdown] = useState<{ hours: number, minutes: number, seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                if (response) {
                    setProducts(response as Product[]);
                } else {
                    setProducts([]);
                    console.error("Lỗi khi fetch product");
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Fetch Flash Sales
    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const response = await saleService.getAllFlashSalesActive();
                if (response.code === 1000) {
                    const flashSaleData = response.result as FlashSale[];
                    setFlashSales(flashSaleData);

                    // Lấy flash sale đầu tiên làm active flash sale (hoặc có thể dùng logic khác để chọn)
                    if (flashSaleData.length > 0) {
                        setActiveFlashSale(flashSaleData[0]);
                    }
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách flash sale:", error);
                toast.error("Có lỗi xảy ra khi tải flash sale");
            }
        };

        fetchFlashSales();
    }, []);

    // Fetch sản phẩm flash sale khi có active flash sale
    useEffect(() => {
        if (activeFlashSale && products.length > 0) {
            // Lấy các sản phẩm có trong flash sale items
            const productIdsInFlashSale = activeFlashSale.flashSaleItems.map(item => item.productId);
            const productsInFlashSale = products.filter(product =>
                productIdsInFlashSale.includes(product.id!)
            );
            setFlashSaleProducts(productsInFlashSale);
        }
    }, [activeFlashSale, products]);

    // Đồng hồ đếm ngược
    useEffect(() => {
        if (!activeFlashSale) return;

        const updateCountdown = () => {
            const now = new Date();
            const endTime = new Date(activeFlashSale.endTime);
            const timeLeft = endTime.getTime() - now.getTime();

            if (timeLeft <= 0) {
                // Flash sale đã kết thúc
                setCountdown({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            setCountdown({ hours, minutes, seconds });
        };

        // Cập nhật đồng hồ đếm ngược ban đầu
        updateCountdown();

        // Cập nhật đồng hồ đếm ngược mỗi giây
        const countdownInterval = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, [activeFlashSale]);

    const renderCountdownUnit = (value: number) => (
        <div style={{
            backgroundColor: "#FF4D4F",
            color: "#FFF",
            borderRadius: "4px",
            padding: "2px 4px",
            fontWeight: "bold",
            fontSize: "16px",
            minWidth: "28px",
            textAlign: "center"
        }}>
            {value.toString().padStart(2, '0')}
        </div>
    );

    const renderCountdownSeparator = () => (
        <div style={{ color: "#FF4D4F", margin: "0 4px", fontWeight: "bold" }}>:</div>
    );

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                width: "100%",
                paddingTop: "10px",
                paddingBottom: "10px",
            }}>
                <DynamicBanner></DynamicBanner>

                {/* Navbar */}
                <div style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    width: "1200px",
                    margin: "0 auto",
                    justifyContent: "space-around",
                    marginTop: "1rem"
                }}>
                    {[
                        { src: "/assets/btn-nav-home/choice.png", label: "Hàng Chọn Giá Hời" },
                        { src: "/assets/btn-nav-home/voucher.png", label: "Mã Giảm Giá", onClick: () => navigate("/vouchers") },
                        { src: "/assets/btn-nav-home/shopee-style.png", label: "Shopee Style Voucher 30%" },
                        { src: "/assets/btn-nav-home/voucher-xtra.png", label: "Voucher Giảm Đến 1 Triệu" },
                        { src: "/assets/btn-nav-home/national.png", label: "Hàng Quốc Tế" },
                        { src: "/assets/btn-nav-home/service.png", label: "Nạp Thẻ, Dịch Vụ & Hóa Đơn" },
                    ].map((btn, index) => (
                        <div key={index} style={{
                            flex: "1",
                            textAlign: "center",
                        }}>
                            <div
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    display: "flex",
                                    margin: "0 auto",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease",
                                }}
                                onClick={btn.onClick}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <img src={btn.src} alt={`btn-${btn.label}`} style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }} />
                            </div>
                            <div>
                                {btn.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ height: 'calc(100vh-306px)', padding: '2rem 4rem', overflowY: 'auto' }}>
                {/* Flash Sale Section */}
                {activeFlashSale && flashSaleProducts.length > 0 && (
                    <div style={{
                        backgroundColor: "#fff",
                        marginBottom: "1.25rem",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "1rem 1.25rem",
                            borderBottom: "1px solid rgba(0, 0, 0, .05)"
                        }}>
                            <div style={{
                                color: "#ee4d2d",
                                textTransform: "uppercase",
                                fontWeight: "500",
                                fontSize: "18px",
                                marginRight: "15px"
                            }}>
                                FLASH SALE
                            </div>

                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <div style={{ marginRight: "10px", color: "#888" }}>Kết thúc trong</div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {renderCountdownUnit(countdown.hours)}
                                    {renderCountdownSeparator()}
                                    {renderCountdownUnit(countdown.minutes)}
                                    {renderCountdownSeparator()}
                                    {renderCountdownUnit(countdown.seconds)}
                                </div>
                            </div>

                            <div style={{
                                marginLeft: "auto",
                                color: "#ee4d2d",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                            }}
                                onClick={() => navigate('/flash-sales')}>
                                <span>Xem tất cả</span>
                                <span style={{ marginLeft: "5px" }}>&#10095;</span>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            overflowX: "auto",
                            padding: "1rem",
                            gap: "0.8rem"
                        }}>
                            {flashSaleProducts.map(product => (
                                <CardProduct
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    imageUrl={product.imageUrl}
                                    variants={product.variants}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div style={{
                    backgroundColor: "#fff",
                }}>
                    <div style={{
                        textAlign: "left",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(0, 0, 0, .05)",
                        padding: "1.25rem",
                    }}>
                        Danh mục
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        {
                            categories.map(category =>
                                <CardCategory
                                    key={category.id}
                                    id={category.id}
                                    name={category.name}
                                    image_url={category.image_url}
                                />
                            )
                        }
                    </div>
                </div>

                <div style={{
                    backgroundColor: "#fff",
                    marginTop: "1.25rem",
                    textAlign: "center",
                    color: "#ee4d2d",
                    textTransform: "uppercase",
                    fontWeight: "500",
                    padding: ".9375rem 2.875rem",
                    borderBottom: "3px solid #ee4d2d",
                    cursor: "pointer",
                }}>
                    Gợi ý hôm nay
                </div>

                <div style={{
                    backgroundColor: "#fff",
                    padding: "0.25rem",
                    marginTop: "0.95rem",
                }}>
                    {
                        products.length > 0 ? (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                rowGap: "1rem",
                                columnGap: "1rem",
                            }}>
                                {products.map(product =>
                                    <CardProduct
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        imageUrl={product.imageUrl}
                                        variants={product.variants}
                                    />
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "#999",
                                fontSize: "18px",
                            }}>
                                Không có sản phẩm nào.
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    );
}

export default HomePage;