import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import VoucherSupplier from "../components/VoucherSupplier";
import Product from "../models/product.model";
import Supplier from "../models/supplier.model";
import Voucher from "../models/voucher.model";
import productService from "../services/product.service";
import supplierService from "../services/supplier.service";
import voucherService from "../services/voucher.service";

const SellerVoucherManagement = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [voucherTypes, setVoucherTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [newVoucher, setNewVoucher] = useState<{
        code: string;
        title: string;
        description: string;
        voucherType: string;
        discountPercent: number;
        discountAmount: number;
        minOrderAmount: number;
        maxDiscountAmount: number;
        startDate: string;
        endDate: string;
        totalQuantity: number;
        applicablePayment: string;
        applicableProducts: string[];
    }>({
        code: "",
        title: "",
        description: "",
        voucherType: "",
        discountPercent: 0,
        discountAmount: 0,
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        startDate: "",
        endDate: "",
        totalQuantity: 0,
        applicablePayment: "",
        applicableProducts: [],
    });

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    toast.error("Không tìm thấy userId trong localStorage");
                    return;
                }

                // Lấy supplierId từ userId
                const supplierResponse = await supplierService.getSupplierByUserId(userId);
                if (supplierResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    if (supplierResponse.result as Supplier) {
                        setSupplierId((supplierResponse.result as Supplier).id);
                        // Lấy danh sách sản phẩm của supplier
                        const productsResponse = await productService.getAllProducts();
                        const supplierProducts = productsResponse.filter(
                            (product) => product.supplier?.id === (supplierResponse.result as Supplier).id
                        );
                        setProducts(supplierProducts);

                        // Lấy danh sách voucher
                        const vouchersResponse = await voucherService.getAllVoucherBySupplierId((supplierResponse.result as Supplier).id);
                        setVouchers(vouchersResponse.result as Voucher[]);
                    }
                } else {
                    toast.error("Không tìm thấy supplier tương ứng");
                }
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
                toast.error("Có lỗi xảy ra khi tải danh sách voucher");
            } finally {
                setLoading(false);
            }
        };

        const fetchVoucherTypes = async () => {
            try {
                const response = await voucherService.getAllVoucherType();
                if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setVoucherTypes(response.result as string[]);
                } else {
                    toast.error("Không thể tải danh sách loại voucher");
                }
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
                toast.error("Có lỗi xảy ra khi tải danh sách loại voucher");
            }
        };

        fetchVouchers();
        fetchVoucherTypes();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewVoucher({ ...newVoucher, [name]: value });
    };

    const handleProductSelection = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        if (e.target.checked) {
            setNewVoucher((prevState) => ({
                ...prevState,
                applicableProducts: [...prevState.applicableProducts, productId],
            }));
        } else {
            setNewVoucher((prevState) => ({
                ...prevState,
                applicableProducts: prevState.applicableProducts.filter((id) => id !== productId),
            }));
        }
    };

    const handleCreateVoucher = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                toast.error("Không tìm thấy userId trong localStorage");
                return;
            }

            // Lấy supplierId từ userId
            const supplierResponse = await supplierService.getSupplierByUserId(userId);
            if (supplierResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                const supplierId = (supplierResponse.result as Supplier).id;

                // Gửi yêu cầu tạo voucher
                const createResponse = await voucherService.createVoucher({
                    ...newVoucher,
                    creatorId: supplierId,
                    creatorType: "SUPPLIER",
                });

                if (createResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    toast.success("Tạo voucher thành công");
                    setShowPopup(false);

                    // Làm mới danh sách voucher
                    const vouchersResponse = await voucherService.getAllVoucherBySupplierId(supplierId);
                    setVouchers(vouchersResponse.result as Voucher[]);

                    // Đặt lại giá trị newVoucher
                    setNewVoucher({
                        code: "",
                        title: "",
                        description: "",
                        voucherType: "",
                        discountPercent: 0,
                        discountAmount: 0,
                        minOrderAmount: 0,
                        maxDiscountAmount: 0,
                        startDate: "",
                        endDate: "",
                        totalQuantity: 0,
                        applicablePayment: "",
                        applicableProducts: [],
                    });
                } else {
                    toast.error("Tạo voucher thất bại");
                }
            } else {
                toast.error("Không tìm thấy supplier tương ứng");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra khi tạo voucher");
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "left", marginBottom: "20px", color: "#333", fontSize: "1.5rem" }}>Quản Lý Voucher</div>
            <button
                style={{
                    backgroundColor: "#ee4d2d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    marginBottom: "20px",
                }}
                onClick={() => setShowPopup(true)}
            >
                Thêm Mới Voucher
            </button>

            {/* Hiển thị danh sách voucher */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    backgroundColor: "#fff",
                    padding: "20px",
                }}
            >
                {vouchers.map((voucher) => (
                    <VoucherSupplier key={voucher.id} voucher={voucher} />
                ))}
            </div>

            {/* Popup thêm mới voucher */}
            {showPopup && (
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
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "30px",
                            borderRadius: "10px",
                            width: "700px",
                            maxHeight: "90vh", // Giới hạn chiều cao
                            overflowY: "auto", // Thêm thanh cuộn dọc
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <h2 style={{ color: "#ee4d2d", marginBottom: "20px", textAlign: "center" }}>Thêm Mới Voucher</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {/* Mã Voucher */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Mã Voucher</label>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="Mã Voucher"
                                    value={newVoucher.code}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Tiêu Đề */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Tiêu Đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Tiêu Đề"
                                    value={newVoucher.title}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Mô Tả */}
                            <div style={{ gridColumn: "1 / span 2" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Mô Tả</label>
                                <textarea
                                    name="description"
                                    placeholder="Mô Tả"
                                    value={newVoucher.description}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        resize: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Loại Voucher */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Loại Voucher</label>
                                <select
                                    name="voucherType"
                                    value={newVoucher.voucherType}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <option value="">Chọn Loại Voucher</option>
                                    {voucherTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Phần Trăm Giảm Giá */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Phần Trăm Giảm Giá</label>
                                <input
                                    type="number"
                                    name="discountPercent"
                                    placeholder="Phần Trăm Giảm Giá"
                                    value={newVoucher.discountPercent}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Số Tiền Giảm Giá */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Số Tiền Giảm Giá</label>
                                <input
                                    type="number"
                                    name="discountAmount"
                                    placeholder="Số Tiền Giảm Giá"
                                    value={newVoucher.discountAmount}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Đơn Hàng Tối Thiểu */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Đơn Hàng Tối Thiểu</label>
                                <input
                                    type="number"
                                    name="minOrderAmount"
                                    placeholder="Đơn Hàng Tối Thiểu"
                                    value={newVoucher.minOrderAmount}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Giảm Giá Tối Đa */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Giảm Giá Tối Đa</label>
                                <input
                                    type="number"
                                    name="maxDiscountAmount"
                                    placeholder="Giảm Giá Tối Đa"
                                    value={newVoucher.maxDiscountAmount}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Số lượng */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Số lượng</label>
                                <input
                                    type="number"
                                    name="totalQuantity"
                                    placeholder="Số lượng voucher"
                                    value={newVoucher.totalQuantity}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Ngày Bắt Đầu */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Ngày Bắt Đầu</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={newVoucher.startDate}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Ngày Kết Thúc */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Ngày Kết Thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newVoucher.endDate}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Phương Thức Thanh Toán */}
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Phương Thức Thanh Toán</label>
                                <select
                                    name="applicablePayment"
                                    value={newVoucher.applicablePayment}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <option value="">Chọn Phương Thức Thanh Toán</option>
                                    <option value="PAY_ONLINE">Thanh Toán Online</option>
                                    <option value="PAY_LATER">Thanh Toán Sau</option>
                                    <option value="ALL_PAYMENT_TYPE">Tất Cả Các Loại Thanh Toán</option>
                                </select>
                            </div>

                            {/* Chọn Sản Phẩm */}
                            <div style={{ gridColumn: "1 / span 2" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Sản Phẩm Áp Dụng</label>
                                <button
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        backgroundColor: "#f5f5f5",
                                        cursor: "pointer",
                                        width: "100%",
                                        textAlign: "left",
                                    }}
                                    onClick={() => setShowProductSelector(true)}
                                >
                                    {newVoucher.applicableProducts.length > 0
                                        ? `Đã chọn ${newVoucher.applicableProducts.length} sản phẩm`
                                        : "Chọn sản phẩm"}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                            <button
                                style={{
                                    backgroundColor: "#ee4d2d",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCreateVoucher}
                            >
                                Lưu
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#ddd",
                                    color: "#333",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowPopup(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chọn sản phẩm */}
            {showProductSelector && (
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
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <h3 style={{ color: "#333", marginBottom: "20px" }}>Chọn Sản Phẩm Áp Dụng</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {products.map((product) => (
                                <label
                                    key={product.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={newVoucher.applicableProducts.includes(String(product.id))}
                                        onChange={(e) => handleProductSelection(e, String(product.id))}
                                    />
                                    {product.name}
                                </label>
                            ))}
                        </div>
                        <div style={{ marginTop: "20px", textAlign: "right" }}>
                            <button
                                style={{
                                    backgroundColor: "#ee4d2d",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                                onClick={() => setShowProductSelector(false)}
                            >
                                Xong
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#ddd",
                                    color: "#333",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowProductSelector(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerVoucherManagement;