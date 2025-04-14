import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import productService from "../services/product.service";
import reviewService from "../services/review.service";
import uploadService from "../services/upload.service";

type Props = {
    productVariantId: number,
    profileId: string,
    handleClosePopup: () => void
};

const ReviewForm = ({
    productVariantId,
    profileId,
    handleClosePopup
}: Props) => {
    const [rating, setRating] = useState<number>(0);
    const [quality, setQuality] = useState<string>("");
    const [trueToDescription, setTrueToDescription] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [images, setImages] = useState<Array<{ imageUrl: string }>>([]);
    const [product, setProduct] = useState<any>();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productService.getProductByVariantId(productVariantId);
                if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setProduct(response.result);
                }
                else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error(`${error instanceof Error ? error.message : error}`);
            }
        }

        fetchProduct();
    }, [])

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);

            try {
                const uploadedImages = await Promise.all(
                    uploadedFiles.map(async (file, index) => {
                        const imageUrl = await uploadService.toBase64(file);
                        return { imageUrl };
                    })
                );
                setImages((prevImages) => [...prevImages, ...uploadedImages]);
            } catch (error) {
                console.error("Error converting images to Base64:", error);
                toast.error("Có lỗi khi upload ảnh");
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const uploadedUrls: string[] = [];

        try {
            for (const image of images) {
                const response = await uploadService.uploadToCloudinary(image.imageUrl);
                uploadedUrls.push(response);
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Có lỗi khi upload ảnh");
            return;
        }

        const productId = product.id;

        const reviewData = {
            productVariantId,
            productId,
            profileId,
            rating,
            quality,
            trueToDescription,
            comment,
            imageUrls: uploadedUrls.map((url) => ({ imageUrl: url })),
        };

        try {
            const response = await reviewService.createReview(reviewData);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Gửi đánh giá thành công");
                handleClosePopup();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(`${error instanceof Error ? error.message : error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", color: "#333" }}>Đánh giá sản phẩm</h2>

            {/* Rating */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Đánh giá:</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill={rating >= star ? "#ee4d2d" : "#ccc"}
                            className="bi bi-star-fill"
                            viewBox="0 0 16 16"
                            onClick={() => setRating(star)}
                            style={{ cursor: "pointer" }}
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    ))}
                </div>
            </div>

            {/* Quality */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Chất lượng sản phẩm:</label>
                <input
                    type="text"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    placeholder="Nhập chất lượng sản phẩm"
                />
            </div>

            {/* True to Description */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Đúng với mô tả:</label>
                <input
                    type="text"
                    value={trueToDescription}
                    onChange={(e) => setTrueToDescription(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    placeholder="Nhập mức độ đúng với mô tả"
                />
            </div>

            {/* Comment */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Bình luận:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "100px" }}
                    placeholder="Nhập bình luận của bạn"
                />
            </div>

            {/* Images */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Hình ảnh:</label>
                <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "block", marginBottom: "0.5rem" }}
                />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {images.map((image) => (
                        <img
                            src={image.imageUrl}
                            alt={`review-img`}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "#ee4d2d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >
                Gửi đánh giá
            </button>
        </form>
    );
};

export default ReviewForm;