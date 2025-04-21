import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';
import HeaderSupplier from './HeaderSupplier';

const SupplierLayout = () => {
    return (
        <>
            <Layout>
                <HeaderSupplier />
                <Outlet />
                <FooterLayout />
            </Layout>
        </>
    )
}

export default SupplierLayout;