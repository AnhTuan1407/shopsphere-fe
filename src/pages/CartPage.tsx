import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonField from "../components/ButtonField";
import CartItem from "../components/CartItem";
import Cart from "../models/cart.model";
import cartService from "../services/cart.service";
import productService from "../services/product.service";

const groupCartItemsBySupplier = (cartItems: Array<any>) => {
    return cartItems.reduce((grouped: Record<string, Array<any>>, item) => {
        const supplierName = item.supplierName || "Unknown Supplier";
        if (!grouped[supplierName]) {
            grouped[supplierName] = [];
        }
        grouped[supplierName].push(item);
        return grouped;
    }, {});
};

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart>({
        cartItems: [],
        cartItemsMapper: [],
        totalPrice: 0,
    });

    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const storedProfileId = localStorage.getItem("profileId");

        const fetchData = async () => {
            try {
                if (!storedProfileId) {
                    toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
                    navigate("/auth/sign-in");
                    return;
                }

                const [cartResponse, productResponse, supplierResponse] = await Promise.all([
                    cartService.getCartByProfileId(storedProfileId),
                    productService.getAllProducts(),
                    productService.getAllSuppliers(),
                ]);

                const cartData: Cart = cartResponse.result || { cartItems: [], cartItemsMapper: [], totalPrice: 0 };
                setCart(cartResponse.result!);

                const productsData = productResponse;
                const suppliersData = supplierResponse;

                const mappedCartItems = (cartData.cartItems ?? []).map((cartItem) => {
                    const product = productsData.find((p) => p.id === cartItem.productId) || {};
                    const variant = product.variants?.find((v) => v.id === cartItem.productVariantId) || {};
                    const supplier = suppliersData.find((s) => s.id === cartItem.supplierId) || {};

                    return {
                        ...cartItem,
                        productName: product.name || "",
                        productImage: product.imageUrl || "",
                        categoryName: product.category?.name || "",
                        variantColor: variant.color || "",
                        variantSize: variant.size || "",
                        variantPrice: variant.price || 0,
                        supplierName: supplier.name || "Unknown Supplier",
                        supplierImage: supplier.imageUrl || "",
                        quantity: cartItem.quantity || 1,
                    };
                });

                if (mappedCartItems) {
                    setCart((prevCart) => ({
                        ...prevCart,
                        cartItemsMapper: mappedCartItems,
                    }));

                    const initialTotalPrice = mappedCartItems
                        .filter((item) => item.selected)
                        .reduce((total, item) => total + item.quantity * item.variantPrice, 0);
                    setTotalPrice(initialTotalPrice);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        fetchData();

        setTotalPrice(cart.totalPrice || 0);
    }, [navigate]);

    // Nhóm sản phẩm theo supplier
    const groupedCartItems = groupCartItemsBySupplier(cart.cartItemsMapper!);

    const handleSelectItem = async (id: number, isSelected: boolean) => {
        try {
            await cartService.selectCartItem(id);

            setCart((prevCart) => {
                const updatedCartItems = (prevCart.cartItemsMapper ?? []).map((item) => {
                    if (item.id === id) {
                        return { ...item, selected: isSelected };
                    }
                    return item;
                });

                const updatedTotalPrice = updatedCartItems
                    .filter((item) => item.selected)
                    .reduce((total, item) => total + item.quantity * item.variantPrice, 0);

                setTotalPrice(updatedTotalPrice);

                return {
                    ...prevCart,
                    cartItemsMapper: updatedCartItems,
                };
            });
        } catch (error) {
            toast.error(`Có lỗi xảy ra:  ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleDeleteItem = async (id: number) => {
        const response = await cartService.deleteCartItem(id);
        if (response) {
            setCart((prevCart) => {
                const updatedCartItems = (prevCart.cartItemsMapper ?? []).filter((item) => item.id !== id);
                const updatedTotalPrice = updatedCartItems
                    .filter((item) => item.selected)
                    .reduce((total, item) => total + item.quantity * item.variantPrice, 0);
                setTotalPrice(updatedTotalPrice);

                return {
                    ...prevCart,
                    cartItemsMapper: updatedCartItems,
                };
            });
        }
        else {
            toast.error("Xóa sản phẩm thất bại!");
        }
    };

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        try {
            await cartService.updateCartItem(itemId, newQuantity);

            setCart((prevCart) => {
                const updatedCartItems = (prevCart.cartItemsMapper ?? []).map((item) => {
                    if (item.id === itemId) {
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                });

                const updatedTotalPrice = updatedCartItems
                    .filter((item) => item.selected)
                    .reduce((total, item) => total + item.quantity * item.variantPrice, 0);
                setTotalPrice(updatedTotalPrice);

                return {
                    ...prevCart,
                    cartItemsMapper: updatedCartItems,
                };
            });
        } catch (error) {
            console.error("Lỗi cập nhật giỏ hàng:", error);
            toast.error("Cập nhật số lượng thất bại!");
        }
    };

    const handleOrder = async () => {
        const selectedItems = cart.cartItemsMapper?.filter((item) => item.selected);
        if (selectedItems?.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để mua.");
            return;
        }

        navigate("/order", { state: { selectedItems } });
    }

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
                {Object.entries(groupedCartItems).map(([supplierName, items]) => (
                    <div key={supplierName} style={{ marginBottom: "20px" }}>
                        {/* Supplier Header */}
                        <div
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#f5f5f5",
                                fontWeight: "bold",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            {supplierName}
                        </div>

                        {/* Products */}
                        {items.map((cartItem) => (
                            <CartItem
                                key={cartItem.id}
                                id={cartItem.id}
                                productName={cartItem.productName}
                                productImage={cartItem.productImage}
                                categoryName={cartItem.categoryName}
                                variantColor={cartItem.variantColor}
                                variantSize={cartItem.variantSize}
                                variantPrice={cartItem.variantPrice}
                                quantity={cartItem.quantity}
                                selected={cartItem.selected}
                                onUpdateQuantity={handleUpdateQuantity}
                                onSelectItem={(isSelected) => handleSelectItem(isSelected, cartItem.id)}
                                onDeleteItem={handleDeleteItem}
                            />
                        ))}
                    </div>
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
                        ₫{totalPrice.toLocaleString("vi-VN")}
                    </span>
                </div>
                <ButtonField onClick={handleOrder}>Mua hàng</ButtonField>
            </div>
        </div>
    );
};

export default CartPage;
