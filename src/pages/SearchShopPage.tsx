import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import supplierService from "../services/supplier.service";
import Supplier from "../models/supplier.model";
import CardShop from "../components/CardShop";

const SearchShopPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        if (keyword.trim() !== '') {
            fetchSuppliers();
        }
    }, [keyword]);

    const fetchSuppliers = async () => {
        try {
            const response = await supplierService.searchSupplierByName(keyword);
            if (response.code === 1000) {
                setSuppliers(response.result as Supplier[]);
            }
        } catch (err) {
            console.error('Search error:', err);
        }
    };
    
    return (
        <>
            <div style={{
                width: "1200px",
                margin: "0 auto",
            }}>
                <div style={{
                    fontSize: "1rem",
                    marginTop: "1rem",
                    marginBottom: "1.5rem",
                    color: "#555555",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <div style={{
                        paddingRight: "0.25rem"
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightbulb" viewBox="0 0 16 16">
                            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
                        </svg>
                    </div>
                    Shop liên quan đến "<span style={{ color: "#ee4d2d" }}>{keyword}</span>"
                </div>

                {/* Danh sách shop */}
                {suppliers.map((supplier) => (
                    <CardShop
                        key={supplier.id}
                        supplier={supplier}
                    />
                ))}
            </div>
        </>
    )
}

export default SearchShopPage;