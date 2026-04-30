import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProduct';

const ProductDetail = () => {
    const { productId } = useParams();
    const { handleGetproductDetail } = useProducts();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const fetchProductDetails = async () => {
        const responseData = await handleGetproductDetail(productId);
        // Sometimes APIs wrap the product in a `data` key, handle both cases
        setProduct(responseData?.data || responseData);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <p className="text-on-surface font-headline tracking-widest uppercase text-lg animate-pulse opacity-70">Loading Details...</p>
            </div>
        );
    }

    return (
        <div className="font-body selection:bg-secondary-container min-h-screen bg-background pb-32">
            {/* Top Navigation Anchor */}
            <nav className="fixed top-0 w-full z-50 rounded-none bg-[#faf9f6]/95 backdrop-blur-lg flex justify-between items-center px-8 py-5 h-20 transition-all duration-500 border-b border-outline-variant/10">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined text-[#5f5e5e] group-hover:-translate-x-1 transition-transform duration-300">arrow_back</span>
                    <span className="font-inter uppercase tracking-[0.2em] text-[11px] leading-tight text-[#6b6b6b] hidden sm:inline group-hover:text-primary transition-colors">Back</span>
                </div>
                <div className="font-inter uppercase tracking-[0.3em] text-sm font-bold text-[#5f5e5e]">SNITCH</div>
                <div className="flex items-center gap-4 cursor-pointer group">
                    <span className="material-symbols-outlined text-[#5f5e5e] group-hover:scale-110 transition-transform duration-300">shopping_bag</span>
                </div>
            </nav>

            <main className="pt-20 lg:pt-28 fade-in flex items-center flex-col w-full">
                {/* Hero Product Gallery Section */}
                <section className="relative w-full bg-surface-container-low max-w-6xl mx-auto rounded-none lg:rounded-3xl shadow-sm pb-6">
                    <div className="relative aspect-[3/4] sm:aspect-[16/9] lg:aspect-[21/9] w-full group overflow-hidden lg:rounded-t-3xl">
                        {product.images && product.images.length > 0 ? (
                            <img 
                                className="w-full h-full object-cover grayscale-[10%] contrast-[105%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                                alt={product.title} 
                                src={product.images[selectedImageIndex]?.url || product.images[selectedImageIndex]} 
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                                <span className="text-outline-variant font-headline tracking-widest text-sm">IMAGE UNAVAILABLE</span>
                            </div>
                        )}
                    </div>
                    {/* Small Thumbnails Row */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto px-6 pt-6 pb-2 hide-scrollbar snap-x">
                            {product.images.map((img, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-none w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center ${index === selectedImageIndex ? 'border-primary shadow-md grayscale-0 scale-105' : 'border-transparent grayscale-[40%] hover:grayscale-0 opacity-60 hover:opacity-100'}`}
                                >
                                    <img 
                                        className="w-full h-full object-cover" 
                                        alt={`${product.title} thumbnail ${index}`} 
                                        src={img?.url || img} 
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Product Details Canvas */}
                <section className="px-6 sm:px-12 mt-12 sm:mt-20 space-y-20 max-w-4xl mx-auto w-full">
                    {/* Title and Price Row */}
                    <div className="space-y-6 flex flex-col md:flex-row md:justify-between md:items-end">
                        <div className="flex flex-col gap-3">
                            <span className="font-inter uppercase tracking-[0.2em] text-[10px] text-secondary font-semibold">Limited Release</span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.2em] leading-tight text-primary slide-up">{product.title}</h1>
                        </div>
                        <p className="text-2xl sm:text-3xl font-medium tracking-widest text-on-surface-variant md:pb-2">
                            {product.price?.amount || 0} {product.price?.currency || 'INR'}
                        </p>
                    </div>



                    {/* Description: Breathing Room & Layered Layout */}
                    <div className="space-y-8 bg-surface-container-low px-8 sm:px-12 py-16 sm:py-20 rounded-3xl -mx-4 sm:mx-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-outline-variant/10 hover:shadow-lg transition-shadow duration-700 fade-in group">
                        <div className="max-w-xl">
                            <span className="font-inter uppercase tracking-[0.2em] text-[11px] text-secondary font-bold block mb-8 opacity-80">The Narrative</span>
                            <p className="text-on-surface leading-loose text-lg sm:text-xl tracking-wide font-light">
                                {product.description || "No description provided."}
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            {/* Sticky Bottom Bar: Fixed Interaction Zone */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-surface/90 backdrop-blur-xl border border-outline-variant/20 rounded-full z-50 p-2 sm:p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex gap-3 transition-transform duration-500 hover:-translate-y-1">
                <button className="flex-1 h-12 sm:h-14 rounded-full bg-secondary-container text-on-secondary-container font-inter uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-bold hover:bg-secondary hover:text-white transition-colors duration-500 flex items-center justify-center gap-2 group">
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">add_shopping_cart</span>
                    <span className="hidden sm:inline">Add to Bag</span>
                </button>
                <button className="flex-[1.5] h-12 sm:h-14 rounded-full bg-primary text-on-primary font-inter uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-bold hover:bg-inverse-surface hover:shadow-lg transition-all duration-500 overflow-hidden relative group">
                    <span className="relative z-10">Buy Now</span>
                    <div className="absolute inset-0 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                </button>
                <button className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-outline-variant/40 flex justify-center items-center hover:bg-error-container hover:border-error-container hover:text-error transition-all duration-300 text-outline group">
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-125 transition-transform duration-300">favorite</span>
                </button>
            </div>

            <style>{`
                @keyframes slide-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .slide-up {
                    animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .slide-up-delayed {
                    opacity: 0;
                    animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                }
                .fade-in {
                    animation: fade-in 1.2s ease-out forwards;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;