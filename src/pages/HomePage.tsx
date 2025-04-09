import { useEffect, useState } from "react";
import CardProduct from "../components/CardProduct";
import CardCategory from "../components/CardCategory";
import categoryService from "../services/category.service";
import productService from "../services/product.service";
import Product from "../models/product.model";
import Category from "../models/category.model";

const HomePage = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

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
                        rowGap: "1.5rem",
                        columnGap: "1.5rem",
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