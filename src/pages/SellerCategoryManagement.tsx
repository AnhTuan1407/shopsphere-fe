import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
        setImagePreview("");
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
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 64px)",
                color: "#ee4d2d",
                fontSize: "16px",
                fontWeight: 500
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        border: "4px solid rgba(238, 77, 45, 0.1)",
                        borderTop: "4px solid #ee4d2d",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 15px auto"
                    }}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                margin: "0 0 20px 0",
                overflow: "hidden"
            }}>
                {/* Header */}
                <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333"
                    }}>
                        Quản lý danh mục
                    </div>

                    {/* Nút thêm mới */}
                    <button
                        onClick={handleOpenPopup}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#ee4d2d",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "background-color 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d73211"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ee4d2d"}
                    >
                        <PlusOutlined style={{ marginRight: "8px" }} />
                        Thêm mới danh mục
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                    {categories.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "40px 0",
                            color: "#999"
                        }}>
                            Chưa có danh mục nào
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: "20px"
                        }}>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    style={{
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        cursor: "pointer",
                                        position: "relative"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.08)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div style={{ position: "relative", paddingTop: "100%" }}>
                                        <img
                                            src={category.image_url || "https://via.placeholder.com/150"}
                                            alt={category.name}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />

                                        {/* Overlay actions */}
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: "rgba(0,0,0,0.5)",
                                            opacity: 0,
                                            transition: "opacity 0.2s ease",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = "0"}
                                        >
                                            <button style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                backgroundColor: "#fff",
                                                border: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer"
                                            }}>
                                                <EditOutlined style={{ color: "#1890ff" }} />
                                            </button>
                                            <button style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                backgroundColor: "#fff",
                                                border: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer"
                                            }}>
                                                <DeleteOutlined style={{ color: "#ff4d4f" }} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: "10px",
                                        textAlign: "center"
                                    }}>
                                        <h3 style={{
                                            fontSize: "15px",
                                            margin: "0",
                                            fontWeight: 500,
                                            color: "#333",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {category.name}
                                        </h3>
                                        <p style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            margin: "5px 0 0 0"
                                        }}>
                                            {category.description ?
                                                (category.description.length > 30 ?
                                                    category.description.substring(0, 30) + '...' :
                                                    category.description) :
                                                'Không có mô tả'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    onClick={handleClosePopup}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "8px",
                            width: "450px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            marginTop: "0",
                            marginBottom: "24px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333"
                        }}>
                            Thêm mới danh mục
                        </h3>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#333",
                                fontWeight: 500
                            }}>
                                Tên danh mục <span style={{ color: "#ee4d2d" }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên danh mục"
                                style={{
                                    width: "94.5%",
                                    padding: "10px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    transition: "border-color 0.3s",
                                    outline: "none"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#ee4d2d"}
                                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#333",
                                fontWeight: 500
                            }}>
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={newCategory.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả danh mục"
                                style={{
                                    width: "94.5%",
                                    padding: "10px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    resize: "vertical",
                                    minHeight: "80px",
                                    outline: "none"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#ee4d2d"}
                                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                rows={3}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#333",
                                fontWeight: 500
                            }}>
                                Hình ảnh <span style={{ color: "#ee4d2d" }}>*</span>
                            </label>

                            <div style={{
                                border: "1px dashed #ddd",
                                borderRadius: "4px",
                                padding: "15px",
                                textAlign: "center",
                                backgroundColor: "#fafafa",
                                cursor: "pointer"
                            }}>
                                {imagePreview ? (
                                    <div style={{
                                        marginBottom: "10px",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>
                                        <div style={{
                                            position: "relative",
                                            width: "120px",
                                            height: "120px",
                                            borderRadius: "8px",
                                            overflow: "hidden"
                                        }}>
                                            <img src={imagePreview} alt="Preview" style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        marginBottom: "10px",
                                        color: "#999"
                                    }}>
                                        <PlusOutlined style={{ fontSize: "24px" }} />
                                        <div style={{ marginTop: "5px" }}>Tải ảnh lên</div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    style={{ display: "block", width: "100%" }}
                                />
                                <div style={{
                                    fontSize: "12px",
                                    color: "#999",
                                    marginTop: "8px"
                                }}>
                                    Chấp nhận JPG, PNG, kích thước không quá 2MB
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            marginTop: "24px"
                        }}>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#fff",
                                    color: "#555",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    transition: "all 0.2s ease"
                                }}
                                onClick={handleClosePopup}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                    e.currentTarget.style.borderColor = "#ccc";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fff";
                                    e.currentTarget.style.borderColor = "#ddd";
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                style={{
                                    padding: "8px 24px",
                                    backgroundColor: "#ee4d2d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    transition: "background-color 0.2s ease"
                                }}
                                onClick={handleSubmit}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d73211"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ee4d2d"}
                            >
                                Thêm mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </>
    );
};

export default SellerCategoryManagement;