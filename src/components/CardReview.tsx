import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from "../assets/loppy.jpg";
import Product from "../models/product.model";
import ProductVariants from "../models/productVariants.model";
import Profile from "../models/profile.model";
import ReviewImage from "../models/reviewImage.model";
import reviewService from "../services/review.service";
import profileService from "../services/profile.service";

type Props = {
    id: number;
    product: Product;
    productVariant: ProductVariants;
    profile: Profile;
    rating: number;
    quality: string;
    createdAt: Date;
    supplierReply: string;
    trueToDescription: string;
    comment: string;
    images: Array<ReviewImage>;
};

const CardReview = ({
    id,
    profile,
    productVariant,
    rating,
    createdAt,
    trueToDescription,
    quality,
    comment,
    images,
}: Props) => {
    const [likeCount, setLikeCount] = useState<number>();
    const [isLike, setIsLike] = useState<boolean>();
    const [profileId, setProfileId] = useState<string | null>(null); // Lưu profileId từ localStorage
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook để chuyển hướng

    useEffect(() => {
        // Lấy profileId từ localStorage khi trang được tải
        const storedProfileId = localStorage.getItem("profileId");
        if (storedProfileId) {
            setProfileId(storedProfileId);
        }

        const fetchLikeCount = async (id: number) => {
            try {
                const response = await reviewService.getLikeCountReview(id);
                if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setLikeCount(typeof response.result === "number" ? response.result : 0);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : ""}`);
            }
        };

        const fetchIsLike = async () => {
            try {
                if (storedProfileId) {
                    const response = await reviewService.isLike(id, storedProfileId);
                    if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                        setIsLike(typeof response.result === "boolean" ? response.result : false);
                    } else {
                        toast.error(response.message);
                    }
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : ""}`);
            }
        };

        const fetchUsername = async () => {
            try {
                if (storedProfileId) {
                    const response = await profileService.getUserById(profile.userId!) as { code: number; result: { username: string }; message: string };
                    if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                        setUsername(response.result.username);
                    } else {
                        toast.error(response.message);
                    }
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : ""}`);
            }
        };

        fetchLikeCount(id);
        fetchIsLike();
        fetchUsername();
    }, [id]);

    const handleLikeReview = async (id: number, profileId: string | null) => {
        if (!profileId) {
            toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
            navigate("/sign-in");
            return;
        }

        try {
            const response = await reviewService.likeReview(id, profileId);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                const fetchedLike = typeof response.result === "number" ? response.result : 0;
                setLikeCount(fetchedLike);
                setIsLike((prev) => !prev);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thích đánh giá");
            console.log("Lỗi khi lấy đánh giá: ", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                padding: "1rem 0 1rem 1.25rem",
                alignItems: "flex-start",
                borderBottom: "1px solid rgba(0, 0, 0, .09)",
            }}
        >
            {/* Avatar */}
            <div style={{ height: "2.5rem", width: "2.5rem" }}>
                <img
                    src={avatar}
                    alt="avatar"
                    style={{
                        borderRadius: "50%",
                        width: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>

            <div style={{ marginLeft: "1rem", flex: 1 }}>
                {/* Username */}
                <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                    {username}
                </div>

                {/* Rating */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.25rem",
                    }}
                >
                    {[...Array(rating)].map((_, index) => (
                        <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            fill="#ee4d2d"
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    ))}
                </div>

                {/* Date */}
                <div
                    style={{
                        color: "rgba(0, 0, 0, .54)",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                    }}
                >
                    {new Date(createdAt).toLocaleDateString()} | Phân loại hàng: {productVariant.color ? productVariant.color : productVariant.size}
                </div>

                {/* True to description */}
                <div style={{ marginTop: "0.5rem" }}>
                    <div
                        style={{
                            color: "rgba(0, 0, 0, 0.4)",
                            fontSize: "0.75rem",
                        }}
                    >
                        Đúng với mô tả:
                        <span
                            style={{
                                color: "#333",
                                fontSize: "0.875rem",
                                marginLeft: "0.25rem",
                            }}
                        >
                            {trueToDescription}
                        </span>
                    </div>
                </div>

                {/* Quality */}
                <div style={{ marginTop: "0.25rem" }}>
                    <div
                        style={{
                            color: "rgba(0, 0, 0, 0.4)",
                            fontSize: "0.75rem",
                        }}
                    >
                        Chất lượng sản phẩm:
                        <span
                            style={{
                                color: "#333",
                                fontSize: "0.875rem",
                                marginLeft: "0.25rem",
                            }}
                        >
                            {quality}
                        </span>
                    </div>
                </div>

                {/* Comment */}
                <div style={{ marginTop: "0.25rem", color: "#333" }}>
                    {comment}
                </div>

                {/* Images */}
                {images.length > 0 && (
                    <div
                        style={{
                            marginTop: "0.5rem",
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                        }}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.imageUrl}
                                alt={`review-img-${index}`}
                                style={{
                                    width: "4rem",
                                    height: "4rem",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Likes */}
                <div
                    style={{
                        marginTop: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                    onClick={() => handleLikeReview(id, profileId)}
                >
                    {!isLike ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#555"
                            className="bi bi-heart"
                            viewBox="0 0 16 16"
                        >
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#555"
                            className="bi bi-heart-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                            />
                        </svg>
                    )}
                    <span
                        style={{
                            fontSize: "0.75rem",
                            color: "#555",
                            marginLeft: "0.25rem",
                        }}
                    >
                        {likeCount}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CardReview;