import React from "react";
import FlashSaleCard from "./FlashSaleCard";
import FlashSale from "../models/flashSale.mode";
type Props = {
    flashSales: FlashSale[]
}
const FlashSaleList = ({ flashSales }: Props) => {
    return (
        <>
            <div style={{ display: "grid", gap: "1.5rem" }}>
                {flashSales.map((sale) => (
                    <FlashSaleCard key={sale.id} sale={sale} />
                ))}
            </div>
        </>
    );
};

export default FlashSaleList;
