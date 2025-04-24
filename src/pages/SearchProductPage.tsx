import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/product.service";
import Product from "../models/product.model";
import CardProduct from "../components/CardProduct";

// Thêm CSS dùng chung cho các nút
const buttonStyles = {
    base: {
        border: "0",
        borderRadius: "2px",
        height: "2.125rem",
        lineHeight: "2.125rem",
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .02)",
        cursor: "pointer",
        padding: "0 0.9375rem",
        minWidth: "5.625rem",
    },
    active: {
        backgroundColor: "#ee4d2d",
        color: "#fff",
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        outline: "0",
        overflow: "visible",
        position: "relative",
        textTransform: "capitalize",
    },
    inactive: {
        backgroundColor: "#fff",
        color: "#333",
    }
};

const SearchProductPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [activeSort, setActiveSort] = useState("relevant");

    // Component trong SearchProductPage
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [priceSort, setPriceSort] = useState("");

    useEffect(() => {
        if (keyword.trim() !== '') {
            fetchProducts();
        }
    }, [keyword]);

    const fetchProducts = async () => {
        try {
            const response = await productService.searchProduct(keyword);
            if (response.code === 1000) {
                setProducts(response.result as Product[]);
            }
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    // Hàm để lấy style cho button dựa vào trạng thái active
    const getButtonStyle = (buttonType: any) => {
        return {
            ...buttonStyles.base,
            ...(activeSort === buttonType ? buttonStyles.active : buttonStyles.inactive)
        };
    };

    return (
        <>
            <div style={{
                width: "1200px",
                margin: "0 auto",
            }}>
                <div style={{
                    fontSize: "1rem",
                    marginTop: "1rem",
                    marginBottom: "1.5rem",
                    color: "#555555",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <div style={{
                        paddingRight: "0.25rem"
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightbulb" viewBox="0 0 16 16">
                            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
                        </svg>
                    </div>
                    Kết quả tìm kiếm cho từ khóa "<span style={{ color: "#ee4d2d" }}>{keyword}</span>"
                </div>

                <div style={{
                    padding: "0.8125rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, .03)",
                    borderRadius: "2px",
                    fontWeight: "400",
                    justifyContent: "space-between",
                }}>
                    <div>
                        Sắp xếp theo
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "stretch",
                        flex: "1",
                        gap: "0.625rem",
                        justifyContent: "flex-start"
                    }}>
                        <div style={{
                            display: "flex",
                            gap: "0.625rem",
                            marginLeft: "0.625rem"
                        }}>
                            <button
                                onClick={() => setActiveSort("relevant")}
                                style={getButtonStyle("relevant")}
                            >
                                Liên quan
                            </button>
                            <button
                                onClick={() => setActiveSort("newest")}
                                style={getButtonStyle("newest")}
                            >
                                Mới nhất
                            </button>
                            <button
                                onClick={() => setActiveSort("bestSelling")}
                                style={getButtonStyle("bestSelling")}
                            >
                                Bán chạy
                            </button>
                        </div>
                        <div
                            style={{
                                alignItems: "center",
                                background: "#fff",
                                border: "0",
                                borderRadius: "2px",
                                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .02)",
                                boxSizing: "border-box",
                                cursor: "pointer",
                                display: "flex",
                                height: "2.125rem",
                                justifyContent: "space-between",
                                lineHeight: "2.125rem",
                                minWidth: "12.5rem",
                                paddingLeft: "0.75rem",
                                paddingRight: "0.75rem",
                                position: "relative",
                                textAlign: "left",
                                transition: "border-color 0.1s ease"
                            }}
                            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                        >
                            <div>
                                {priceSort === "asc" ? "Giá: Thấp đến cao" :
                                    priceSort === "desc" ? "Giá: Cao đến thấp" : "Giá"}
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                </svg>
                            </div>

                            {showPriceDropdown && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "0",
                                    right: "0",
                                    backgroundColor: "#fff",
                                    borderRadius: "2px",
                                    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.1)",
                                    zIndex: "10",
                                    marginTop: "2px"
                                }}>
                                    <div
                                        style={{
                                            padding: "0.75rem",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #f5f5f5",
                                            color: priceSort === "asc" ? "#ee4d2d" : "inherit",
                                            backgroundColor: priceSort === "asc" ? "rgba(238, 77, 45, 0.08)" : "inherit"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPriceSort("asc");
                                            setShowPriceDropdown(false);
                                        }}
                                    >
                                        Giá: Thấp đến cao
                                    </div>
                                    <div
                                        style={{
                                            padding: "0.75rem",
                                            cursor: "pointer",
                                            color: priceSort === "desc" ? "#ee4d2d" : "inherit",
                                            backgroundColor: priceSort === "desc" ? "rgba(238, 77, 45, 0.08)" : "inherit"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPriceSort("desc");
                                            setShowPriceDropdown(false);
                                        }}
                                    >
                                        Giá: Cao đến thấp
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                    }}>
                        <div style={{
                            fontSize: "0.875rem",
                            color: "#555",
                            padding: "0 0.5rem"
                        }}>1/6</div>
                        <div style={{
                            display: "flex",
                            gap: "0.5rem"
                        }}>
                            <button style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "2.5rem",
                                height: "2.125rem",
                                padding: "0 0.75rem",
                                backgroundColor: "#fff",
                                border: "1px solid #e8e8e8",
                                borderRadius: "2px",
                                color: "#555",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.02)"
                            }}>
                                Prev
                            </button>
                            <button style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "2.5rem",
                                height: "2.125rem",
                                padding: "0 0.75rem",
                                backgroundColor: "#fff",
                                border: "1px solid #e8e8e8",
                                borderRadius: "2px",
                                color: "#555",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.02)"
                            }}>
                                Next
                            </button>
                        </div>
                    </div>
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
            </div>
        </>
    )
}

export default SearchProductPage;