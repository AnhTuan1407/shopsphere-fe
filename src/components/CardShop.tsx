import { useEffect, useState } from "react";
import Supplier from "../models/supplier.model";
import supplierService from "../services/supplier.service";
import { useNavigate } from "react-router-dom";

type Props = {
    supplier: Supplier,
}

const CardShop = ({
    supplier
}: Props) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [productCount, setProductCount] = useState<any>();

    const navigate = useNavigate();

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    useEffect(() => {
        const countProduct = async () => {
            try {
                const response = await supplierService.countProductBySupplierId(supplier.id);
                if (response.code === 1000) {
                    setProductCount(response.result);
                } else {
                    console.log("Có lỗi xảy ra: ", response.message);

                }
            } catch (error) {
                console.log("Lỗi khi lấy số lượng sản phẩm: ", error);
            }
        }

        countProduct();
    }, [])

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '64rem',
            margin: '1rem auto'
        }}>
            {/* 1. Avatar shop */}
            <div style={{ flexShrink: 0, marginRight: '1.5rem' }}>
                <div style={{ position: 'relative' }}
                    onClick={() => navigate(`/supplier/${supplier.id}`)}
                >
                    <img
                        src="/assets/supplier-avatar.jpg"
                        alt="Shop Avatar"
                        style={{
                            width: '5rem',
                            height: '5rem',
                            borderRadius: '9999px',
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb'
                        }}
                    />
                    <img
                        src="/assets/supplier-mall.png"
                        alt="Mall Badge"
                        style={{
                            position: 'absolute',
                            bottom: '-0.25rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            height: '1rem',
                            width: '4rem'
                        }}
                    />
                </div>
            </div>

            {/* 2. Shop name and followers */}
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1.5rem' }}>
                <div style={{ fontWeight: '600', fontSize: '1.125rem', textTransform: "uppercase" }}>{supplier.name}</div>
                <div style={{ fontWeight: '400', fontSize: '0.875rem', textTransform: "lowercase" }}>{supplier.name}</div>
                <div style={{ color: '#4B5563', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    <span style={{ color: "#ee4d2d" }}>{supplier.followers || 0} </span>
                    <span>người theo dõi</span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>Đang theo dõi <span style={{ color: "#ee4d2d" }}>120</span></span>
                </div>
            </div>

            {/* 3. Shop metrics */}
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: '1rem' }}>
                {[
                    [productCount, 'Sản phẩm'],
                    ['4.8/5', 'Đánh giá'],
                    ['98%', 'Tỉ lệ phản hồi'],
                    ['Trong 1h', 'Thời gian phản hồi']
                ].map(([value, label], index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: "1px solid rgba(0, 0, 0, .09)", paddingLeft: "1rem" }}>
                        <span style={{ fontWeight: '500', color: "#ee4d2d" }}>{value}</span>
                        <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* 4. Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1.5rem', gap: '0.5rem' }}>
                <button
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #D1D5DB',
                        color: '#374151',
                        fontWeight: '500',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.125rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onClick={() => navigate(`/supplier/${supplier.id}`)}
                >
                    Xem shop
                </button>
                <button
                    onClick={toggleFollow}
                    style={{
                        backgroundColor: isFollowing ? '#E5E7EB' : '#ee4d2d',
                        color: isFollowing ? '#1F2937' : 'white',
                        fontWeight: '500',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.125rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        outline: "none",
                        border: "none"
                    }}
                >
                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
            </div>
        </div>
    );
}

export default CardShop;