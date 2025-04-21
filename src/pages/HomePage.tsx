import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardCategory from "../components/CardCategory";
import CardProduct from "../components/CardProduct";
import Category from "../models/category.model";
import Product from "../models/product.model";
import categoryService from "../services/category.service";
import productService from "../services/product.service";

const HomePage = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách danh mục:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                width: "100%",
                paddingTop: "10px",
                paddingBottom: "10px",
            }}>
                <div style={{
                    width: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "235px",
                }}>
                    {/* Banner */}
                    <div style={{
                        flex: "2",
                        height: "100%",
                        overflow: "hidden",
                    }}>
                        <img
                            src="/assets/banners/banner-1.jpg"
                            alt="banner-1"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    <div style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        marginLeft: "5px"
                    }}>
                        <img
                            src="/assets/banners/banner-2.jpg"
                            alt="banner-2"
                            style={{
                                width: "100%",
                                height: "calc(50% - 3px)",
                                objectFit: "cover",
                                marginBottom: "3px",
                            }}
                        />
                        <img
                            src="/assets/banners/banner-3.png"
                            alt="banner-3"
                            style={{
                                width: "100%",
                                height: "calc(50% - 3px)",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </div>

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

                    <div style={{
                        display: "flex",
                        rowGap: "1rem",
                        columnGap: "1rem",
                    }}>
                        {
                            products.map(product =>
                                <CardProduct
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    imageUrl={product.imageUrl}
                                    variants={product.variants}
                                />
                            )
                        }
                    </div>
                </div>
            </div >
        </>
    );
}

export default HomePage;