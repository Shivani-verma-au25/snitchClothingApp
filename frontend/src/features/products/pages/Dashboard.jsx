import React, { useEffect } from 'react'
import { useProducts } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Plus, Tag, Clock } from 'lucide-react'

const Dashboard = () => {
    const { handleGetSellerProduct } = useProducts()
    
    // The Redux store might save the entire API response object (e.g. { data: [...] }). 
    // This normalizes it so `sellerProducts` is always a solid array.
    const rawProducts = useSelector(state => state.product?.sellerProducts);
    const sellerProducts = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);
    
    const productLoading = useSelector(state => state.product?.productLoading);

    useEffect(() => {
        handleGetSellerProduct()
    }, [])

    console.log("seller products array:", sellerProducts);
    

    return (
        <div className="min-h-screen bg-[#131317] text-[#e4e1e7] font-['Inter'] px-6 py-16 md:px-16 lg:px-32 selection:bg-[#c9b8ff]/30 selection:text-[#e3d8ff]">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <p className="text-[#cac4d1] text-xs md:text-sm uppercase tracking-[0.2em] mb-4">Seller Portal</p>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#e4e1e7]">
                        The Archive.
                    </h1>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out">
                    <Link 
                        to="/seller/add-product" 
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-[#e3d8ff] to-[#c9b8ff] text-[#342662] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(201,184,255,0.15)] filter hover:brightness-105"
                    >
                        <span className="relative z-10 text-xs md:text-sm font-semibold uppercase tracking-widest">New Product</span>
                        <Plus className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover:rotate-90" />
                    </Link>
                </div>
            </div>

            {/* Products List */}
            {productLoading ? (
                <div className="flex justify-center items-center py-32 animate-in fade-in duration-500">
                    <div className="w-12 h-12 border-t-2 border-[#c9b8ff] rounded-full animate-spin"></div>
                </div>
            ) : sellerProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#1b1b1f]/50 backdrop-blur-sm rounded-[2rem] border border-[#353439]/30 animate-in fade-in zoom-in-95 duration-700">
                    <p className="text-[#cac4d1] font-light text-lg mb-6">No pieces curated yet.</p>
                    <Link to="/seller/add-product" className="text-[#c9b8ff] text-sm uppercase tracking-widest hover:text-[#e3d8ff] transition-colors pb-1 border-b border-[#c9b8ff]/30 hover:border-[#e3d8ff]">
                        Start your collection
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-16 md:gap-32">
                    {sellerProducts.map((product, idx) => (
                        <div 
                            key={product._id} 
                            className={`group flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-20 items-center p-4 md:p-8 rounded-[2.5rem] hover:bg-[#1b1b1f] transition-colors duration-700 ease-out animate-in fade-in slide-in-from-bottom-12`}
                            style={{ animationFillMode: 'both', animationDelay: `${idx * 150 + 300}ms` }}
                        >
                            {/* Product Image */}
                            <div className="w-full md:w-1/3 aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#0e0e12] relative shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={product.images[0].url} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-[1.03] group-hover:grayscale-0"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#48454f]">
                                        <Tag className="w-8 h-8 mb-4 opacity-40" />
                                        <span className="text-[10px] uppercase tracking-widest">No Visual</span>
                                    </div>
                                )}
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#131317]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            {/* Product Details */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[10px] text-[#938f9a] uppercase tracking-[0.2em] font-mono">
                                        ID: {product._id.slice(-6)}
                                    </span>
                                    <div className="h-[1px] w-12 bg-[#353439]"></div>
                                    <span className="flex items-center gap-1.5 text-[10px] text-[#cac4d1] uppercase tracking-[0.2em]">
                                        <Clock className="w-3 h-3" />
                                        {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <h3 className="text-3xl md:text-5xl font-light tracking-wide text-[#e4e1e7] mb-6 capitalize leading-tight group-hover:text-[#e3d8ff] transition-colors duration-500">
                                    {product.title}
                                </h3>
                                
                                <p className="text-[#cac4d1] text-sm md:text-base leading-relaxed font-light mb-10 line-clamp-3">
                                    {product.description}
                                </p>
                                
                                <div className="mt-auto flex items-end justify-between pt-6 border-t border-[#353439]/50">
                                    <div>
                                        <p className="text-[9px] text-[#938f9a] uppercase tracking-widest mb-1.5 opacity-80">Valuation</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-medium text-[#c9b8ff] opacity-80">
                                                {product.price?.currency === 'INR' ? '₹' : product.price?.currency}
                                            </span>
                                            <span className="text-4xl tracking-tighter text-[#e3d8ff]">
                                                {product.price?.amount}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button className="px-6 py-2.5 rounded-full border border-[#48454f] text-[#cac4d1] text-[10px] uppercase tracking-widest transition-all duration-300 hover:border-[#c9b8ff]/60 hover:text-[#c9b8ff] hover:bg-[#c9b8ff]/5 hover:shadow-[0_0_20px_rgba(201,184,255,0.05)]">
                                        Modify
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard