import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonField from "../components/ButtonField";
import CartItem from "../components/CartItem";
import Cart from "../models/cart.model";
import cartService from "../services/cart.service";
import productService from "../services/product.service";

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart>({
        cartItems: [],
        cartItemsMapper: [],
        totalPrice: 0
    });
    const [profileId, setProfileId] = useState<string | null>(null);

    useEffect(() => {
        const storedProfileId = localStorage.getItem("profileId");
        setProfileId(storedProfileId);

        const fetchData = async () => {
            try {
                if (!storedProfileId) {
                    toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
                    navigate("/sign-in");
                    return;
                }

                const [cartResponse, productResponse] = await Promise.all([
                    cartService.getCartByProfileId(storedProfileId),
                    productService.getAllProducts(),
                ]);

                const cartData: Cart = cartResponse.result || { cartItems: [], cartItemsMapper: [], totalPrice: 0 };
                setCart(cartResponse.result!);

                const productsData = productResponse;

                const mappedCartItems = (cartData.cartItems ?? []).map((cartItem) => {
                    const product = productsData.find((p) => p.id === cartItem.productId) || {};
                    const variant = product.variants?.find((v) => v.id === cartItem.productVariantId) || {};

                    return {
                        ...cartItem,
                        productName: product.name || "",
                        productImage: product.imageUrl || "",
                        categoryName: product.category?.name || "",
                        variantColor: variant.color || "",
                        variantSize: variant.size || "",
                        variantPrice: variant.price || 0,
                    };
                });

                if (mappedCartItems) {
                    setCart(prevCart => ({
                        ...prevCart,
                        cartItemsMapper: mappedCartItems,
                    }));
                }

            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div style={{ minWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    padding: "0 20px",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                    color: "#888",
                    fontSize: "0.875rem",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", flexBasis: "48%" }}>
                    <input type="checkbox" />
                    <div style={{ marginLeft: "5px", fontWeight: "500" }}>Sản phẩm</div>
                </div>
                <div style={{ padding: "12px 20px", flexBasis: "15%", textAlign: "center", fontWeight: "500" }}>Đơn giá</div>
                <div style={{ padding: "12px 20px", flexBasis: "15%", textAlign: "center", fontWeight: "500" }}>Số lượng</div>
                <div style={{ padding: "12px 20px", flexBasis: "10%", textAlign: "center", fontWeight: "500" }}>Thành tiền</div>
                <div style={{ padding: "12px 20px", flexBasis: "12%", textAlign: "center", fontWeight: "500" }}>Thao tác</div>
            </div>

            {/* Cart Items */}
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                    marginBottom: "10px",
                }}
            >
                {cart.cartItemsMapper?.map((cartItem) => (
                    <CartItem
                        key={cartItem.id}
                        productName={cartItem.productName}
                        productImage={cartItem.productImage}
                        categoryName={cartItem.categoryName}
                        variantColor={cartItem.variantColor}
                        variantSize={cartItem.variantSize}
                        variantPrice={cartItem.variantPrice}
                        quantity={cartItem.quantity}
                        selected={cartItem.selected}
                    />
                ))}
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" />
                    <div style={{ marginLeft: "10px", color: "#888" }}>Chọn tất cả</div>
                </div>
                <div style={{ color: "#888", fontSize: "0.875rem" }}>
                    Tổng tiền:{" "}
                    <span style={{ color: "#ee4d2d", fontWeight: "bold", fontSize: "1rem" }}>
                        ₫{cart.totalPrice?.toLocaleString("vi-VN")}
                    </span>
                </div>
                <ButtonField>Mua hàng</ButtonField>
            </div>
        </div>
    );
};

export default CartPage;
