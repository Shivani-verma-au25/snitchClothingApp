import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Header = ({ user }) => {

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 h-20 flex items-center justify-between">
        <a href="/" className="text-2xl font-light tracking-tighter text-gray-900 hover:opacity-80 transition-opacity">
          Snitch<span className="font-semibold">.</span>
        </a>
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-3 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col items-start cursor-pointer group">
                <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors capitalize">
                  {user.fullname || 'Welcome back'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                  {user.email || 'Your Profile'}
                </p>
              </div>
            </div>
          ) : (
            <a href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-2xl font-light tracking-tighter text-gray-900">
          Snitch<span className="font-semibold">.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Shop</a>
          <a href="#" className="hover:text-black transition-colors">Collections</a>
          <a href="#" className="hover:text-black transition-colors">About Us</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Snitch Clothing App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url;
  const hoverImageUrl = product.images?.[1]?.url; // Use second image if available for a nice flip effect
  const fallbackImage = "https://via.placeholder.com/400x500?text=No+Image";

  return (
    <div className="group cursor-pointer flex flex-col gap-4 h-full">
      {/* Image Container with engaging animations */}
      <div className="relative overflow-hidden rounded-[1.25rem] bg-gray-50 aspect-[4/5] transition-all duration-500 group-hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] flex-shrink-0">
        
        {/* Main Image */}
        <img 
          src={imageUrl || fallbackImage} 
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${hoverImageUrl ? 'group-hover:opacity-0' : ''}`}
        />
        
        {/* Secondary Image (Fades in on hover if exists) */}
        {hoverImageUrl && (
          <img 
            src={hoverImageUrl} 
            alt={`${product.title} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 scale-105 group-hover:scale-100"
          />
        )}
        
        {/* Elegant Bottom Shadow overlay to pop the quick-add button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* "Quick Add" Frosted Glass Button - Slides up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-y-0">
          <button className="w-full py-3.5 px-4 bg-white/95 backdrop-blur-md text-gray-900 text-sm font-semibold tracking-wider uppercase rounded-xl shadow-2xl transform active:scale-[0.98] transition-all hover:bg-white flex items-center justify-center gap-2">
            <span>Quick Add</span>
            <svg className="w-4 h-4" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sleek Product Info Setup */}
      <div className="flex flex-col gap-1 px-1 mt-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base font-medium text-gray-900 capitalize tracking-tight transition-colors duration-300 group-hover:text-black">
            {product.title}
          </h3>
          <p className="text-[15px] font-semibold text-gray-900 whitespace-nowrap pt-0.5 tracking-tight">
            {product.price?.currency === 'INR' ? '₹' : product.price?.currency}{product.price?.amount}
          </p>
        </div>
        <p className="text-sm text-gray-400 line-clamp-1 font-light tracking-wide">
          {product.description}
        </p>
      </div>
    </div>
  );
};

const Home = () => {
    const productsState = useSelector(state => state.product?.products);
    const user = useSelector(state => state.auth?.user);
    const { handleGetAllProducts } = useProducts();
    const navigate = useNavigate()

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    // Extract products list depending on the data structure
    const productsList = Array.isArray(productsState) 
        ? productsState 
        : productsState?.data || [];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-gray-200 selection:text-black">
            <Header user={user} />

            {/* Main Content Area */}
            <div className="flex-grow pt-20"> 
                {/* Minimalist Hero/Header Section */}
                <section className="relative max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 pt-32 pb-24 flex flex-col items-center text-center overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-10 w-[600px] h-[600px] bg-gradient-to-tr from-gray-100 to-gray-50/50 rounded-full blur-3xl -z-10 opacity-70 animate-[pulse_6s_ease-in-out_infinite]"></div>
                    
                    {/* "New Season" Tag */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium tracking-widest text-gray-500 uppercase mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_forwards]">
                        <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                        New Season Arrivals
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-gray-900 opacity-0 animate-[fadeInUp_1s_ease-out_0.1s_forwards] leading-[1.1] mb-6">
                        Elevate Your <br className="hidden sm:block" /> 
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 animate-[bgPosition_8s_ease_infinite] bg-[length:200%_auto]">Everyday</span>.
                    </h1>
                    
                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards] font-light leading-relaxed mb-12">
                        Step entirely out of the ordinary. Discover our latest collection crafted for the bold, the minimal, and the effortlessly stylish.
                    </p>

                    {/* Call to action button */}
                    <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
                        <button 
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]"
                            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            <span className="relative flex items-center gap-2">
                                Explore Collection
                                <svg className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Products Grid */}
                <main className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-20 pb-20">
                    {productsList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
                            {productsList.map((product, index) => (
                                <div 
                                onClick={() => navigate(`/product/${product?._id}`)}
                                    key={product._id || index}
                                    className="opacity-0 animate-[fadeInUp_1s_ease-out_forwards]"
                                    style={{ animationDelay: `${0.1 * (index % 10) + 0.3}s` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]">
                            {/* Elegant minimalist loader */}
                            <div className="relative w-12 h-12 mb-8">
                                <div className="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-gray-900 rounded-full border-t-transparent animate-[spin_1.5s_linear_infinite]"></div>
                            </div>
                            <p className="text-gray-400 text-lg font-light tracking-wide">Curating the latest arrivals...</p>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
            
            {/* Inline styles for custom keyframes to ensure animations work regardless of tailwind.config */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bgPosition {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}} />
        </div>
    );
};

export default Home;