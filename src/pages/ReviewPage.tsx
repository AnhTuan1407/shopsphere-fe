import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardReview from "../components/CardReview";
import Review from "../models/review.model";
import reviewService from "../services/review.service";

const styleBtnFilterReview: React.CSSProperties = {
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "0.125rem",
    boxSizing: "border-box",
    cursor: "pointer",
    height: "2rem",
    lineHeight: "2rem",
    margin: "0.3125rem 0.5rem 0.3125rem 0",
    padding: "0 0.625rem",
    textAlign: "center",
    border: "1px solid rgba(0, 0, 0, .09)",
    minWidth: "6.25rem",
    fontSize: "0.875rem"
};

const noReviewStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#555",
    fontSize: "1rem",
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "0.25rem",
};

type Props = {
    productId: number;
};

const ReviewPage = ({ productId }: Props) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    });
    const [averageRating, setAverageRating] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [activeRating, setActiveRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await reviewService.getAllReviewsByProductId(productId);

                if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    const fetchedReviews = response.result as Review[];
                    setReviews(fetchedReviews);
                    setAllReviews(fetchedReviews);

                    let totalReview = 0;
                    fetchedReviews.forEach(review => {
                        totalReview += review.rating;
                    });
                    setAverageRating(totalReview / fetchedReviews.length);

                    const counts = fetchedReviews.reduce((acc, review) => {
                        acc[review.rating as 1 | 2 | 3 | 4 | 5] = (acc[review.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;
                        return acc;
                    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

                    setRatingCounts(counts);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra khi lấy đánh giá");
                console.log("Lỗi khi lấy đánh giá: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [productId]);

    const filterReview = async (rating: number) => {
        setActiveRating(rating);
        try {
            const response = await reviewService.filterReviewByRating(rating);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                const fetchedReviews = response.result as Review[];
                setReviews(fetchedReviews);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lấy đánh giá");
            console.log("Lỗi khi lấy đánh giá: ", error);
        } finally {
            setLoading(false);
        }
    };

    const showAllReviews = () => {
        setActiveRating(null);
        setReviews(allReviews);
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <div className="spinner" style={{ display: "inline-block", width: "50px", height: "50px", border: "5px solid rgba(0, 0, 0, 0.1)", borderTop: "5px solid #333", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                    marginTop: "1rem",
                    padding: "1.5rem"
                }}
            >
                <div
                    style={{
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        fontWeight: "500",
                        color: "#333",
                        marginBottom: "0.875rem"
                    }}
                >
                    đánh giá sản phẩm
                </div>

                {/* Rating */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#fffbf8",
                        border: "1px solid #f9ede5",
                        borderRadius: "0.125rem",
                        boxSizing: "border-box",
                        marginBottom: "1rem",
                        padding: "1.875rem"
                    }}
                >
                    <div
                        style={{
                            marginRight: "1.875rem",
                            textAlign: "center"
                        }}
                    >
                        <div style={{ color: "#ee4d2d", textAlign: "center" }}>
                            <span style={{ fontSize: "1.875rem" }}>{averageRating || 0}</span>
                            <span style={{ fontSize: "1rem", marginLeft: "0.25rem" }}>trên 5</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="#ee4d2d"
                                    className="bi bi-star-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flex: "1",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        <div
                            style={{
                                ...styleBtnFilterReview,
                                border: activeRating === null ? "2px solid #ee4d2d" : "1px solid rgba(0, 0, 0, .09)"
                            }}
                            onClick={showAllReviews}
                        >
                            Tất cả
                        </div>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                                key={rating}
                                style={{
                                    ...styleBtnFilterReview,
                                    border: activeRating === rating ? "2px solid #ee4d2d" : "1px solid rgba(0, 0, 0, .09)"
                                }}
                                onClick={() => filterReview(rating)}
                            >
                                {rating} sao<span> ({ratingCounts[rating]})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hiển thị thông báo nếu không có review */}
                {reviews.length === 0 ? (
                    <div style={noReviewStyle}>Sản phẩm chưa có đánh giá</div>
                ) : (
                    reviews.map((review) => (
                        <CardReview
                            key={review.id}
                            id={review.id}
                            product={review.product}
                            productVariant={review.productVariant}
                            profile={review.profile}
                            rating={review.rating}
                            quality={review.quality}
                            createdAt={review.createdAt}
                            supplierReply={review.supplierReply}
                            trueToDescription={review.trueToDescription}
                            comment={review.comment}
                            images={review.images}
                        />
                    ))
                )}
            </div>
        </>
    );
};

export default ReviewPage;