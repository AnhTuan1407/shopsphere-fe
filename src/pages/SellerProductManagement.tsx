import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Category from "../models/category.model";
import Product from "../models/product.model";
import Supplier from "../models/supplier.model";
import categoryService from "../services/category.service";
import productService from "../services/product.service";
import supplierService from "../services/supplier.service";
import uploadService from "../services/upload.service";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ProductVariants from "../models/productVariants.model";

const SellerProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        categoryId: "",
        image: null as File | null,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<ProductVariants[]>([]);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);


    useEffect(() => {
        const fetchSupplierAndProducts = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    alert("Không tìm thấy userId trong localStorage");
                    return;
                }

                // Lấy supplierId từ userId
                const supplierResponse = await supplierService.getSupplierByUserId(userId);
                if (supplierResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    if (supplierResponse.result as Supplier) {
                        setSupplierId((supplierResponse.result as Supplier).id);
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
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
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
        setImagePreview("");
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
        formData.append("supplierId", supplierId.toString());
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

    const handleEditProduct = async (product: Product) => {
        try {
            setSelectedProduct(product);
            setVariants(product.variants as ProductVariants[]);
            setIsEditPopupVisible(true);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm.");
        }
    };

    const handleAddVariant = () => {
        // Mở form thêm mới variant (có thể popup nhỏ khác hoặc inline form)
        console.log("Thêm mới variant cho:", selectedProduct?.name);
    };


    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                fontSize: "1rem",
                color: "#757575"
            }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{
                padding: "1.5rem",
                fontFamily: "'Roboto', 'Helvetica', sans-serif",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                <div style={{
                    marginBottom: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h2 style={{
                        color: "#212121",
                        fontSize: "1.75rem",
                        fontWeight: "600",
                        margin: 0
                    }}>
                        Quản lý sản phẩm
                    </h2>

                    {/* Nút thêm mới sản phẩm */}
                    <button
                        onClick={handleOpenPopup}
                        style={{
                            color: "#fff",
                            backgroundColor: "#ee4d2d",
                            padding: "0.75rem 1.25rem",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            border: "none",
                            borderRadius: "4px",
                            textAlign: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(238, 77, 45, 0.2)",
                            transition: "all 0.3s ease"
                        }}
                    >
                        Thêm mới sản phẩm
                    </button>
                </div>

                {categories.length === 0 || products.length === 0 ? (
                    <div style={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        padding: "2rem",
                        textAlign: "center",
                        color: "#757575",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
                    }}>
                        <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên của bạn!</p>
                    </div>
                ) : (
                    /* Danh sách sản phẩm theo danh mục */
                    categories
                        .filter((category) =>
                            products.some((product) => product.category?.id === category.id)
                        )
                        .map((category) => (
                            <div
                                key={category.id}
                                style={{
                                    marginBottom: "2rem",
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
                                    padding: "1.5rem",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                            >
                                {/* Tiêu đề danh mục */}
                                <div
                                    style={{
                                        marginBottom: "1.25rem",
                                        borderBottom: "2px solid #ee4d2d",
                                        paddingBottom: "0.75rem",
                                        color: "#212121",
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    {category.name}
                                    <span style={{
                                        fontSize: "0.85rem",
                                        color: "#757575",
                                        fontWeight: "normal"
                                    }}>
                                        {products.filter(product => product.category?.id === category.id).length} sản phẩm
                                    </span>
                                </div>

                                {/* Danh sách sản phẩm */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                    gap: "1.25rem"
                                }}>
                                    {products
                                        .filter((product) => product.category?.id === category.id)
                                        .map((product) => (
                                            <div
                                                key={product.id}
                                                style={{
                                                    border: "1px solid #eeeeee",
                                                    borderRadius: "8px",
                                                    padding: "0.75rem 0.75rem 0.125rem 0.75rem",
                                                    backgroundColor: "#fff",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    height: "100%",
                                                    transition: "transform 0.15s ease, box-shadow 0.15s ease"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            >
                                                <div style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    paddingBottom: "100%",
                                                    backgroundColor: "#f9f9f9",
                                                    borderRadius: "6px",
                                                    overflow: "hidden",
                                                    marginBottom: "10px"
                                                }}>
                                                    <img
                                                        src={product.imageUrl || "https://via.placeholder.com/150"}
                                                        alt={product.name}
                                                        style={{
                                                            position: "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "6px"
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
                                                        }}
                                                            onClick={(e) => handleEditProduct(product)}
                                                        >
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
                                                    flexGrow: 1,
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}>
                                                    <h4
                                                        style={{
                                                            fontSize: "0.9rem",
                                                            margin: "0 0 0.35rem 0",
                                                            color: "#212121",
                                                            fontWeight: "500",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            lineHeight: "1.3",
                                                            height: "2.6em"
                                                        }}
                                                    >
                                                        {product.name}
                                                    </h4>
                                                    <div style={{
                                                        fontSize: "0.85rem",
                                                        color: "#ee4d2d",
                                                        fontWeight: "600",
                                                        marginTop: "0.125rem"
                                                    }}>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))
                )}

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
                                padding: "2rem",
                                borderRadius: "8px",
                                width: "500px",
                                maxWidth: "90%",
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <h3 style={{
                                marginBottom: "1.5rem",
                                textAlign: "center",
                                color: "#212121",
                                fontSize: "1.25rem",
                                fontWeight: "600"
                            }}>
                                Thêm mới sản phẩm
                            </h3>

                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#424242",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>
                                    Tên sản phẩm<span style={{ color: "#ee4d2d" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên sản phẩm"
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        fontSize: "0.95rem",
                                        transition: "border-color 0.2s",
                                        outline: "none"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#ee4d2d";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e0e0e0";
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#424242",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mô tả sản phẩm"
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        fontSize: "0.95rem",
                                        resize: "vertical",
                                        minHeight: "80px",
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#ee4d2d";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e0e0e0";
                                    }}
                                    rows={3}
                                ></textarea>
                            </div>

                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#424242",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>
                                    Danh mục<span style={{ color: "#ee4d2d" }}>*</span>
                                </label>
                                <select
                                    name="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                        fontSize: "0.95rem",
                                        backgroundColor: "#fff",
                                        cursor: "pointer",
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#ee4d2d";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e0e0e0";
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

                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    color: "#424242",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>
                                    Hình ảnh<span style={{ color: "#ee4d2d" }}>*</span>
                                </label>
                                <div
                                    style={{
                                        border: "1px dashed #e0e0e0",
                                        borderRadius: "4px",
                                        padding: "1.25rem",
                                        textAlign: "center",
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                        transition: "border-color 0.2s, background-color 0.2s",
                                        marginBottom: "1rem"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = "#ee4d2d";
                                        e.currentTarget.style.backgroundColor = "#fff8f6";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = "#e0e0e0";
                                        e.currentTarget.style.backgroundColor = "#fafafa";
                                    }}
                                >
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{
                                            display: "none"
                                        }}
                                        id="product-image"
                                    />
                                    <label htmlFor="product-image" style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}>
                                        <div style={{
                                            fontSize: "2rem",
                                            color: "#bdbdbd",
                                            marginBottom: "0.5rem"
                                        }}>+</div>
                                        <div style={{
                                            fontSize: "0.9rem",
                                            color: "#757575"
                                        }}>Tải ảnh lên</div>
                                    </label>
                                </div>
                            </div>

                            {imagePreview && (
                                <div style={{
                                    marginBottom: "1.5rem",
                                    textAlign: "center"
                                }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            borderRadius: "6px",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "1rem",
                                marginTop: "2rem"
                            }}>
                                <button
                                    style={{
                                        color: "#616161",
                                        backgroundColor: "#f5f5f5",
                                        padding: "0.75rem 1.25rem",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s"
                                    }}
                                    onClick={handleClosePopup}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#e0e0e0";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    style={{
                                        color: "#fff",
                                        backgroundColor: "#ee4d2d",
                                        padding: "0.75rem 1.25rem",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(238, 77, 45, 0.2)",
                                        transition: "background-color 0.2s, transform 0.1s"
                                    }}
                                    onClick={handleSubmit}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f05d40";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ee4d2d";
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = "translateY(1px)";
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    Thêm mới
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isEditPopupVisible && selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        width: '100%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header with close button */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#1f2937'
                            }}>Chi tiết sản phẩm</h2>
                            <button
                                onClick={() => setIsEditPopupVisible(false)}
                                style={{
                                    padding: '4px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    transition: 'background-color 0.2s'
                                }}
                                aria-label="Đóng"
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content area */}
                        <div style={{
                            flex: '1',
                            overflowY: 'auto',
                            padding: '24px'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                                gap: '32px'
                            }}>
                                {/* Left side: Product info */}
                                <div style={{
                                    flex: '1'
                                }}>
                                    <div style={{
                                        marginBottom: '24px',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <img
                                            src={selectedProduct.imageUrl || "https://via.placeholder.com/400/300"}
                                            alt={selectedProduct.name}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease',
                                                display: 'block'
                                            }}
                                            onMouseOver={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseOut={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.transform = 'scale(1)';
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <h3 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            marginBottom: '12px'
                                        }}>{selectedProduct.name}</h3>
                                        <p style={{
                                            color: '#4b5563',
                                            marginBottom: '16px'
                                        }}>{selectedProduct.description}</p>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: '16px',
                                            marginTop: '16px'
                                        }}>
                                            <div style={{
                                                backgroundColor: '#f9fafb',
                                                padding: '16px',
                                                borderRadius: '8px'
                                            }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280',
                                                    marginBottom: '4px'
                                                }}>Danh mục</p>
                                                <p style={{
                                                    fontWeight: '500',
                                                    color: '#1f2937'
                                                }}>{selectedProduct.category?.name || "Chưa phân loại"}</p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#f9fafb',
                                                padding: '16px',
                                                borderRadius: '8px'
                                            }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280',
                                                    marginBottom: '4px'
                                                }}>Nhà cung cấp</p>
                                                <p style={{
                                                    fontWeight: '500',
                                                    color: '#1f2937'
                                                }}>{selectedProduct.supplier?.name || "Không có"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Variants */}
                                <div style={{
                                    flex: '1',
                                    marginTop: window.innerWidth < 768 ? '24px' : '0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#1f2937'
                                        }}>Danh sách biến thể</h4>
                                        <button
                                            onClick={() => handleAddVariant()}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#2563eb',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Thêm variant
                                        </button>
                                    </div>

                                    {variants.length === 0 ? (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '32px 0',
                                            textAlign: 'center',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '48px', width: '48px', color: '#9ca3af', marginBottom: '8px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p style={{ color: '#4b5563' }}>Chưa có biến thể nào cho sản phẩm này</p>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            maxHeight: '400px',
                                            overflowY: 'auto',
                                            paddingRight: '8px'
                                        }}>
                                            {variants.map((variant, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: '16px',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#fff',
                                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.borderColor = '#93c5fd';
                                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                                        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                                        gap: '12px'
                                                    }}>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Màu sắc</p>
                                                            <p style={{ fontWeight: '500', color: '#1f2937' }}>{variant.color || "—"}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Kích thước</p>
                                                            <p style={{ fontWeight: '500', color: '#1f2937' }}>{variant.size || "—"}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Giá bán</p>
                                                            <p style={{ fontWeight: '500', color: '#1f2937' }}>{variant.price?.toLocaleString() || 0}₫</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Tồn kho</p>
                                                            <p style={{ fontWeight: '500', color: '#1f2937' }}>{variant.availableQuantity || 0}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        marginTop: '12px',
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        gap: '8px'
                                                    }}>
                                                        <button
                                                            style={{
                                                                padding: '6px',
                                                                color: '#6b7280',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                transition: 'color 0.2s, background-color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.color = '#2563eb';
                                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.color = '#6b7280';
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            style={{
                                                                padding: '6px',
                                                                color: '#6b7280',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                transition: 'color 0.2s, background-color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.color = '#dc2626';
                                                                e.currentTarget.style.backgroundColor = '#fee2e2';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.color = '#6b7280';
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer with action buttons */}
                        <div style={{
                            borderTop: '1px solid #e5e7eb',
                            padding: '16px 24px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                onClick={() => setIsEditPopupVisible(false)}
                                style={{
                                    padding: '8px 20px',
                                    border: '1px solid #d1d5db',
                                    color: '#374151',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                Hủy
                            </button>
                            <button
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Add keyframe animation in a style tag */}
                    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>
                </div>
            )}
        </>
    );
};

export default SellerProductManagement;