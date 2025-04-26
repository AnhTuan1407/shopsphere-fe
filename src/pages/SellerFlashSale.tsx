import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlashSaleList from "../components/FlashSaleList";
import FlashSale from "../models/flashSale.model";
import Product from "../models/product.model";
import Supplier from "../models/supplier.model";
import productService from "../services/product.service";
import saleService from "../services/sale.service";
import supplierService from "../services/supplier.service";

const SellerFlashSale = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
    const [loading, setLoading] = useState(true); // loading toàn bộ

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    toast.error("Không tìm thấy userId trong localStorage");
                    return;
                }

                const supplierRes = await supplierService.getSupplierByUserId(userId);
                if (supplierRes.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    const supplier = supplierRes.result as Supplier;
                    setSupplierId(supplier.id);

                    const productsRes = await productService.getAllProducts();
                    const supplierProducts = productsRes.filter(
                        (product) => product.supplier?.id === supplier.id
                    );
                    setProducts(supplierProducts);

                    // Lấy flash sale sau khi đã có supplierId
                    const flashSaleRes = await saleService.getAllFlashSalesBySupplierId(supplier.id);
                    if (flashSaleRes.code === 1000) {
                        setFlashSales(flashSaleRes.result as FlashSale[]);
                    } else {
                        toast.error(flashSaleRes.message);
                    }
                } else {
                    toast.error("Không tìm thấy supplier tương ứng");
                }
            } catch (err) {
                toast.error("Lỗi khi tải dữ liệu");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleProduct = (product: Product) => {
        const exists = selectedProducts.find(p => p.id === product.id);
        if (exists) {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts(prev => [...prev, {
                ...product,
                discountType: 'PERCENTAGE',
                discountValue: 0,
                totalQuantity: 1,
                maxPerUser: 1
            }]);
        }
    };

    const handleChange = (id: number, field: string, value: any) => {
        setSelectedProducts(prev =>
            prev.map(p => p.id === id ? { ...p, [field]: value } : p)
        );
    };

    const handleSubmit = async () => {
        if (!name || !startDate || !endDate || selectedProducts.length === 0) {
            toast.error("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 sản phẩm");
            return;
        }

        const request = {
            name,
            description,
            startTime: startDate,
            endTime: endDate,
            flashSaleItems: selectedProducts.map(p => ({
                productId: Number(p.id),
                discountType: p.discountType,
                discountValue: p.discountValue,
                totalQuantity: p.totalQuantity,
                maxPerUser: p.maxPerUser,
            })),
            supplierId: supplierId
        };

        try {
            const response = await saleService.createFlashSale(request);
            if (response.code === 1000) {
                toast.success("Tạo Flash Sale thành công!");
                setShowPopup(false);
                setSelectedProducts([]);
                setName("");
                setDescription("");
                setStartDate("");
                setEndDate("");

                const updated = await saleService.getAllFlashSalesBySupplierId(supplierId!);
                if (updated.code === 1000) {
                    setFlashSales(updated.result as FlashSale[]);
                }
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            toast.error("Lỗi khi tạo Flash Sale");
            console.error(err);
        }
    };

    const truncate = (text: string, max = 20) =>
        text.length > max ? `${text.slice(0, max)}...` : text;

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Chương trình Flash Sale</h2>
            <button
                onClick={() => setShowPopup(true)}
                style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ee4d2d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "1.5rem"
                }}
            >
                + Thêm Flash Sale
            </button>

            {/* Loading hoặc Hiển thị danh sách */}
            {loading ? (
                <p>Đang tải danh sách Flash Sale...</p>
            ) : flashSales.length === 0 ? (
                <p style={{ fontStyle: "italic", color: "#777" }}>Chưa có chương trình giảm giá nào</p>
            ) : (
                <FlashSaleList flashSales={flashSales} />
            )}

            {/* Form tạo Flash Sale */}
            {showPopup && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 10
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "2rem",
                        width: "900px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 0 15px rgba(0,0,0,0.2)"
                    }}>
                        <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>Tạo chương trình Flash Sale</h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                            <input
                                placeholder="Tên chương trình"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                            <input
                                placeholder="Mô tả chương trình"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                            <input type="datetime-local"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                            <input type="datetime-local"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }} />
                        </div>

                        <h4 style={{ margin: "1rem 0" }}>Chọn sản phẩm áp dụng</h4>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "1rem"
                        }}>
                            {products.map(product => {
                                const isSelected = selectedProducts.some(p => p.id === product.id);
                                const selected = selectedProducts.find(p => p.id === product.id);
                                return (
                                    <div key={product.id} style={{
                                        border: isSelected ? "2px solid #10B981" : "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "0.5rem",
                                        maxWidth: "200px"
                                    }}>
                                        <label style={{ display: "block", marginBottom: "0.5rem" }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleProduct(product)}
                                                style={{ marginRight: "0.5rem" }}
                                            />
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                style={{ width: "100%", height: "100px", objectFit: "contain", borderRadius: "6px" }}
                                            />
                                            <div style={{ marginTop: "0.5rem", fontWeight: "500" }}>
                                                {truncate(product.name!)}
                                            </div>
                                        </label>

                                        {isSelected && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                <label>
                                                    Loại giảm giá:
                                                    <select
                                                        value={selected?.discountType}
                                                        onChange={e => handleChange(product.id!, "discountType", e.target.value)}
                                                        style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                                                    >
                                                        <option value="PERCENTAGE">% phần trăm</option>
                                                        <option value="AMOUNT">Giảm số tiền</option>
                                                    </select>
                                                </label>

                                                <label>
                                                    Giá trị giảm:
                                                    <input
                                                        type="number"
                                                        value={selected?.discountValue}
                                                        onChange={e => handleChange(product.id!, "discountValue", Number(e.target.value))}
                                                        min={0}
                                                        style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", width: "94.5%" }}
                                                    />
                                                </label>

                                                <label>
                                                    Tổng số lượng:
                                                    <input
                                                        type="number"
                                                        value={selected?.totalQuantity}
                                                        onChange={e => handleChange(product.id!, "totalQuantity", Number(e.target.value))}
                                                        min={1}
                                                        style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", width: "94.5%" }}
                                                    />
                                                </label>

                                                <label>
                                                    Tối đa mỗi người:
                                                    <input
                                                        type="number"
                                                        value={selected?.maxPerUser}
                                                        onChange={e => handleChange(product.id!, "maxPerUser", Number(e.target.value))}
                                                        min={1}
                                                        style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", width: "94.5%" }}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                            <button
                                onClick={handleSubmit}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#10B981", color: "white", borderRadius: "6px", border: "none" }}
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#ccc", borderRadius: "6px", border: "none" }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerFlashSale;
