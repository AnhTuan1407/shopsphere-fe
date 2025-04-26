import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import FlashSale from "../models/flashSale.model";
import FlashSaleProductCard from "./FlashSaleProductCard";

dayjs.extend(duration);

type Props = {
    sale: FlashSale
}

const FlashSaleCard = ({ sale }: Props) => {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = dayjs();
            const end = dayjs(sale.endTime);
            const diff = end.diff(now);

            if (diff <= 0) {
                setCountdown("Đã kết thúc");
                clearInterval(interval);
                return;
            }

            const d = dayjs.duration(diff);
            setCountdown(`${d.hours()}h ${d.minutes()}m ${d.seconds()}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [sale.endTime]);

    // Lấy item đầu tiên làm đại diện
    const mainItem = sale.flashSaleItems[0];
    const discountLabel = mainItem.discountType === "PERCENTAGE"
        ? `Giảm ${mainItem.discountValue}%`
        : `Giảm ${mainItem.discountValue.toLocaleString()}₫`;

    return (
        <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "1rem",
            border: "1px solid #f59e0b"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ea580c" }}>
                    {sale.name} – {discountLabel}
                </h2>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Kết thúc sau: <span style={{ color: "#ef4444" }}>{countdown}</span>
                </span>
            </div>

            <p style={{ fontSize: "0.875rem", color: "#4b5563", marginBottom: "0.75rem" }}>
                {sale.description}
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1rem"
            }}>
                {sale.flashSaleItems.map((item) => (
                    <FlashSaleProductCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FlashSaleCard;
