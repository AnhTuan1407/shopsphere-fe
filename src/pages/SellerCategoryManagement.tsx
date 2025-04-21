import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Category from "../models/category.model";
import categoryService from "../services/category.service";
import uploadService from "../services/upload.service";

const SellerCategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [newCategory, setNewCategory] = useState<Category>({ name: "", description: "", image_url: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await categoryService.getAllCategories();
                setCategories(result);
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleOpenPopup = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setNewCategory({ name: "", description: "", image_url: "" });
        setImageFile(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
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

        const formData = new FormData();
        formData.append("name", newCategory.name || "");
        formData.append("description", newCategory.description || "");
        if (uploadedUrl) {
            formData.append("image_url", uploadedUrl);
        }

        const response = await categoryService.createCategory(formData);
        if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
            setCategories((prev) => [...prev, response.result!]);
            setImageFile(null);
            setImagePreview("");
            handleClosePopup();
            toast.success("Thêm mới danh mục thành công");
        } else {
            toast.error("Thêm mới danh mục không thành công");
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ paddingLeft: "20px", fontFamily: "Arial, sans-serif" }}>
                <div style={{ marginBottom: "20px", textAlign: "left", color: "#333", fontSize: "1.5rem" }}>Quản lý danh mục</div>

                {/* Nút thêm mới */}
                <button
                    onClick={handleOpenPopup}
                    style={{
                        marginBottom: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#ee4d2d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Thêm mới danh mục
                </button>

                {/* Danh sách category */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                width: "150px",
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <img
                                src={category.image_url || "https://via.placeholder.com/150"}
                                alt={category.name}
                                style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <h3 style={{ fontSize: "14px", margin: "10px 0" }}>{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup thêm mới */}
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
                        <h3 style={{ marginBottom: "20px" }}>Thêm mới danh mục</h3>

                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Tên danh mục</label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
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
                            <label style={{ display: "block", marginBottom: "5px" }}>Mô tả</label>
                            <textarea
                                name="description"
                                value={newCategory.description}
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
                            <div style={{
                                color: "#555",
                                backgroundColor: "#fff",
                                padding: "0.5rem 0.625rem",
                                marginRight: "0.125rem",
                                border: "1px solid rgba(0, 0, 0, .26)",
                                borderRadius: "0.25rem",
                                cursor: "pointer"
                            }}
                                onClick={handleClosePopup}
                            >
                                Hủy
                            </div>
                            <div style={{
                                color: "#fff",
                                backgroundColor: "#ee4d2d",
                                padding: "0.5rem 0.625rem",
                                minWidth: "8rem",
                                border: "1px solid rgba(0, 0, 0, .26)",
                                borderRadius: "0.25rem",
                                textAlign: "center",
                                cursor: "pointer"
                            }}
                                onClick={() => handleSubmit}
                            >
                                Thêm mới
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SellerCategoryManagement;