import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';
import HeaderOrder from './HeaderOrder';

const OrderLayout = () => {
    return (
        <>
            <Layout>
                <HeaderOrder />
                <Outlet />
                <FooterLayout />
            </Layout>
        </>
    );
}

export default OrderLayout;