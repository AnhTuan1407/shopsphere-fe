import React, { createContext, useContext, useState } from "react";

interface CartContextProps {
    cartItemCount: number;
    setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState<number>(0);

    return (
        <CartContext.Provider value={{ cartItemCount, setCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};