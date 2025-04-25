import { AppstoreOutlined, BookOutlined, FormOutlined, PieChartOutlined, ShoppingCartOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import shopeeLogo from "../assets/shopee-white-logo.png";
import HeaderSeller from '../layouts/HeaderSeller';

const { Content } = Layout;

const SellerLayout = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [activeKey, setActiveKey] = useState("/seller/dashboard");

    const handleMenuClick = (menuKey: string) => {
        setActiveKey(menuKey);
        navigate(menuKey);
    };

    // Menu items data
    const menuItems = [
        { key: "/seller/dashboard", icon: <PieChartOutlined />, label: "Dashboard" },
        { key: "/seller/categories", icon: <BookOutlined />, label: "Danh mục" },
        { key: "/seller/products", icon: <AppstoreOutlined />, label: "Sản phẩm" },
        { key: "/seller/orders", icon: <ShoppingCartOutlined />, label: "Đơn hàng" },
        { key: "/seller/vouchers", icon: <SnippetsOutlined />, label: "Mã giảm giá" },
        { key: "/seller/flash-sale", icon: <FormOutlined />, label: "Flash sale" }
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Custom Sidebar */}
            <div
                style={{
                    width: collapsed ? "80px" : "200px",
                    background: "linear-gradient(180deg, #ee4d2d 30%, #ff7337 100%)",
                    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
                    transition: "width 0.3s",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "64px",
                        padding: "16px",
                        marginBottom: "16px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                >
                    <img
                        src={shopeeLogo}
                        alt="logo-shopee"
                        style={{
                            maxHeight: "40px",
                            maxWidth: collapsed ? "48px" : "100%",
                            transition: "all 0.3s"
                        }}
                    />
                </div>

                {/* Menu Items */}
                <div style={{ flex: 1, overflow: "auto" }}>
                    {menuItems.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => handleMenuClick(item.key)}
                            style={{
                                margin: "4px 12px",
                                padding: collapsed ? "0" : "0 16px",
                                borderRadius: "8px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                color: activeKey === item.key ? "#fff" : "rgba(255, 255, 255, 0.8)",
                                fontWeight: activeKey === item.key ? "500" : "normal",
                                backgroundColor: activeKey === item.key ? "rgba(255, 255, 255, 0.2)" : "transparent",
                                boxShadow: activeKey === item.key ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none",
                                transition: "all 0.3s",
                                justifyContent: collapsed ? "center" : "flex-start",
                            }}
                            onMouseEnter={(e) => {
                                if (activeKey !== item.key) {
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                                    e.currentTarget.style.color = "#fff";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeKey !== item.key) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                                }
                            }}
                        >
                            <span style={{
                                fontSize: "18px",
                                marginRight: collapsed ? "0" : "12px",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                {item.icon}
                            </span>
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    ))}
                </div>

                {/* Collapse Toggle Button */}
                <div
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        color: "white",
                        transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
                    }}
                >
                    {collapsed ? "→" : "←"}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <HeaderSeller />
                <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SellerLayout;