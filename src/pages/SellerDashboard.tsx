import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState<any>(null);

    const cards = [
        {
            title: "🛒 Quản lý sản phẩm",
            desc: "Tạo, chỉnh sửa và theo dõi sản phẩm một cách nhanh chóng.",
            color: "#fef9c3",
            hoverColor: "#fde68a",
            icon: "📦",
            url: "products"
        },
        {
            title: "⚡ Flash Sale",
            desc: "Tạo khuyến mãi hấp dẫn, thu hút khách hàng hiệu quả.",
            color: "#ffe4e6",
            hoverColor: "#fecdd3",
            icon: "🔥",
            url: "flash-sale"
        },
        {
            title: "📦 Đơn hàng",
            desc: "Theo dõi và xử lý đơn hàng mọi lúc mọi nơi.",
            color: "#d1fae5",
            hoverColor: "#a7f3d0",
            icon: "🚚",
            url: "orders"
        },
        {
            title: "📊 Thống kê",
            desc: "Xem doanh thu, lượt truy cập và hiệu suất bán hàng.",
            color: "#e0f2fe",
            hoverColor: "#bae6fd",
            icon: "📈",
            url: "flash-sale"
        },
        {
            title: "💸 Mã giảm giá",
            desc: "Tạo mã khuyến mãi để tăng đơn hàng và thu hút khách quay lại.",
            color: "#ede9fe",
            hoverColor: "#ddd6fe",
            icon: "🎟️",
            url: "vouchers"
        },
    ];

    return (
        <div
            style={{
                padding: "2.5rem",
                background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)",
                borderRadius: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                maxWidth: "1200px",
                margin: "2rem auto",
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div style={{
                    display: "inline-block",
                    background: "linear-gradient(to right, #ea580c, #d97706)",
                    borderRadius: "2rem",
                    padding: "0.5rem 1.5rem",
                    marginBottom: "1rem"
                }}>
                    <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "white",
                    }}>
                        ShopSphere
                    </span>
                </div>

                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        color: "#92400e",
                        marginBottom: "1rem",
                        textShadow: "0px 1px 2px rgba(0,0,0,0.1)"
                    }}
                >
                    Trang Quản Lý Người Bán
                </h1>
                <p
                    style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.6",
                        color: "#4b5563",
                        maxWidth: "700px",
                        margin: "0 auto",
                    }}
                >
                    Chào mừng bạn! Bắt đầu hành trình bán hàng thật hiệu quả cùng Shopsphere.
                    Chọn một tính năng từ menu để khám phá.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.75rem",
                }}
            >
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: activeCard === idx ? card.hoverColor : card.color,
                            padding: "1.75rem",
                            borderRadius: "1.2rem",
                            boxShadow: activeCard === idx
                                ? "0 8px 20px rgba(0,0,0,0.15)"
                                : "0 4px 12px rgba(0,0,0,0.08)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            transform: activeCard === idx ? "translateY(-5px)" : "translateY(0)",
                            border: `1px solid ${activeCard === idx ? 'rgba(0,0,0,0.1)' : 'transparent'}`,
                        }}
                        onMouseEnter={() => setActiveCard(idx)}
                        onMouseLeave={() => setActiveCard(null)}

                        onClick={() => navigate(`/seller/${card.url}`)}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "1rem"
                        }}>
                            <span style={{
                                fontSize: "2rem",
                                marginRight: "0.75rem"
                            }}>
                                {card.icon}
                            </span>
                            <h3
                                style={{
                                    fontSize: "1.3rem",
                                    fontWeight: 700,
                                    color: "#111827",
                                    margin: 0,
                                }}
                            >
                                {card.title}
                            </h3>
                        </div>
                        <p style={{
                            fontSize: "1rem",
                            color: "#4b5563",
                            lineHeight: "1.5",
                            marginBottom: "0.5rem"
                        }}>
                            {card.desc}
                        </p>
                        <div style={{
                            textAlign: "right"
                        }}>
                            <span style={{
                                display: "inline-block",
                                padding: "0.4rem 0.8rem",
                                backgroundColor: "rgba(255,255,255,0.5)",
                                borderRadius: "1rem",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                color: "#4b5563",
                                transition: "all 0.2s ease",
                                transform: activeCard === idx ? "scale(1.05)" : "scale(1)",
                            }}>
                                Xem chi tiết →
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Summary Row */}
            <div style={{
                marginTop: "2.5rem",
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
                <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "1rem"
                }}>
                    Tổng quan hoạt động
                </h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem"
                }}>
                    {[
                        { label: "Đơn hàng mới", value: "24", icon: "📬" },
                        { label: "Doanh thu hôm nay", value: "4.2tr₫", icon: "💰" },
                        { label: "Sản phẩm đang bán", value: "128", icon: "🏷️" },
                        { label: "Đánh giá mới", value: "12", icon: "⭐" }
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.75rem",
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                        }}>
                            <span style={{
                                fontSize: "1.75rem",
                                marginRight: "0.75rem"
                            }}>
                                {stat.icon}
                            </span>
                            <div>
                                <p style={{
                                    fontSize: "0.875rem",
                                    color: "#6b7280",
                                    margin: 0
                                }}>
                                    {stat.label}
                                </p>
                                <p style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    color: "#111827",
                                    margin: 0
                                }}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;