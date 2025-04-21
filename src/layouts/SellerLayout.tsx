import { AppstoreOutlined, BarChartOutlined, BookOutlined, PieChartOutlined, ShoppingCartOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { useState } from "react";
import shopeeLogo from "../assets/shopee-white-logo.png";
import HeaderSeller from '../layouts/HeaderSeller';
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const SellerLayout = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = (menuKey: string) => {
        navigate(menuKey);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: "64px", margin: "0 1rem 1rem 1rem", alignItems: "center" }}>
                    <img src={shopeeLogo} alt="logo-shopee" style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "auto"
                    }} />
                </div>
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" onClick={(e) => handleMenuClick(e.key)}>
                    <Menu.Item key="/seller/dashboard" icon={<PieChartOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="/seller/categories" icon={<BookOutlined />}>
                        Danh mục
                    </Menu.Item>
                    <Menu.Item key="/seller/products" icon={<AppstoreOutlined />}>
                        Sản phẩm
                    </Menu.Item>
                    <Menu.Item key="/seller/orders" icon={<ShoppingCartOutlined />}>
                        Đơn hàng
                    </Menu.Item>
                    <Menu.Item key="/seller/vouchers" icon={<SnippetsOutlined />}>
                        Mã giảm giá
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Content */}
            <Layout>
                <HeaderSeller />
                <Content style={{ padding: "16px" }}>
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};


export default SellerLayout;