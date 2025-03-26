import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';
import HeaderAuth from './HeaderAuth';

const AuthLayout = () => {
    return (
        <>
            <Layout>
                <HeaderAuth />
                <Outlet />
                <FooterLayout />
            </Layout>
        </>
    );
}

export default AuthLayout;