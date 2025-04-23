import { useState } from "react";
import ReviewForm from "./ReviewForm";

type CardOrderProfile = {
    orderId: number;
    profileId: string;
    orderDate: Date;
    statusOrder: string;
    totalPrice: number;
    orderItems: Array<OrderItem>;
    shippingFee: number;
    voucherId: number;
    note: string;
};

type OrderItem = {
    id: number;
    productVariantId: number;
    quantity: number;
    pricePerUnit: number;
    productName: string;
    productImage: string;
    supplierId: number;
    supplierName: string;
    variantColor?: string;
    variantSize?: string;
};

const CardOrderProfile = ({
    orderId,
    profileId,
    orderDate,
    statusOrder,
    totalPrice,
    orderItems,
    shippingFee,
    voucherId,
    note,
}: CardOrderProfile) => {
    const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);

    const handleCreateReview = (product: OrderItem) => {
        setSelectedProduct(product); // Lưu sản phẩm được chọn
        setShowReviewForm(true); // Hiển thị popup
    };

    const handleCloseReviewForm = () => {
        setShowReviewForm(false); // Đóng popup
        setSelectedProduct(null); // Xóa sản phẩm được chọn
    };

    // Hàm nhóm sản phẩm theo supplier
    const groupBySupplier = (items: OrderItem[]) => {
        return items.reduce((acc: { [key: string]: OrderItem[] }, item) => {
            if (!acc[item.supplierName]) {
                acc[item.supplierName] = [];
            }
            acc[item.supplierName].push(item);
            return acc;
        }, {});
    };
    const groupedItems = groupBySupplier(orderItems);

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

    return (
        <>
            <div
                style={{
                    backgroundColor: "#fff",
                    marginTop: "0.625rem",
                    padding: "1.5rem 1.5rem 0.75rem 1.5rem",
                    borderBottom: "1px solid rgba(0, 0, 0, .09)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(0, 0, 0, .09)",
                        fontSize: "0.75rem",
                        paddingBottom: "0.75rem",
                    }}
                >
                    <div>Yêu cầu vào: {new Date(orderDate).toLocaleDateString()}</div>
                    <div style={{ color: "#ee4d2d" }}>{getStatusText(statusOrder)}</div>
                </div>

                {/* Hiển thị sản phẩm theo từng nhà cung cấp */}
                {Object.keys(groupedItems).map((supplierName) => (
                    <div key={supplierName} style={{ marginTop: "1rem" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-shop"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                                </svg>
                            </div>
                            <div
                                style={{
                                    marginLeft: "0.625rem",
                                    fontWeight: "600",
                                }}
                            >
                                {supplierName}
                            </div>
                            <div
                                style={{
                                    marginLeft: "0.625rem",
                                    color: "#fff",
                                    backgroundColor: "#ee4d2d",
                                    padding: "0.25rem 0.5rem",
                                    border: "1px solid transparent",
                                    borderRadius: "0.125rem",
                                    outline: "none",
                                    textTransform: "capitalize",
                                    fontSize: "0.625rem",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="currentColor"
                                    className="bi bi-chat-text"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
                                </svg>
                                <span style={{ marginLeft: "0.125rem" }}>Chat</span>
                            </div>
                            <div
                                style={{
                                    marginLeft: "0.625rem",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid rgba(0, 0, 0, .09)",
                                    borderRadius: "0.125rem",
                                    padding: "0.25rem 0.5rem",
                                    fontSize: "0.625rem",
                                    cursor: "pointer",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="currentColor"
                                    className="bi bi-shop-window"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5" />
                                </svg>
                                <span
                                    style={{
                                        marginLeft: "0.125rem",
                                        color: "#555555",
                                    }}
                                >
                                    Xem shop
                                </span>
                            </div>
                        </div>

                        {/* Thông tin sản phẩm  */}
                        {groupedItems[supplierName].map((order) => (
                            <div
                                key={order.id}
                                style={{
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.625rem",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        flex: "1",
                                    }}
                                >
                                    <div
                                        style={{
                                            marginRight: "0.625rem",
                                            border: "1px solid #e1e1e1",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: "4.75rem",
                                                height: "4.75rem",
                                            }}
                                            src={order.productImage}
                                            alt="product-image"
                                        />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "0.825rem",
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: "2",
                                            }}
                                        >
                                            {order.productName}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "rgba(0, 0, 0, .54)",
                                                marginTop: "0.25rem",
                                            }}
                                        >
                                            Phân loại hàng:{" "}
                                            {order.variantColor ||
                                                order.variantSize ||
                                                "Không có"}
                                        </div>
                                        <div style={{ fontSize: "0.75rem" }}>
                                            x{order.quantity}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        paddingLeft: "0.625rem",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    ₫{order.pricePerUnit.toLocaleString("vi-VN")}
                                </div>
                                {statusOrder === "DELIVERED" && (
                                    <div
                                        style={{
                                            color: "#fff",
                                            backgroundColor: "#ee4d2d",
                                            padding: "0.25rem 0.35rem",
                                            minWidth: "6rem",
                                            marginLeft: "0.625rem",
                                            border: "1px solid rgba(0, 0, 0, .26)",
                                            borderRadius: "0.25rem",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleCreateReview(order)}
                                    >
                                        Đánh giá
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                        style={{
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            padding: "1.5rem 1.5rem 0.75rem",
                            justifyContent: "flex-end",
                        }}
                    >
                    </div>

                    <div
                        style={{
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            padding: "1.5rem 1.5rem 0.75rem",
                            justifyContent: "flex-end",
                        }}
                    >
                        Thành tiền:
                        <span
                            style={{
                                color: "#ee4d2d",
                                fontSize: "0.875rem",
                                marginLeft: "0.25rem",
                            }}
                        >
                            ₫
                        </span>
                        <span
                            style={{
                                color: "#ee4d2d",
                                fontSize: "1.25rem",
                            }}
                        >
                            {(totalPrice).toLocaleString("vi-VN")}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.75rem 1.5rem 1.5rem",
                        justifyContent: "space-between",
                    }}
                >
                    {statusOrder === "DELIVERED" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                color: "rgba(0, 0, 0, .54)",
                                fontSize: "0.625rem",
                            }}
                        >
                            Đã giao thành công
                        </div>
                    )}

                    <div
                        style={{
                            flex: "1",
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: "0.75rem",
                        }}
                    >
                        {(statusOrder === "DELIVERED" ||
                            statusOrder === "CANCELED") && (
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
                                >
                                    Mua lại
                                </div>
                            )}

                        {(statusOrder === "PENDING" ||
                            statusOrder === "CONFIRMED") && (
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
                                    Hủy đơn hàng
                                </div>
                            )}

                        {statusOrder === "CANCELED" && (
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
                                Xem chi tiết hủy đơn
                            </div>
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
                            Liên hệ người bán
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup ReviewForm */}
            {showReviewForm && selectedProduct && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            backgroundColor: "#fff",
                            padding: "1rem",
                            borderRadius: "8px",
                            width: "90%",
                            maxWidth: "600px",
                        }}
                    >
                        <button
                            onClick={handleCloseReviewForm}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "none",
                                border: "none",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                            }}
                        >
                            &times;
                        </button>
                        <ReviewForm
                            productVariantId={selectedProduct.productVariantId}
                            profileId={localStorage.getItem("profileId") || ""}
                            handleClosePopup={handleCloseReviewForm}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CardOrderProfile;