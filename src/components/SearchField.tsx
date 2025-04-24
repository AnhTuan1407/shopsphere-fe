import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    width?: string,
    height?: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    onSearch?: () => void
}

const SearchField = ({
    width,
    height,
    placeholder,
    value,
    onChange,
    onSearch
}: Props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        onSearch && onSearch();
    };

    const handleSearchShop = () => {
        setShowDropdown(false);
        navigate(`/search-shop?keyword=${encodeURIComponent(value || '')}`);
    };

    // Ẩn dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hiển thị dropdown khi có giá trị tìm kiếm
    useEffect(() => {
        if (value && value.trim() !== '') {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [value]);

    return (
        <div style={{ position: 'relative', width }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "2px",
                    backgroundColor: "#fff",
                    height,
                    width: '100%',
                    padding: "0.1875rem",
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                }}
            >
                <input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={value}
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "0.5rem",
                        fontSize: "14px",
                    }}
                    onChange={(e) => onChange && onChange(e.target.value)}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#ee4d2d",
                        color: "#fff",
                        border: "none",
                        padding: "0 1rem",
                        cursor: "pointer",
                        fontSize: "14px",
                        height: "100%",
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
            </form>

            {/* Dropdown menu */}
            {showDropdown && value && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        borderRadius: '2px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                        zIndex: 10,
                        maxHeight: '250px',
                        overflow: 'auto',
                    }}
                >
                    <div
                        style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f5f5f5',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#555555',
                            transition: 'background-color 0.2s ease',
                            backgroundColor: '#fff',
                        }}
                        onClick={handleSubmit}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#555555" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        <span>Tìm <span style={{ color: '#ee4d2d', fontWeight: "500" }}>{value}</span></span>
                    </div>
                    <div
                        style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#555555',
                            transition: 'background-color 0.2s ease',
                            backgroundColor: '#fff',
                        }}
                        onClick={handleSearchShop}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ee4d2d" viewBox="0 0 16 16">
                            <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
                        </svg>
                        <span>Tìm kiếm shop theo tên "<span style={{ color: '#ee4d2d', fontWeight: "500" }}>{value}</span>"</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchField;