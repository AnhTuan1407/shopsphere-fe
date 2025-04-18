type CardVoucherWalletProps = {
    voucher: any;
    backgroundColor: string;
    imageSrc: string;
};

const CardVoucherWallet: React.FC<CardVoucherWalletProps> = ({ voucher, backgroundColor, imageSrc }) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    // Tính toán trạng thái và thông tin hạn sử dụng
    let expirationText = "";
    let buttonText = "";
    let isDisabled = false;

    if (endDate < currentDate) {
        expirationText = "Đã quá hạn";
        buttonText = "Đã quá hạn";
        isDisabled = true;
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
            }}
        >
            {/* Phần răng cưa bên trái */}
            <div
                style={{
                    backgroundColor: backgroundColor,
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
                    <h3 style={{ margin: "0 0 0.5rem", color: "#333" }}>{voucher.title}</h3>
                    <p style={{ margin: "0 0 0.5rem", color: "#555" }}>{voucher.description}</p>
                    <div style={{ display: "flex" }}>
                        <p style={{ margin: "0", color: "#888", fontSize: "0.75rem", marginRight: "0.625rem" }}>{expirationText}</p>
                        <div
                            style={{
                                color: "#05a",
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
        </div>
    );
};

export default CardVoucherWallet;