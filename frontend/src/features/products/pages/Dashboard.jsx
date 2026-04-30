import React, { useEffect } from 'react'
import { useProducts } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { Plus, Tag, Clock } from 'lucide-react'

const Dashboard = () => {
    const { handleGetSellerProduct } = useProducts();
    const navigate = useNavigate()
    
    // Normalizing the products to ensure it's always an array
    const sellerProducts = useSelector(state => state.product?.sellerProducts || []);
    
    const productLoading = useSelector(state => state.product?.productLoading);

    useEffect(() => {
        handleGetSellerProduct()
    }, [])


    
    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-['Inter'] px-6 py-20 md:px-16 lg:px-32">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8 border-b border-[#f4f3f0] pb-12">
                <div>
                    <p className="text-[#6b6b6b] text-[11px] uppercase tracking-[0.2em] mb-4">Seller Portal</p>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-[0.15em] uppercase text-[#1a1c1a]">
                        Dashboard
                    </h1>
                </div>
                <div>
                    <Link 
                        to="/seller/add-product" 
                        className="group inline-flex items-center gap-4 px-8 py-4 bg-[#1a1c1a] text-[#ffffff] transition-colors duration-300 hover:bg-[#5f5e5e] rounded-none"
                    >
                        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">New Product</span>
                        <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    </Link>
                </div>
            </div>

            {/* Products List */}
            {productLoading ? (
                <div className="flex justify-center items-center py-32 transition-opacity duration-300">
                    <div className="w-8 h-8 border-t-2 border-[#5f5e5e] rounded-full animate-spin"></div>
                </div>
            ) : sellerProducts?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#ffffff] shadow-sm transition-all duration-500">
                    <p className="text-[#6b6b6b] font-light text-base mb-6">No pieces curated yet.</p>
                    <Link to="/seller/add-product" className="text-[#1a1c1a] text-[11px] uppercase tracking-[0.1em] hover:text-[#5f5e5e] transition-colors border-b border-[#1a1c1a]/30 pb-1">
                        Start your collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.isArray(sellerProducts) && sellerProducts?.map((product) => (
                        <div 
                            onClick={() => navigate(`/seller/product/${product?._id}`)}
                            key={product?._id} 
                            className="group flex flex-col bg-[#ffffff] transition-colors duration-300 hover:bg-[#f4f3f0] ring-1 ring-[#e3e2df] rounded-none overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="w-full aspect-[4/5] bg-[#efeeeb] relative overflow-hidden rounded-none border-b border-[#e3e2df]">
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={product.images[0].url} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#bcbaba]">
                                        <Tag className="w-8 h-8 mb-4 opacity-40" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#7d766c]">No Visual</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[10px] text-[#6b6b6b] uppercase tracking-[0.25em]">
                                        ID: {product._id.slice(-6)}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b6b] uppercase tracking-[0.2em]">
                                        <Clock className="w-3 h-3 text-[#bcbaba]" />
                                        {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-medium tracking-[0.15em] text-[#1a1c1a] mb-4 uppercase line-clamp-1">
                                    {product.title}
                                </h3>
                                
                                <p className="text-[#4b463d] text-[13px] leading-relaxed font-light mb-10 line-clamp-2">
                                    {product.description}
                                </p>
                                
                                <div className="mt-auto flex flex-col gap-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-medium text-[#695d43]">
                                            {product.price?.currency === 'INR' ? '₹' : product.price?.currency}
                                        </span>
                                        <span className="text-2xl tracking-normal text-[#1a1c1a] font-light">
                                            {product.price?.amount}
                                        </span>
                                    </div>
                                    
                                    <button className="w-full py-4 bg-transparent border border-[#cec5b9] text-[#1a1c1a] text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover:border-[#1a1c1a] hover:bg-[#1a1c1a] hover:text-[#ffffff] rounded-none">
                                        Edit Details
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