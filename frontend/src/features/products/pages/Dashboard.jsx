import React, { useEffect } from 'react'
import { useProducts } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Plus, Tag, Clock } from 'lucide-react'

const Dashboard = () => {
    const { handleGetSellerProduct } = useProducts()
    
    // Normalizing the products to ensure it's always an array
    const sellerProducts = useSelector(state => state.product?.sellerProducts || []);
    
    const productLoading = useSelector(state => state.product?.productLoading);
    console.log("seller",sellerProducts);

    useEffect(() => {
        handleGetSellerProduct()
    }, [])


    
    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-['Inter'] px-6 py-20 md:px-16 lg:px-32">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
                <div>
                    <p className="text-[#6b6b6b] text-[11px] uppercase tracking-[0.2em] mb-4">Seller Portal</p>
                    <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] uppercase text-[#1a1c1a]">
                        The Archive.
                    </h1>
                </div>
                <div>
                    <Link 
                        to="/seller/add-product" 
                        className="group inline-flex items-center gap-4 px-8 py-4 bg-[#5f5e5e] text-[#ffffff] transition-all duration-300 hover:bg-[#1a1c1a] shadow-[0_10px_20px_rgba(26,28,26,0.05)] rounded-none"
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
                <div className="flex flex-col gap-24">
                    {sellerProducts && sellerProducts?.map((product, idx) => (
                        <div 
                            key={product._id} 
                            className={`group flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center bg-[#ffffff] p-6 md:p-12 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(26,28,26,0.06)] ring-1 ring-[#f4f3f0]`}
                        >
                            {/* Product Image */}
                            <div className="w-full md:w-5/12 aspect-[4/5] bg-[#f4f3f0] relative overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={product.images[0].url} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#bcbaba]">
                                        <Tag className="w-8 h-8 mb-4 opacity-50" />
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]">No Visual</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="w-full md:w-7/12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[11px] text-[#6b6b6b] uppercase tracking-[0.2em]">
                                        ID: {product._id.slice(-6)}
                                    </span>
                                    <div className="h-[1px] w-8 bg-[#cec5b9]"></div>
                                    <span className="flex items-center gap-1.5 text-[11px] text-[#6b6b6b] uppercase tracking-[0.2em]">
                                        <Clock className="w-3 h-3" />
                                        {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-[#1a1c1a] mb-6 uppercase">
                                    {product.title}
                                </h3>
                                
                                <p className="text-[#4b463d] text-sm leading-8 font-light mb-12 max-w-lg">
                                    {product.description}
                                </p>
                                
                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <p className="text-[11px] text-[#6b6b6b] uppercase tracking-[0.2em] mb-2">Price</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-medium text-[#695d43]">
                                                {product.price?.currency === 'INR' ? '₹' : product.price?.currency}
                                            </span>
                                            <span className="text-3xl tracking-tight text-[#1a1c1a]">
                                                {product.price?.amount}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button className="px-8 py-3 bg-transparent border border-[#cec5b9] text-[#1a1c1a] text-[11px] uppercase tracking-[0.1em] transition-all duration-300 hover:border-[#1a1c1a] hover:bg-[#faf9f6]">
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