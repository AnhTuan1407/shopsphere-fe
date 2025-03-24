import Category from "../models/category.model";

type Props = Category;

const CardCategory = ({
    id,
    name,
    description,
    image_url
}: Props) => {
    return (
        <>
            <div
                style={{
                    border: "1px solid rgba(0, 0, 0, .05)",
                    cursor: "pointer",
                    width: "110px",
                    textAlign: "center",
                    padding: "5px",
                    transition: "border - color 0.3s ease-in -out",
                }}

                onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid #888")}
                onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(0, 0, 0, .05)")}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={image_url} alt="danh-muc" style={{ width: "110px", height: "100px" }} />
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2
                    }}
                >
                    {name}
                </div>
            </div >

        </>
    )
}

export default CardCategory;