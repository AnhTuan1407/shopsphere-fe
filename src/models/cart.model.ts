import CartItem from "./cartItem.model";

type Cart = {
    id?: number,
    profileId?: string,
    totalPrice?: number,
    cartItems?: Array<CartItem>,
    cartItemsMapper?: Array<any>,
}

export default Cart;
