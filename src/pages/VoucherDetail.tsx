import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productService from "../services/product.service";

const VoucherDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const voucher = location.state?.voucher;

    const [productNames, setProductNames] = useState<{ id: number; name: string }[]>([]);

    type VoucherApplicableProductResponse = {
        productId: number,
        name: string
    }

    useEffect(() => {
        const fetchProductNames = async () => {
            if (voucher?.applicableProducts && voucher.applicableProducts.length > 0) {
                try {
                    const products = await Promise.all(
                        voucher.applicableProducts.map(async (item: VoucherApplicableProductResponse) => {
                            const product = await productService.getProductById(item.productId);
                            return { id: item.productId, name: product.name };
                        })
                    );
                    console.log("Product: ", products);

                    setProductNames(products);
                } catch (error) {
                    console.error("Error fetching product names:", error);
                }
            }
        };

        fetchProductNames();
    }, [voucher]);

    if (!voucher) {
        return <div>Không tìm thấy thông tin voucher.</div>;
    }

    const handleUseNow = () => {
        navigate("/");
    };

    const translatePaymentMethod = (paymentMethod: string) => {
        switch (paymentMethod) {
            case "PAY_ONLINE":
                return "Thanh toán trực tuyến";
            case "PAY_LATER":
                return "Thanh toán sau khi nhận hàng";
            case "ALL_PAYMENT_TYPE":
                return "Tất cả các phương thức thanh toán";
            default:
                return "Không xác định";
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem 0",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    margin: "1.875rem auto",
                    position: "relative",
                    width: "23.4375rem",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Phần trên - Background full width */}
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 124" style={{
                        height: "7.75rem",
                        position: "absolute"
                    }}>
                        <defs>
                            <mask id="mask" x="-158.6" y="-18" width="533.6" height="148.15" maskUnits="userSpaceOnUse">
                                <rect width="375" height="124" fill="#fff"></rect>
                            </mask>
                            <linearGradient id="linear-gradient" x1="-118.19" y1="460.81" x2="-117.77" y2="460.74" gradientTransform="matrix(-384.46, 0, 0, 148.15, -45258.88, -68202.4)" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#ffa200" stop-opacity="0.48"></stop><stop offset="1" stop-color="#ffb600" stop-opacity="0.26">
                                </stop>
                            </linearGradient>
                        </defs>
                        <rect width="375" height="124" fill="#f36700"></rect>
                        <g>
                            <path d="M225.87-4.94Q120.52,212.82-96.37,79.56T225.87-4.94Z" fill="#ffa200" fillRule="evenodd">
                            </path>
                        </g>
                    </svg>
                </div>

                {/* Thẻ voucher */}
                <div
                    style={{
                        position: "relative",
                        top: "3rem",
                        left: "1.125rem",
                        width: "90%",
                        maxWidth: "400px",
                        backgroundColor: "#fff",
                        borderRadius: "2px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        overflow: "hidden",
                    }}
                >
                    {/* Phần bên trái - Background */}
                    <div
                        style={{
                            backgroundColor: voucher.voucherType === "SHIPPING" ? "rgb(38, 170, 153)" : "#ee4d2d",
                            width: "100px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "1rem",
                        }}
                    >
                        <img
                            src={
                                voucher.voucherType === "SHIPPING"
                                    ? "/assets/voucher/bg-voucher-shipping.png"
                                    : "/assets/voucher/bg-voucher-shopeepay.png"
                            }
                            alt="Voucher"
                            style={{
                                width: "50px",
                                height: "50px",
                                marginBottom: "0.5rem",
                            }}
                        />
                        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "0.875rem" }}>{voucher.code}</div>
                    </div>

                    {/* Phần bên phải - Thông tin voucher */}
                    <div
                        style={{
                            flex: 1,
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <h3 style={{ margin: "0 0 0.5rem", color: "#333", fontSize: "1rem" }}>{voucher.title}</h3>
                            <p style={{ margin: "0 0 0.5rem", color: "#555", fontSize: "0.875rem" }}>{voucher.description}</p>
                            <p style={{ margin: "0", color: "#999", fontSize: "0.75rem" }}>
                                Hạn sử dụng: {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                                {new Date(voucher.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phần dưới - Thông tin chi tiết */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        width: "90%",
                        margin: "1.5rem auto 0 auto ",
                        maxWidth: "800px",
                        borderRadius: "10px",
                        padding: "2rem",
                    }}
                >
                    {/* Hạn sử dụng */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>Hạn sử dụng</h3>
                        <p style={{ margin: "0", color: "#555", fontSize: "0.875rem" }}>
                            {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                            {new Date(voucher.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Ưu đãi */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>Ưu đãi</h3>
                        <p style={{ margin: "0", color: "#555", fontSize: "0.875rem" }}>{voucher.description}</p>
                    </div>

                    {/* Thanh toán */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>Thanh toán</h3>
                        <p style={{ margin: "0", color: "#555", fontSize: "0.875rem" }}>
                            {translatePaymentMethod(voucher.applicablePayment)}
                        </p>
                    </div>

                    {/* Thiết bị */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>Thiết bị</h3>
                        <p style={{ margin: "0", color: "#555", fontSize: "0.875rem" }}>
                            IOS, Android
                        </p>
                    </div>

                    {/* Xem chi tiết */}
                    <div>
                        <h3 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>Xem chi tiết</h3>
                        {productNames.length > 0 ? (
                            <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                                {productNames.map((product) => (
                                    <li key={product.id} style={{ marginBottom: "0.5rem" }}>
                                        <a
                                            href={`/products/${product.id}`}
                                            style={{
                                                color: "#007bff",
                                                textDecoration: "none",
                                                fontSize: "0.875rem",
                                                display: "inline-block",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "200px", // Giới hạn chiều rộng để tạo hiệu ứng cắt chữ
                                            }}
                                            title={product.name} // Hiển thị tên đầy đủ khi hover
                                        >
                                            {product.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ margin: "0", color: "#555", fontSize: "0.875rem" }}>
                                <a href="/" style={{ color: "#007bff", textDecoration: "none" }}>
                                    Tất cả sản phẩm
                                </a>
                            </p>
                        )}
                        <p style={{ color: "#333", fontSize: "0.75rem" }}>
                            Số lượt sử dụng có hạn, chương trình và mã có thể kết thúc khi hết lượt ưu đãi hoặc khi hết hạn ưu đãi,
                            tuỳ điều kiện nào đến trước.
                        </p>
                    </div>
                </div>
                {/* Nút Dùng Ngay */}
                <div style={{ textAlign: "center", width: "22rem", margin: "0 auto 0.25rem auto" }}>
                    <button
                        style={{
                            backgroundColor: "#ee4d2d",
                            color: "#fff",
                            padding: "0.5rem 1.5rem",
                            border: "none",
                            borderRadius: "2px",
                            fontSize: "1rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            width: "100%"
                        }}
                        onClick={handleUseNow}
                    >
                        Dùng ngay
                    </button>
                </div>
            </div>
        </div >
    );
};

export default VoucherDetail;