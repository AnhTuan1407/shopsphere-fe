import { useEffect, useState } from "react";
import orderService from "../services/order.service";
import { toast } from "react-toastify";
import CardOrderProfile from "../components/CardOrderProfile";
import productService from "../services/product.service";

const styleFilterOrder = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    borderBottom: "2px solid rgba(0, 0, 0, .09)",
    lineHeight: "19px",
    padding: "1rem 0",
    transition: "color .2s"
}

type OrdersResponse = {
    id: number,
    profileId: string,
    orderDate: Date,
    statusOrder: string,
    totalPrice: number,
    orderItems: Array<OrderItem>
}

type OrderItem = {
    id: number,
    productVariantId: number,
    quantity: number,
    pricePerUnit: number,
    productName: string,
    productImage: string,
    supplierId: number,
    supplierName: string,
    variantColor?: string,
    variantSize?: string
}

const ProfileOrderPage = () => {

    const [orders, setOrders] = useState<OrdersResponse[]>([]);

    useEffect(() => {
        const profileId = localStorage.getItem("profileId");

        const fetchOrderDetails = async (orderItems: OrderItem[]) => {
            try {
                const updatedItems = await Promise.all(
                    orderItems.map(async (item) => {
                        try {
                            const productResponse = await productService.getProductByVariantId(item.productVariantId);
                            if (productResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                                const product = productResponse.result;
                                const variant = product.variants.find((v: { id: number; }) => v.id === item.productVariantId);

                                return {
                                    ...item,
                                    productName: product.name,
                                    productImage: product.imageUrl,
                                    supplierId: product.supplier.id,
                                    supplierName: product.supplier.name,
                                    variantColor: variant?.color || "",
                                    variantSize: variant?.size || "",
                                };
                            }
                        } catch (error) {
                            console.error("Lỗi khi lấy sản phẩm:", error);
                        }
                        return item;
                    })
                );
                return updatedItems;
            } catch (error) {
                console.error("Lỗi khi cập nhật orderItems:", error);
                return orderItems;
            }
        };

        const fetchOrders = async () => {
            try {
                const orderResponse = await orderService.getAllOrderByProfileId(profileId!);
                if (orderResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    const sortedOrders = (orderResponse.result as OrdersResponse[])
                        .map((order: any) => ({
                            ...order,
                            orderDate: new Date(order.orderDate)
                        }))
                        .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());

                    const updatedOrders = await Promise.all(
                        sortedOrders.map(async (order) => {
                            const updatedItems = await fetchOrderDetails(order.orderItems);
                            return { ...order, orderItems: updatedItems };
                        })
                    );
                    setOrders(updatedOrders);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra khi lấy danh sách đơn hàng: ${error instanceof Error ? error.message : String(error)}`);
            }
        };
        fetchOrders();
    }, [])

    return (
        <>
            <div style={{width: "960px"}}>
                {/* Nav bar */}
                <div style={{
                    display: "flex",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    marginBottom: "0.75rem",
                    width: "100%",
                    alignItems: "center",
                    borderBottom: "2px solid rgba(0, 0, 0, .09)",
                }}>
                    <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        borderBottom: "2px solid rgba(0, 0, 0, .09)",
                        borderColor: "#ee4d2d",
                        lineHeight: "19px",
                        padding: "1rem 0",
                        transition: "color .2s",
                        color: "#ee4d2d"
                    }}>
                        Tất cả
                    </div>
                    <div style={styleFilterOrder}>Chờ thanh toán</div>
                    <div style={styleFilterOrder}>Vận chuyển</div>
                    <div style={styleFilterOrder}>Chờ giao hàng</div>
                    <div style={styleFilterOrder}>Hoàn thành</div>
                    <div style={styleFilterOrder}>Đã hủy</div>
                    <div style={styleFilterOrder}>Trả hàng/Hoàn tiền</div>
                </div>

                {/* Search */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EAEAEA"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "10px" }} width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    <input style={{
                        width: "100%",
                        padding: "0.625rem",
                        backgroundColor: "#EAEAEA",
                        border: "0",
                        outline: "0",
                        fontSize: "0.75rem",
                    }}
                        placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc tên sản phẩm"
                    />
                </div>

                {/* Orders */}
                {
                    orders ?
                        <>
                            <div>
                                {orders.map((order) => (
                                    <div key={order.id}>
                                        <CardOrderProfile
                                            orderId={order.id}
                                            profileId={order.profileId}
                                            orderDate={order.orderDate}
                                            statusOrder={order.statusOrder}
                                            totalPrice={order.totalPrice}
                                            orderItems={order.orderItems}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                        :
                        <>
                            <div>Loading</div>
                        </>
                }
            </div>
        </>
    )
}

export default ProfileOrderPage;