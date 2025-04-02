import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import FooterLayout from './Footer';
import Header from './Header';

const { Sider, Content } = Layout;

const ProfileLayout = () => {
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout style={{ justifyContent: 'center' }}>
                {/* Wrapper for Sidebar and Content */}
                <div
                    style={{
                        display: 'flex',
                        width: '1200px',
                        margin: '1.5rem auto',
                    }}
                >
                    {/* Sidebar */}
                    <Sider
                        width={200}
                        style={{
                            borderRight: '1px solid #f0f0f0',
                        }}
                    >
                        <Menu
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            style={{ height: '100%', borderRight: 0 }}
                            items={[
                                {
                                    key: "/profile",
                                    label: <Link to="/profile">Thông tin cá nhân</Link>,
                                },
                                {
                                    key: "/profile/orders",
                                    label: <Link to="/profile/orders">Đơn hàng</Link>,
                                },
                                {
                                    key: "/profile/address",
                                    label: <Link to="/profile/address">Địa chỉ</Link>,
                                },
                                {
                                    key: "/profile/settings",
                                    label: <Link to="/profile/settings">Cài đặt</Link>,
                                },
                            ]}
                        />
                    </Sider>

                    {/* Main Content */}
                    <Content
                        style={{
                            marginLeft: '16px',
                            flex: 1,
                        }}
                    >
                        <Outlet />
                    </Content>
                </div>
            </Layout>
            <FooterLayout />
        </Layout>
    );
};

export default ProfileLayout;