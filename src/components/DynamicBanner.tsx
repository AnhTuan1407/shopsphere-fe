import { useState, useEffect, useCallback } from 'react';

interface BannerProps {
    // Banner props với mảng cho main banners
    mainBanners?: string[];
    sideBanner1Url?: string;
    sideBanner2Url?: string;
    autoplaySpeed?: number;
}

export default function DynamicBanner({
    mainBanners = [
        "/assets/banners/banner-1.jpg",
        "/assets/banners/banner-4.jpg",
        "/assets/banners/banner-5.jpg",
        "/assets/banners/banner-6.jpg",
    ],
    sideBanner1Url = "/assets/banners/banner-2.jpg",
    sideBanner2Url = "/assets/banners/banner-3.png",
    autoplaySpeed = 3000
}: BannerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const bannerCount = mainBanners.length;

    // Hàm chuyển đổi banner
    const goToSlide = useCallback((index: number) => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setActiveIndex(index);
            setTimeout(() => setIsTransitioning(false), 500); // Đồng bộ với thời gian transition
        }
    }, [isTransitioning]);

    // Hàm chuyển đến banner tiếp theo
    const nextSlide = useCallback(() => {
        goToSlide((activeIndex + 1) % bannerCount);
    }, [activeIndex, bannerCount, goToSlide]);

    // Hàm chuyển đến banner trước đó
    const prevSlide = useCallback(() => {
        goToSlide((activeIndex - 1 + bannerCount) % bannerCount);
    }, [activeIndex, bannerCount, goToSlide]);

    // Tự động chuyển đổi banner
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, autoplaySpeed);

        return () => clearInterval(interval);
    }, [nextSlide, autoplaySpeed]);

    // CSS cho các animations
    const keyframes = `
    @keyframes shine {
      from { left: -100%; }
      to { left: 200%; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

    // Titles for each banner
    const bannerTitles = [
        "Featured Collection",
        "Spring Sale",
        "New Season"
    ];

    return (
        <>
            <style>{keyframes}</style>
            <div style={{
                backgroundColor: "#fff",
                width: "100%",
                paddingTop: "10px",
                paddingBottom: "10px",
            }}>
                <div style={{
                    width: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "235px",
                    position: "relative",
                }}>
                    {/* Main Banner Carousel */}
                    <div style={{
                        flex: "2",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                    }}>
                        {/* Banner Images */}
                        {mainBanners.map((banner, index) => (
                            <div
                                key={index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: index === activeIndex ? 1 : 0,
                                    transition: "opacity 0.5s ease-in-out",
                                    zIndex: index === activeIndex ? 1 : 0,
                                    animation: index === activeIndex ? "fadeIn 0.5s ease-in-out" : "none",
                                }}
                            >
                                <img
                                    src={banner}
                                    alt={`Banner ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                />

                                {/* Shine effect */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "-100%",
                                        width: "50px",
                                        height: "100%",
                                        background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                                        transform: "skewX(-25deg)",
                                        animation: "shine 3s infinite",
                                    }} />
                                </div>

                                {/* Text overlay */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                        color: "white",
                                        padding: "10px",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "1";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "0";
                                    }}
                                >
                                    <h3 style={{
                                        fontWeight: "bold",
                                        margin: 0,
                                        fontSize: "16px",
                                    }}>{bannerTitles[index] || `Banner ${index + 1}`}</h3>
                                </div>
                            </div>
                        ))}

                        {/* Navigation arrows */}
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "10px",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            userSelect: "none",
                        }} onClick={prevSlide}>
                            &#10094;
                        </div>

                        <div style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            userSelect: "none",
                        }} onClick={nextSlide}>
                            &#10095;
                        </div>

                        {/* Indicator dots */}
                        <div style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "8px",
                            zIndex: 2,
                        }}>
                            {mainBanners.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        backgroundColor: activeIndex === index ? "white" : "rgba(255,255,255,0.5)",
                                        cursor: "pointer",
                                        animation: activeIndex === index ? "pulse 2s infinite" : "none",
                                        transition: "background-color 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Side Banners */}
                    <div style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        marginLeft: "5px",
                    }}>
                        {/* Side Banner 1 */}
                        <div style={{
                            width: "100%",
                            height: "calc(50% - 3px)",
                            overflow: "hidden",
                            position: "relative",
                            marginBottom: "6px",
                        }}>
                            <img
                                src={sideBanner1Url}
                                alt="Side Banner 1"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            />

                            {/* Shine effect for side banner 1 */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "-100%",
                                    width: "50px",
                                    height: "100%",
                                    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                                    transform: "skewX(-25deg)",
                                    animation: "shine 3s infinite 1s", // delay 1s
                                }} />
                            </div>

                            {/* Text overlay for side banner 1 */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                    color: "white",
                                    padding: "10px",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0";
                                }}
                            >
                                <h3 style={{
                                    fontWeight: "bold",
                                    margin: 0,
                                    fontSize: "16px",
                                }}>New Arrivals</h3>
                            </div>
                        </div>

                        {/* Side Banner 2 */}
                        <div style={{
                            width: "100%",
                            height: "calc(50% - 3px)",
                            overflow: "hidden",
                            position: "relative",
                        }}>
                            <img
                                src={sideBanner2Url}
                                alt="Side Banner 2"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            />

                            {/* Shine effect for side banner 2 */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "-100%",
                                    width: "50px",
                                    height: "100%",
                                    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                                    transform: "skewX(-25deg)",
                                    animation: "shine 3s infinite 2s", // delay 2s
                                }} />
                            </div>

                            {/* Text overlay for side banner 2 */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                    color: "white",
                                    padding: "10px",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0";
                                }}
                            >
                                <h3 style={{
                                    fontWeight: "bold",
                                    margin: 0,
                                    fontSize: "16px",
                                }}>Special Offer</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}