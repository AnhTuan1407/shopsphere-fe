import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';
import HeaderCart from './HeaderCart';

const CartLayout = () => {
    return (
        <>
            <Layout>
                <HeaderCart />
                <Outlet />
                <FooterLayout />
            </Layout>
        </>
    );
}

export default CartLayout;