import React from "react";

type VoucherProps = {
    voucher: {
        id: number;
        code: string;
        title: string;
        description: string;
        startDate: Date,
        endDate: Date,
    };
};

const VoucherSupplier: React.FC<VoucherProps> = ({ voucher }) => {

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
                boxShadow: "2px 2px 4px #e8e8e8",
            }}
        >
            {/* Phần răng cưa bên trái */}
            <div
                style={{
                    backgroundColor: "#fff",
                    width: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    borderRight: "2px dashed #ccc",
                }}
            >
                {/* Góc trên nối với răng cưa */}
                <div
                    style={{
                        width: "2px",
                        height: "12px",
                        backgroundColor: "#ccc",
                        position: "absolute",
                        top: "0",
                        left: "-1px",
                    }}
                ></div>

                {[...Array(6)].map((_, index) => (
                    <React.Fragment key={index}>
                        {/* Hình tròn */}
                        <div
                            style={{
                                width: "18px",
                                height: "18px",
                                backgroundColor: "#fff",
                                border: "2px solid #ccc",
                                borderRadius: "50%",
                                position: "absolute",
                                left: "-10px",
                                top: `${index * 25 + 20}px`,
                            }}
                        ></div>

                        {/* Đoạn nối giữa các hình tròn */}
                        {index < 6 && (
                            <div
                                style={{
                                    width: "2px",
                                    height: "10px",
                                    backgroundColor: "#ccc",
                                    position: "absolute",
                                    left: "-1px",
                                    top: `${index * 25 + 38}px`,
                                }}
                            ></div>
                        )}
                    </React.Fragment>
                ))}

                {/* Góc dưới nối với răng cưa */}
                <div
                    style={{
                        width: "2px",
                        height: "12px",
                        backgroundColor: "#ccc",
                        position: "absolute",
                        bottom: "0",
                        left: "-1px",
                    }}
                ></div>

                <div style={{ textAlign: "center" }}>
                    <img
                        src="/assets/loppy.jpg"
                        alt=""
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                        }}
                    />
                    <div style={{ fontWeight: "500", color: "#333" }}>{voucher.code}</div>
                </div>
            </div>

            {/* Phần thông tin voucher */}
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
                    <h3 style={{ margin: "0 0 0.5rem", color: "#333" }}>{voucher.title}</h3>
                    <p style={{ margin: "0 0 1rem", color: "#555" }}>{voucher.description}</p>
                    {/* Hiển thị hạn sử dụng */}
                    <p style={{ margin: "0", color: "#999", fontSize: "0.875rem" }}>
                        HSD: {new Date(voucher.startDate).toLocaleDateString()} - {new Date(voucher.endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* <div
                    style={{
                        color: "#fff",
                        fontSize: "1.25rem",
                        border: "1px solid #fff",
                        padding: "0.25rem 1.5rem",
                        borderRadius: "0.625rem",
                        fontWeight: "500",
                        textAlign: "center",
                        marginBottom: "0.625rem",
                        cursor: "pointer",
                        backgroundColor: "#ee4d2d"
                    }}
                >
                    Lưu
                </div> */}

                <div
                    style={{
                        color: "#05a",
                        fontWeight: "500",
                        fontSize: "1rem",
                        textAlign: "right",
                        cursor: "pointer",
                    }}
                >
                    Điều kiện
                </div>
            </div>
        </div>
    );
};

export default VoucherSupplier;