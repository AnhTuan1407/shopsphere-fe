import { useEffect, useState } from "react";

interface BannerProps {
    images: string[];
    autoplayInterval?: number;
    height?: string;
}

const DynamicSingleBanner = ({
    images = ["/assets/banners/banner-1.jpg", "/assets/banners/banner-2.jpg", "/assets/banners/banner-3.png", "/assets/banners/banner-4.jpg"],
    autoplayInterval = 5000,
    height = "300px"
}: BannerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let intervalId: number;

        if (!isHovered && images.length > 1) {
            intervalId = window.setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoplayInterval);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [images.length, autoplayInterval, isHovered]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const bannerContainerStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        backgroundColor: "#fff",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
    };

    const slideStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        transition: "transform 0.5s ease-in-out",
        display: "flex",
        transform: `translateX(-${currentIndex * 100}%)`
    };

    const imageStyle: React.CSSProperties = {
        minWidth: "100%",
        height: "100%",
        objectFit: "cover",
        flexShrink: 0
    };

    const arrowStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: "40px",
        height: "40px",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        fontSize: "20px",
        color: "#333",
        zIndex: 2,
        border: "none",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease"
    };

    const leftArrowStyle: React.CSSProperties = {
        ...arrowStyle,
        left: "10px"
    };

    const rightArrowStyle: React.CSSProperties = {
        ...arrowStyle,
        right: "10px"
    };

    const dotsContainerStyle: React.CSSProperties = {
        position: "absolute",
        bottom: "15px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        zIndex: 2
    };

    const dotStyle: React.CSSProperties = {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
        transition: "all 0.3s ease"
    };

    const activeDotStyle: React.CSSProperties = {
        ...dotStyle,
        backgroundColor: "#fff",
        width: "10px",
        height: "10px"
    };

    return (
        <div
            style={bannerContainerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={slideStyle}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Banner ${index + 1}`}
                        style={imageStyle}
                    />
                ))}
            </div>

            <button style={leftArrowStyle} onClick={goToPrevious}>
                &#10094;
            </button>

            <button style={rightArrowStyle} onClick={goToNext}>
                &#10095;
            </button>

            <div style={dotsContainerStyle}>
                {images.map((_, index) => (
                    <div
                        key={index}
                        style={index === currentIndex ? activeDotStyle : dotStyle}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DynamicSingleBanner;