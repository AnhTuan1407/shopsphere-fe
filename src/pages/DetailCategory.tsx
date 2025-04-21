import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import Product from "../models/product.model";
import productService from "../services/product.service";

const DetailCategory = () => {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                if (id) {
                    const response = await productService.getProductByCategoryId(Number(id));
                    if (response.code === 1000) {
                        setProducts(response.result as Product[]);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm theo danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [id]);

    return (
        <>
            <div style={{
                width: "1200px",
                margin: "0 auto",
            }}>
                {/* Banner */}
                <div style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    <img src="/assets/banners/banner-4.jpg" alt="banner"
                        style={{
                            width: "100%",
                            objectFit: "contain",
                        }}
                    />
                </div>

                {/* Shopee Mall */}
                <div style={{
                    backgroundColor: "#fff"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "3.75rem",
                        padding: "0 5px 10px"
                    }}>
                        <div
                            style={{
                                fontSize: "1rem",
                                textTransform: "uppercase",
                                color: "#d0011b",
                                fontWeight: "500"
                            }}
                        >
                            shopee mall
                        </div>
                        <div
                            style={{
                                color: "#d0011b",
                                fontSize: "0.875rem"
                            }}
                        >
                            Xem tất cả {'>'}
                        </div>
                    </div>

                    {/* Brand */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0", backgroundColor: "#fff" }}>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <img
                                    src={`/assets/brands/brand-1.jpg`}
                                    alt={`brand-${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.3s ease",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.3)", // Hiệu ứng overlay khi hover
                                        opacity: "0",
                                        transition: "opacity 0.3s ease",
                                    }}
                                ></div>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        opacity: "0",
                                        transition: "opacity 0.3s ease",
                                    }}
                                >
                                    Xem thêm
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "100%",
                                        zIndex: "1",
                                    }}
                                    onMouseEnter={(e) => {
                                        const parent = e.currentTarget.parentElement!;
                                        parent.querySelector("img")!.style.transform = "scale(1.1)";
                                        (parent.querySelector("div:nth-child(2)") as HTMLElement)!.style.opacity = "1";
                                        (parent.querySelector("div:nth-child(3)") as HTMLElement)!.style.opacity = "1";
                                    }}
                                    onMouseLeave={(e) => {
                                        const parent = e.currentTarget.parentElement!;
                                        parent.querySelector("img")!.style.transform = "scale(1)";
                                        (parent.querySelector("div:nth-child(2)") as HTMLElement)!.style.opacity = "0";
                                        (parent.querySelector("div:nth-child(3)") as HTMLElement)!.style.opacity = "0";
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product */}
                <div style={{ width: "1200px", margin: "0 auto", padding: "1rem 0" }}>
                    <div style={{
                        textAlign: "left",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(0, 0, 0, .05)",
                        padding: "1.25rem",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                    }}>
                        Danh mục sản phẩm
                    </div>

                    {loading ? (
                        // Hiển thị loading khi đang tải dữ liệu
                        <div style={{ textAlign: "center", padding: "2rem 0", fontSize: "1.25rem" }}>
                            Đang tải sản phẩm...
                        </div>
                    ) : products.length === 0 ? (
                        // Hiển thị thông báo nếu không có sản phẩm
                        <div style={{ textAlign: "center", padding: "2rem 0", fontSize: "1.25rem", color: "#888" }}>
                            Không có sản phẩm nào trong danh mục này.
                        </div>
                    ) : (
                        // Hiển thị danh sách sản phẩm
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(6, 1fr)", // 6 sản phẩm 1 hàng
                                gap: "10px", // Khoảng cách giữa các sản phẩm
                                marginTop: "1rem",
                            }}
                        >
                            {products.map((product) => (
                                <CardProduct
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    imageUrl={product.imageUrl}
                                    variants={product.variants}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DetailCategory;