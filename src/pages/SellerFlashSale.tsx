import { useState } from "react";

const mockProducts = [
    { id: "1", name: "Áo Hoodie", originalPrice: 200000 },
    { id: "2", name: "Giày Sneaker", originalPrice: 800000 },
    { id: "3", name: "Balo Du Lịch", originalPrice: 300000 },
];

const SellerFlashSale = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleToggleProduct = (product: any) => {
        const exists = selectedProducts.find(p => p.id === product.id);
        if (exists) {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts(prev => [...prev, { ...product, discountType: 'percentage', discountValue: 0, totalQuantity: 0, maxPerUser: 0 }]);
        }
    };

    const handleChange = (id: string, field: string, value: any) => {
        setSelectedProducts(prev =>
            prev.map(p => p.id === id ? { ...p, [field]: value } : p)
        );
    };

    const calculateDiscountPrice = (p: any) => {
        const { originalPrice, discountType, discountValue } = p;
        if (discountType === 'amount') {
            return Math.max(0, originalPrice - discountValue);
        } else {
            return Math.max(0, originalPrice - (originalPrice * discountValue / 100));
        }
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Chương trình Flash Sale</h2>

            {/* Nút tạo mới */}
            <button
                onClick={() => setShowPopup(true)}
                style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ee4d2d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "1.5rem"
                }}
            >
                + Thêm Flash Sale
            </button>

            {/* Popup chọn sản phẩm */}
            {showPopup && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "2rem",
                        width: "800px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        borderRadius: "8px"
                    }}>
                        <h3 style={{ marginBottom: "1rem" }}>Chọn sản phẩm áp dụng Flash Sale</h3>

                        {mockProducts.map(product => (
                            <div key={product.id} style={{ borderBottom: "1px solid #ddd", padding: "1rem 0" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.some(p => p.id === product.id)}
                                        onChange={() => handleToggleProduct(product)}
                                    />
                                    <div>
                                        <div>{product.name}</div>
                                        <div style={{ fontSize: "0.875rem", color: "#666" }}>{product.originalPrice.toLocaleString()}đ</div>
                                    </div>
                                </label>

                                {selectedProducts.some(p => p.id === product.id) && (
                                    <div style={{ marginTop: "0.5rem", paddingLeft: "2rem" }}>
                                        <label>
                                            Loại giảm giá:
                                            <select
                                                value={selectedProducts.find(p => p.id === product.id)?.discountType}
                                                onChange={e => handleChange(product.id, "discountType", e.target.value)}
                                                style={{ marginLeft: "0.5rem" }}
                                            >
                                                <option value="percentage">% phần trăm</option>
                                                <option value="amount">Giảm số tiền</option>
                                            </select>
                                        </label>
                                        <br />
                                        <label>
                                            Giá trị giảm:
                                            <input
                                                type="number"
                                                min="0"
                                                value={selectedProducts.find(p => p.id === product.id)?.discountValue}
                                                onChange={e => handleChange(product.id, "discountValue", Number(e.target.value))}
                                                style={{ marginLeft: "0.5rem", width: "100px" }}
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Số lượng bán ra:
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedProducts.find(p => p.id === product.id)?.totalQuantity}
                                                onChange={e => handleChange(product.id, "totalQuantity", Number(e.target.value))}
                                                style={{ marginLeft: "0.5rem", width: "100px" }}
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Tối đa mỗi người:
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedProducts.find(p => p.id === product.id)?.maxPerUser}
                                                onChange={e => handleChange(product.id, "maxPerUser", Number(e.target.value))}
                                                style={{ marginLeft: "0.5rem", width: "100px" }}
                                            />
                                        </label>
                                        <br />
                                        <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                                            Giá Flash Sale: {calculateDiscountPrice(selectedProducts.find(p => p.id === product.id)).toLocaleString()}đ
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Ngày bắt đầu và kết thúc */}
                        <div style={{ marginTop: "1.5rem" }}>
                            <label>Ngày bắt đầu: <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
                            <br />
                            <label>Ngày kết thúc: <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
                        </div>

                        {/* Hành động */}
                        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button onClick={() => setShowPopup(false)} style={{ padding: "0.5rem 1rem" }}>Hủy</button>
                            <button
                                onClick={() => {
                                    console.log("Flash Sale created:", { startDate, endDate, products: selectedProducts });
                                    setShowPopup(false);
                                }}
                                style={{
                                    padding: "0.5rem 1rem",
                                    backgroundColor: "#10B981",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                Tạo Flash Sale
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerFlashSale;
