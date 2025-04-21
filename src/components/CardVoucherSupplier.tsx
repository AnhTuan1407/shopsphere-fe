import React from "react";

type VoucherProps = {
    title: string;
    description: string;
    expiryDate: string;
    perUserLimit: number;
};

const Voucher: React.FC<VoucherProps> = ({ title, description, expiryDate, perUserLimit }) => {
    return (
        <div
            style={{
                display: "flex",
                border: "1px solid #f5c2c7",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff4f4",
                maxWidth: "320px",
                position: "relative",
            }}
        >
            {/* Phần bên trái */}
            <div
                style={{
                    flex: 2,
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    borderRight: "2px dashed #f5c2c7",
                }}
            >
                {/* Nội dung bên trái */}
                <div>
                    <h3 style={{ margin: "0 0 0.5rem", color: "#d0011b", fontSize: "1rem", fontWeight: "bold" }}>
                        {title}
                    </h3>
                    <p style={{ margin: "0 0 0.5rem", color: "#d0011b", fontSize: "0.875rem" }}>
                        {description}
                    </p>
                    <p style={{ margin: "0", color: "#999", fontSize: "0.75rem" }}>
                        HSD: {expiryDate}
                    </p>
                </div>
            </div>

            {/* Phần bên phải */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#fff4f4",
                    position: "relative",
                }}
            >
                {/* Số lượng */}
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
                    x{perUserLimit}
                </div>

                {/* Nút lưu */}
                <div
                    style={{
                        color: "#fff",
                        backgroundColor: "#d0011b",
                        fontSize: "1rem",
                        border: `1px solid #d0011b`,
                        padding: "0.5rem 1rem",
                        borderRadius: "0.625rem",
                        fontWeight: "500",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    Lưu
                </div>
            </div>
        </div>
    );
};

export default Voucher;