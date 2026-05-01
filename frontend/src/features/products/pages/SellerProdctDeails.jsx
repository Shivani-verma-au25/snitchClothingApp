import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProduct';
import toast from 'react-hot-toast';

const ImageUploadGrid = ({ images, onChange }) => {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const newImages = files.map(f => ({
            file: f,
            url: URL.createObjectURL(f),
            _id: Math.random().toString()
        }));
        onChange([...images, ...newImages].slice(0, 8));
    };

    const removeImage = (id) => {
        onChange(images.filter(img => img._id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#7d766c] font-bold">Variant Media</label>
                <span className="text-[10px] text-[#7d766c] tracking-widest">{images.length}/8</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {images.map(img => (
                    <div key={img._id} className="relative aspect-[4/5] bg-[#f4f3f0] group overflow-hidden border border-[#cec5b9]/20">
                        <img src={img.url} alt="upload" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <button 
                            type="button" 
                            onClick={() => removeImage(img._id)} 
                            className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    </div>
                ))}
                {images.length < 8 && (
                    <label className="aspect-[4/5] bg-[#f4f3f0] cursor-pointer flex flex-col items-center justify-center text-[#7d766c] hover:bg-[#efeeeb] transition-all duration-500 border border-dashed border-[#cec5b9]/50 group">
                        <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">add_a_photo</span>
                        <span className="text-[8px] uppercase tracking-widest">Add Slot</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                )}
            </div>
        </div>
    );
};

const SellerProductDetails = () => {
    const { productId } = useParams();
    const { handleGetproductDetail, handleCreateVariant,
    //  handleUpdateVariantStock 
     } = useProducts();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // New Variant State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVariant, setNewVariant] = useState({
        priceAmount: '',
        priceCurrency: 'INR',
        stocks: 0,
        attributes: { Size: '', Color: '' },
        images: []
    });

    const fetchProductDetails = async () => {
        setLoading(true);
        const responseData = await handleGetproductDetail(productId);
        const data = responseData?.data || responseData;
        setProduct(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    
    // const handleAddVariant = async () => {
    //     if (!newVariant.priceAmount || !newVariant.stocks) {
    //         toast.error('Please fill required fields');
    //         return;
    //     }
    //     try {
    //         // According to user request: priceAmount and priceCurrency are flat at top level.
    //         // Converting images to URLs as currently implemented in typical Snitch workflow, 
    //         // but including the files/data in the request.
    //         const res = await handleCreateVariant(productId, {
    //             priceAmount: parseFloat(newVariant.priceAmount),
    //             priceCurrency: newVariant.priceCurrency,
    //             stocks: parseInt(newVariant.stocks),
    //             attributes: newVariant.attributes,
    //             images: newVariant.images.map(img => img.url) // In a real scenario, these would be uploaded first or sent as FormData
    //         });

    //         if (res?.success) {
    //             toast.success('Variant added');
    //             setShowAddForm(false);
    //             setNewVariant({
    //                 priceAmount: '',
    //                 priceCurrency: 'INR',
    //                 stocks: 0,
    //                 attributes: { Size: '', Color: '' },
    //                 images: []
    //             });
    //             fetchProductDetails();
    //         } else {
    //             toast.error(res?.message || 'Failed to add variant');
    //         }
    //     } catch (error) {
    //         toast.error('Error adding variant');
    //     }
    // };

const handleAddVariant = async () => {
    if (!newVariant.priceAmount || !newVariant.stocks) {
        toast.error('Please fill required fields');
        return;
    }

    try {
        const data = new FormData();

        data.append("priceAmount", newVariant.priceAmount);
        data.append("priceCurrency", newVariant.priceCurrency);
        data.append("stocks", newVariant.stocks);

        // attributes (convert object → string)
        data.append("attributes", JSON.stringify(newVariant.attributes));

        // 🔥 SEND FILES (NOT URLS)
        newVariant.images.forEach((img) => {
            data.append("images", img.file);
        });

        const res = await handleCreateVariant(productId, data);

        if (res?.success) {
            toast.success('Variant added');
            setShowAddForm(false);

            setNewVariant({
                priceAmount: '',
                priceCurrency: 'INR',
                stocks: 0,
                attributes: { Size: '', Color: '' },
                images: []
            });

            fetchProductDetails();
        } else {
            toast.error(res?.message || 'Failed to add variant');
        }
    } catch (error) {
        console.log(error);
        toast.error('Error adding variant');
    }
};



    const handleAttributeChange = (key, value) => {
        setNewVariant(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value }
        }));
    };

    const handleImagesChange = (images) => {
        setNewVariant(prev => ({ ...prev, images }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] font-light animate-pulse text-[#5f5e5e]">Accessing Archive...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] font-light text-[#5f5e5e]">Product not found in archive.</span>
            </div>
        );
    }

    console.log("variants" ,newVariant);
    

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-['Inter'] selection:bg-[#f2e1c0] selection:text-[#695d43]">
            {/* Minimalist Navigation */}
            <nav className="sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-xl border-b border-[#e3e2df] px-8 md:px-16 py-6 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-3 group transition-all duration-500">
                    <span className="material-symbols-outlined text-[20px] text-[#5f5e5e] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#7d766c] group-hover:text-[#1a1c1a]">Return</span>
                </button>
                <div className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#1a1c1a]">Archive Inventory</div>
                <div className="w-20 lg:w-32" />
            </nav>

            <main className="max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-24">
                {/* Hero Header Segment */}
                <header className="mb-24 space-y-8">
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#695d43] font-semibold">SKU ROOT: {product._id?.slice(-8).toUpperCase()}</span>
                        <h1 className="text-4xl md:text-7xl font-light uppercase tracking-[0.15em] leading-tight text-[#1a1c1a]">
                            {product.title}
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-[#cec5b9]/20 pt-8 mt-12">
                        <p className="max-w-xl text-lg font-light leading-relaxed text-[#5f5e5e] opacity-80 italic">
                            "{product.description}"
                        </p>
                        <div className="text-right">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7d766c] block mb-2">Base Valuation</span>
                            <p className="text-3xl font-light tracking-widest text-[#1a1c1a]">
                                {product.price?.amount} <span className="text-sm uppercase font-semibold text-[#695d43]">{product.price?.currency}</span>
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left Column: Active Variants */}
                    <section className="lg:col-span-12 space-y-12">
                        <div className="flex items-center justify-between border-b border-[#1a1c1a]/10 pb-6">
                            <h2 className="text-[12px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">Active Variants</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    // onClick={() => navigate(`/seller/product/${productId}/add-variant`)}
                                    onClick={() => navigate(`/${productId}/add-variant`)}
                                    className="px-6 py-3 border border-[#695d43] text-[#695d43] text-[10px] uppercase tracking-[0.2em] hover:bg-[#695d43] hover:text-white transition-all duration-500 rounded-none"
                                >
                                    + Full Form
                                </button>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="px-6 py-3 bg-[#5f5e5e] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a1c1a] transition-all duration-500 rounded-none shadow-sm"
                                >
                                    {showAddForm ? 'Cancel Entry' : '+ Quick Add'}
                                </button>
                            </div>
                        </div>

                        {/* Add Variant Form Overlay/Segment */}
                        {showAddForm && (
                            <div className="bg-[#f4f3f0] p-10 space-y-10 border border-[#cec5b9]/30 fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Left: Input Fields */}
                                    <div className="space-y-10">
                                        <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#695d43] font-bold">New Archive Entry Formulation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-[#7d766c]">Size</label>
                                                <input 
                                                    placeholder="L, XL..." 
                                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                                                    value={newVariant.attributes.Size}
                                                    onChange={(e) => handleAttributeChange('Size', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-[#7d766c]">Color</label>
                                                <input 
                                                    placeholder="Sand, Noir..." 
                                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                                                    value={newVariant.attributes.Color}
                                                    onChange={(e) => handleAttributeChange('Color', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-[#7d766c]">Stock Level</label>
                                                <input 
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                                                    value={newVariant.stocks || ''}
                                                    onChange={(e) => setNewVariant({...newVariant, stocks: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-[#7d766c]">Variant Price (INR)</label>
                                                <input 
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                                                    value={newVariant.priceAmount || ''}
                                                    onChange={(e) => setNewVariant({...newVariant, priceAmount: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Image Upload */}
                                    <div className="border-l border-[#cec5b9]/20 pl-16">
                                        <ImageUploadGrid images={newVariant.images} onChange={handleImagesChange} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-[#cec5b9]/20">
                                    <button 
                                        onClick={handleAddVariant}
                                        className="px-12 py-4 bg-[#1a1c1a] text-[#ffffff] text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-[#5f5e5e] transition-all duration-700"
                                    >
                                        Commit to Archive
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                            {product.variants?.length > 0 ? product.variants.map((variant, idx) => (
                                <div key={variant._id || idx} className="group space-y-6">
                                    {/* Variant Media Shell */}
                                    <div className="aspect-[4/5] bg-[#f4f3f0] relative overflow-hidden transition-all duration-700 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                                        {variant.images?.[0] ? (
                                            <img src={variant.images[0].url || variant.images[0]} alt="variant" className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center grayscale opacity-30">
                                                <span className="material-symbols-outlined text-[40px]">inventory_2</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-md px-3 py-1">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-[#1a1c1a]">ENTRY #{idx + 1}</span>
                                        </div>
                                    </div>

                                    {/* Variant Specs Segment */}
                                    <div className="space-y-6 px-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    {Object.entries(variant.attributes || {}).map(([key, val], i) => (
                                                        <span key={i} className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1c1a]">
                                                            {key}: {val} {i < Object.entries(variant.attributes).length - 1 && <span className="mx-2 opacity-30">|</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] uppercase tracking-[0.15em] text-[#7d766c] block">Current Allocation</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-light tracking-widest text-[#695d43]">
                                                    ₹{variant.price?.amount || variant.priceAmount || product.price.amount}
                                                </p>
                                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#7d766c]">Valuation</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[#cec5b9]/20 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="number"
                                                    defaultValue={variant.stocks}
                                                    onBlur={(e) => handleStockUpdate(variant._id, parseInt(e.target.value))}
                                                    className="w-16 bg-transparent border-b border-[#cec5b9] py-1 text-center text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                                                />
                                                <span className="text-[9px] uppercase tracking-[0.1em] text-[#7d766c]">Units in Archive</span>
                                            </div>
                                            <span className={`h-2 w-2 ${variant.stocks > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`} />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-[#cec5b9]/30 space-y-6">
                                    <span className="material-symbols-outlined text-[40px] text-[#cec5b9]">collections_bookmark</span>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#7d766c]">The archive for variants is empty.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in {
                    animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}} />
        </div>
    );
};

export default SellerProductDetails;
