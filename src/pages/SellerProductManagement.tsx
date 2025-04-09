import { useEffect, useState } from "react";
import productService from "../services/product.service";
import categoryService from "../services/category.service";
import supplierService from "../services/supplier.service";
import Product from "../models/product.model";
import Category from "../models/category.model";
import Supplier from "../models/supplier.model";
import uploadService from "../services/upload.service";
import { toast } from "react-toastify";

const SellerProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [supplierId, setSupplierId] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        categoryId: "",
        image: null as File | null,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        const fetchSupplierAndProducts = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Không tìm thấy userId trong localStorage");
                return;
            }

            // Lấy supplierId từ userId
            const supplierResponse = await supplierService.getSupplierByUserId(userId);
            if (supplierResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                if (supplierResponse.result as Supplier) {
                    setSupplierId(String((supplierResponse.result as Supplier).id));
                }

                // Lấy danh sách sản phẩm của supplier
                const productsResponse = await productService.getAllProducts();
                const supplierProducts = productsResponse.filter(
                    (product) => product.supplier?.id === (supplierResponse.result as Supplier).id
                );
                setProducts(supplierProducts);
            } else {
                alert("Không tìm thấy supplier tương ứng");
            }
        };

        const fetchCategories = async () => {
            const categoriesResponse = await categoryService.getAllCategories();
            setCategories(categoriesResponse);
        };

        fetchSupplierAndProducts();
        fetchCategories();
    }, []);

    const handleOpenPopup = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setNewProduct({ name: "", description: "", categoryId: "", image: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            try {
                const base64 = await uploadService.toBase64(file);
                setImagePreview(base64);
            } catch (err) {
                console.error("Preview error:", err);
            }
        }
    };

    const handleSubmit = async () => {
        let uploadedUrl = "";

        try {
            if (imageFile) {
                const base64 = await uploadService.toBase64(imageFile);
                uploadedUrl = await uploadService.uploadToCloudinary(base64);
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Có lỗi khi upload ảnh");
            return;
        }

        if (!supplierId) {
            toast.error("Không tìm thấy supplierId");
            return;
        }

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("categoryId", newProduct.categoryId);
        formData.append("supplierId", supplierId);
        if (uploadedUrl) {
            formData.append("imageUrl", uploadedUrl);
        }

        const response = await productService.createProduct(formData);
        if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
            setProducts((prev) => [...prev, response.result!]);
            setImageFile(null);
            setImagePreview("");
            handleClosePopup();
            toast.success("Thêm mới sản phẩm thành công");
        } else {
            toast.error("Thêm mới sản phẩm thất bại!");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "left", color: "#333" }}>Quản lý sản phẩm</h2>

            {/* Nút thêm mới sản phẩm */}
            <div style={{ textAlign: "left", marginBottom: "20px" }}>
                <button
                    onClick={handleOpenPopup}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Thêm mới sản phẩm
                </button>
            </div>

            {/* Danh sách sản phẩm theo danh mục */}
            {categories.map((category) => (
                <div
                    key={category.id}
                    style={{
                        marginBottom: "30px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        padding: "20px",
                    }}
                >
                    {/* Tiêu đề danh mục */}
                    <h3
                        style={{
                            marginBottom: "20px",
                            borderBottom: "2px solid #4CAF50",
                            paddingBottom: "10px",
                            color: "#333",
                        }}
                    >
                        {category.name}
                    </h3>

                    {/* Danh sách sản phẩm */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                        {products
                            .filter((product) => product.category?.id === category.id)
                            .map((product) => (
                                <div
                                    key={product.id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        width: "150px",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <img
                                        src={product.imageUrl || "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        style={{
                                            width: "100%",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
                                    />
                                    <h4 style={{
                                        fontSize: "10px",
                                        margin: "0",
                                        color: "#333",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}>{product.name}</h4>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            {/* Popup thêm mới sản phẩm */}
            {isPopupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1000",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "400px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <h3 style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>Thêm mới sản phẩm</h3>

                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Mô tả</label>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    resize: "none",
                                }}
                                rows={3}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Danh mục</label>
                            <select
                                name="categoryId"
                                value={newProduct.categoryId}
                                onChange={handleInputChange}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Hình ảnh</label>
                            <input type="file" onChange={handleImageChange} />
                        </div>

                        {imagePreview && (
                            <div>
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: "125px", borderRadius: "8px" }} />
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                onClick={handleClosePopup}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#f44336",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Thêm mới
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductManagement;