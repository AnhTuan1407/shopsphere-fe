import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Order from "../models/order.model";
import Supplier from "../models/supplier.model";
import orderService from "../services/order.service";
import productService from "../services/product.service";
import supplierService from "../services/supplier.service";

const SupplierOrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Hàm chuyển đổi trạng thái đơn hàng sang tiếng Việt
    const getStatusText = (status: string): string => {
        switch (status) {
            case "PENDING":
                return "Đang chờ xác nhận";
            case "CONFIRMED":
                return "Đã xác nhận đơn hàng";
            case "IN_TRANSIT":
                return "Đang vận chuyển";
            case "OUT_FOR_DELIVERY":
                return "Chờ giao hàng";
            case "DELIVERED":
                return "Đã giao hàng thành công";
            case "CANCELED":
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };

    // Hàm tính tổng tiền của đơn hàng
    const calculateTotalPrice = (orderItems: any[]) => {
        return orderItems.reduce((total, item) => total + item.quantity * item.pricePerUnit, 0);
    };

    // Hàm cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await orderService.updateOrderStatus(orderId, newStatus);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Cập nhật trạng thái đơn hàng thành công!");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, statusOrder: newStatus } : order
                    )
                );
            } else {
                toast.error("Cập nhật trạng thái đơn hàng thất bại!");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    toast.error("Không tìm thấy userId trong localStorage");
                    return;
                }

                const supplierResponse = await supplierService.getSupplierByUserId(userId);
                if (supplierResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setSupplierId((supplierResponse.result as Supplier).id);

                    const ordersResponse = await orderService.getAllOrders();
                    const allOrders = ordersResponse.result as Order[];

                    const filteredOrders = [];
                    for (const order of allOrders) {
                        const filteredItems = [];
                        for (const item of order.orderItems) {
                            const productResponse = await productService.getProductByVariantId(item.productVariantId);
                            const variantResponse = await productService.getVariantById(item.productVariantId);
                            const product = productResponse.result;
                            const variant = variantResponse.result;
                            if (product.supplier.id === (supplierResponse.result as Supplier).id) {
                                filteredItems.push({
                                    ...item,
                                    productName: product.name,
                                    productImage: product.imageUrl,
                                    variantType: `${variant.size || ""} ${variant.color || ""}`.trim(),
                                });
                            }
                        }
                        if (filteredItems.length > 0) {
                            filteredOrders.push({ ...order, orderItems: filteredItems });
                        }
                    }

                    setOrders(filteredOrders);
                } else {
                    toast.error("Không tìm thấy supplier tương ứng");
                }
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            {/* Thanh điều hướng */}
            <div
                style={{
                    display: "flex",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    marginBottom: "0.75rem",
                    width: "100%",
                    alignItems: "center",
                    borderBottom: "2px solid rgba(0, 0, 0, .09)",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        borderBottom: "2px solid rgba(0, 0, 0, .09)",
                        borderColor: "#ee4d2d",
                        lineHeight: "19px",
                        padding: "1rem 0",
                        transition: "color .2s",
                        color: "#ee4d2d",
                    }}
                >
                    Tất cả
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "1rem 0", color: "#555" }}>
                    Đang xử lý
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "1rem 0", color: "#555" }}>
                    Đang giao hàng
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "1rem 0", color: "#555" }}>
                    Đã giao hàng
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "1rem 0", color: "#555" }}>
                    Đã hủy
                </div>
            </div>

            {/* Tìm kiếm */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EAEAEA",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: "10px" }}
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                    style={{
                        width: "100%",
                        padding: "0.625rem",
                        backgroundColor: "#EAEAEA",
                        border: "0",
                        outline: "0",
                        fontSize: "0.875rem",
                    }}
                    placeholder="Tìm kiếm theo mã đơn hàng, sản phẩm..."
                />
            </div>

            {/* Danh sách đơn hàng */}
            {orders.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>Bạn chưa có đơn hàng nào</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.id}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            padding: "1rem",
                            marginBottom: "1rem",
                            border: "1px solid rgba(0, 0, 0, 0.09)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <h3 style={{ color: "#333", fontSize: "1rem", fontWeight: "500" }}>Mã đơn hàng: {order.id}</h3>
                            <p style={{ color: "#555", fontSize: "0.875rem" }}>
                                Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                        </div>
                        <p style={{ color: "#555", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                            Trạng thái:{" "}
                            <span style={{ color: "#ee4d2d", fontWeight: "500" }}>{getStatusText(order.statusOrder)}</span>
                        </p>
                        <p style={{ color: "#555", fontSize: "0.875rem", marginBottom: "1rem" }}>
                            Tổng tiền:{" "}
                            <span style={{ fontWeight: "500", color: "#333" }}>
                                ₫{calculateTotalPrice(order.orderItems).toLocaleString("vi-VN")}
                            </span>
                        </p>

                        <div>
                            {order.orderItems.map((item: any) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "0.75rem",
                                        paddingBottom: "0.75rem",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.09)",
                                    }}
                                >
                                    <img
                                        src={item.productImage || "https://via.placeholder.com/150"}
                                        alt={item.productName}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                            marginRight: "10px",
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h5
                                            style={{
                                                margin: "0 0 5px",
                                                color: "#333",
                                                fontSize: "0.875rem",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.productName}
                                        </h5>
                                        <p style={{ margin: "0", color: "#555", fontSize: "0.75rem" }}>
                                            Loại: {item.variantType}
                                        </p>
                                        <p style={{ margin: "0", color: "#555", fontSize: "0.75rem" }}>
                                            Số lượng: {item.quantity}
                                        </p>
                                        <p style={{ margin: "0", color: "#555", fontSize: "0.75rem" }}>
                                            Giá: ₫{item.pricePerUnit.toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ flex: "1", display: "flex", justifyContent: "flex-end", fontSize: "0.75rem" }}>
                            {order.statusOrder === "PENDING" && (
                                <>
                                    <div
                                        style={{
                                            color: "#fff",
                                            backgroundColor: "#ee4d2d",
                                            padding: "0.5rem 0.625rem",
                                            minWidth: "8rem",
                                            marginRight: "0.625rem",
                                            border: "1px solid rgba(0, 0, 0, .26)",
                                            borderRadius: "0.25rem",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                                    >
                                        Xác nhận
                                    </div>
                                    <div
                                        style={{
                                            color: "#555",
                                            backgroundColor: "#fff",
                                            padding: "0.5rem 0.625rem",
                                            marginRight: "0.625rem",
                                            border: "1px solid rgba(0, 0, 0, .26)",
                                            borderRadius: "0.25rem",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleUpdateStatus(order.id, "CANCELED")}
                                    >
                                        Hủy đơn hàng
                                    </div>
                                </>
                            )}
                            <div
                                style={{
                                    color: "#555",
                                    backgroundColor: "#fff",
                                    padding: "0.5rem 0.625rem",
                                    marginRight: "0.625rem",
                                    border: "1px solid rgba(0, 0, 0, .26)",
                                    borderRadius: "0.25rem",
                                    cursor: "pointer",
                                }}
                            >
                                Xem chi tiết đơn hàng
                            </div>
                            <div
                                style={{
                                    color: "#555",
                                    backgroundColor: "#fff",
                                    padding: "0.5rem 0.625rem",
                                    marginRight: "0.625rem",
                                    border: "1px solid rgba(0, 0, 0, .26)",
                                    borderRadius: "0.25rem",
                                    cursor: "pointer",
                                }}
                            >
                                Liên hệ người mua
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SupplierOrderManagement;