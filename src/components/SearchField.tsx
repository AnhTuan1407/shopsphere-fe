
type Props = {
    width?: string,
    height?: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void
}

const SearchField = ({
    width,
    height,
    placeholder,
    value,
    onChange
}: Props) => {
    return (
        <>
            <form style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "2px",
                backgroundColor: "#fff",
                height,
                width,
                padding: "0.1875rem",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
            }}>
                <input
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
                <button style={{
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
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
            </form>
        </>
    )
}

export default SearchField;