import FlashSale from "../models/flashSale.model";
import FlashSaleCard from "./FlashSaleCard";
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
