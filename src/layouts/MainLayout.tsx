import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';
import HeaderLayout from './Header';

const MainLayout = () => {
    return (
        <>
            <Layout>
                <HeaderLayout />
                <Outlet />
                <FooterLayout />
            </Layout>
        </>
    );
}

export default MainLayout;