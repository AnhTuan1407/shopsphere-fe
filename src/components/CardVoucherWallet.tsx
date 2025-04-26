type CardVoucherWalletProps = {
    voucher: any;
    backgroundColor: string;
    imageSrc: string;
    quantity: number;
    isExpired?: boolean;
    isUsed?: boolean;
};

const CardVoucherWallet: React.FC<CardVoucherWalletProps> = ({
    voucher,
    backgroundColor,
    imageSrc,
    quantity,
    isExpired = false,
    isUsed = false,
}) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    let expirationText = "";
    let buttonText = "";
    let isDisabled = false;
    let overlayText = "";

    // Xác định trạng thái voucher
    if (isUsed) {
        expirationText = `Đã sử dụng`;
        buttonText = "Đã sử dụng";
        isDisabled = true;
        overlayText = "ĐÃ SỬ DỤNG";
    } else if (isExpired || endDate < currentDate) {
        expirationText = "Đã quá hạn";
        buttonText = "Đã quá hạn";
        isDisabled = true;
        overlayText = "ĐÃ HẾT HẠN";
    } else if (startDate > currentDate) {
        const daysUntilStart = Math.ceil((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        expirationText = `Có hiệu lực sau: ${daysUntilStart} ngày`;
        buttonText = "Dùng sau";
    } else {
        expirationText = `Hạn sử dụng: ${endDate.toLocaleDateString("vi-VN")}`;
        buttonText = "Dùng ngay";
    }

    return (
        <div
            style={{
                display: "flex",
                borderTop: "1px solid #ddd",
                borderRight: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                borderRadius: "5px 8px 8px 5px",
                overflow: "hidden",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                flex: "1",
                position: "relative",
                opacity: isDisabled ? 0.8 : 1,
            }}
        >
            {/* Phần răng cưa bên trái */}
            <div
                style={{
                    backgroundColor: isDisabled ? "#999" : backgroundColor,
                    width: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: "15px",
                            height: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            position: "absolute",
                            left: "-10px",
                            top: `${index * 15}px`,
                            marginTop: "5px",
                        }}
                    ></div>
                ))}

                <div style={{ textAlign: "center" }}>
                    <img
                        src={imageSrc}
                        alt=""
                        style={{
                            width: "50px",
                            height: "50px",
                            opacity: isDisabled ? 0.7 : 1,
                        }}
                    />
                    <div style={{ fontWeight: "500", color: "#fff" }}>{voucher.code}</div>
                </div>
            </div>

            {/* Phần thông tin voucher */}
            <div
                style={{
                    flex: 1,
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ flex: 1, maxWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 0.5rem", color: isDisabled ? "#999" : "#333" }}>{voucher.title}</h3>
                    <p style={{ margin: "0 0 0.5rem", color: isDisabled ? "#999" : "#555" }}>{voucher.description}</p>
                    <div style={{ display: "flex" }}>
                        <p style={{ margin: "0", color: "#888", fontSize: "0.75rem", marginRight: "0.625rem" }}>
                            {expirationText}
                        </p>
                        <div
                            style={{
                                color: isDisabled ? "#888" : "#05a",
                                fontWeight: "500",
                                fontSize: "0.75rem",
                                textAlign: "right",
                                cursor: "pointer",
                            }}
                        >
                            Điều kiện
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        color: isDisabled ? "#aaa" : backgroundColor,
                        backgroundColor: isDisabled ? "#f5f5f5" : "#fff",
                        fontSize: "0.875rem",
                        border: `1px solid ${isDisabled ? "#aaa" : backgroundColor}`,
                        padding: "0.25rem 0.875rem",
                        borderRadius: "0.5rem",
                        fontWeight: "500",
                        textAlign: "center",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        pointerEvents: isDisabled ? "none" : "auto",
                    }}
                >
                    {buttonText}
                </div>
            </div>

            {/* Hiển thị số lượng ở góc phải */}
            {quantity > 1 && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#d0011b",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        padding: "2px 6px",
                        borderRadius: "12px",
                    }}
                >
                    x{quantity}
                </div>
            )}

            {/* Overlay cho voucher đã sử dụng hoặc quá hạn */}
            {isDisabled && overlayText && (
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            transform: "rotate(-25deg)",
                            border: "2px solid #d0011b",
                            color: "#d0011b",
                            padding: "5px 15px",
                            borderRadius: "5px",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        {overlayText}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardVoucherWallet;