import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useProducts } from '../hooks/useProduct'
import { useSelector } from 'react-redux'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY']

const initialForm = {
  title: '',
  description: '',
  priceAmount: '',
  priceCurrency: 'USD',
  images: [],
}

const FormField = ({ label, id, children }) => (
  <div className="flex flex-col space-y-3">
    <label htmlFor={id} className="text-xs tracking-[0.25em] uppercase text-[#7d766c]">
      {label}
    </label>
    {children}
  </div>
)

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
        <label className="text-xs tracking-[0.25em] uppercase text-[#7d766c]">Product Media</label>
        <span className="text-xs text-[#7d766c] tracking-widest">{images.length}/8</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map(img => (
          <div key={img._id} className="relative aspect-[4/5] bg-[#f4f3f0] group overflow-hidden">
            <img src={img.url} alt="upload" type='file' multiple className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <button type="button" onClick={() => removeImage(img._id)} className="absolute top-4 right-4 bg-[#1a1c1a]/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
        {images.length < 8 && (
          <label className="aspect-[4/5] bg-[#f4f3f0] cursor-pointer flex flex-col items-center justify-center text-[#7d766c] hover:bg-[#efeeeb] transition-colors border border-dashed border-[#cec5b9]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3"><path d="M12 5v14m-7-7h14"/></svg>
            <span className="text-[10px] uppercase tracking-widest">Add Media</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};

export default function AddProduct() {
  const { handleCreateProduct } = useProducts()
  const navigate = useNavigate()
  
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleImages = useCallback((images) => {
    setForm(prev => ({ ...prev, images }))
  }, [])

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!')
    console.log('Saving draft…', form)
  }

  const handlePublish = async () => {
    
     // VALIDATION
    if (form.images.length === 0) {
      toast.error("Please upload at least one image before publishing");
      return;
    }

    try {
      setSubmitting(true)
      const res = await handleCreateProduct(form)
      
      if (res?.success) {
        toast.success(res.message || 'Product published successfully!')
        navigate('/seller/dashboard') 
      } else {
        toast.error(res?.message || 'Failed to publish product')
      }
    } catch (error) {
       toast.error('An error occurred during publishing')
       console.error("Publish error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen font-['Inter']" style={{ backgroundColor: '#faf9f6' }}>
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e3e2df] px-8 md:px-16 py-5 flex items-center justify-between">
        <button onClick={() => navigate('/seller/dashboard')} className="flex items-center gap-3 text-[#695d43] hover:text-[#1a1c1a] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          <span className="text-xs font-medium tracking-[0.1em] uppercase">Back Archive</span>
        </button>
        <div className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#7d766c]">Snitch Creator</div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-8 md:px-16 pt-24 pb-40">
        {/* Hero heading */}
        <header className="mb-20">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: '#7d766c' }}
          >
            Products / Add New
          </p>
          <h1
            className="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-8"
            style={{ color: '#1a1c1a' }}
          >
            Add Product
          </h1>
          <div
            className="h-px w-24"
            style={{ backgroundColor: '#695d43' }}
          />
        </header>

        {/* Two-column form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* Left — product info */}
          <div className="lg:col-span-3 space-y-16">
            {/* Title */}
            <FormField label="Title" id="product-title">
              <input
                id="product-title"
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g. Oversized Linen Blazer"
                className="w-full bg-transparent text-xl font-light pb-4 border-b transition-colors duration-300 focus:outline-none placeholder:text-[#cec5b9]"
                style={{
                  color: '#1a1c1a',
                  borderColor: '#cec5b9',
                }}
                onFocus={e => e.target.style.borderColor = '#695d43'}
                onBlur={e => e.target.style.borderColor = '#cec5b9'}
              />
            </FormField>

            {/* Description */}
            <FormField label="Description" id="product-description">
              <textarea
                id="product-description"
                rows={4}
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe materials, fit, and feel…"
                className="w-full bg-transparent text-base font-light pb-4 border-b transition-colors duration-300 resize-none leading-8 focus:outline-none placeholder:text-[#cec5b9]"
                style={{
                  color: '#1a1c1a',
                  borderColor: '#cec5b9',
                }}
                onFocus={e => e.target.style.borderColor = '#695d43'}
                onBlur={e => e.target.style.borderColor = '#cec5b9'}
              />
            </FormField>

            {/* Price row */}
            <div className="grid grid-cols-2 gap-12">
              {/* Price Amount */}
              <FormField label="Price Amount" id="price-amount">
                <input
                  id="price-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.priceAmount}
                  onChange={e => handleChange('priceAmount', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-xl font-light pb-4 border-b transition-colors duration-300 focus:outline-none placeholder:text-[#cec5b9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{
                    color: '#1a1c1a',
                    borderColor: '#cec5b9',
                  }}
                  onFocus={e => e.target.style.borderColor = '#695d43'}
                  onBlur={e => e.target.style.borderColor = '#cec5b9'}
                />
              </FormField>

              {/* Currency */}
              <FormField label="Currency" id="price-currency">
                <div className="relative">
                  <select
                    id="price-currency"
                    value={form.priceCurrency}
                    onChange={e => handleChange('priceCurrency', e.target.value)}
                    className="w-full bg-transparent text-xl font-light pb-4 border-b transition-colors duration-300 focus:outline-none appearance-none cursor-pointer pr-6"
                    style={{
                      color: '#1a1c1a',
                      borderColor: '#cec5b9',
                    }}
                    onFocus={e => e.target.style.borderColor = '#695d43'}
                    onBlur={e => e.target.style.borderColor = '#cec5b9'}
                  >
                    {CURRENCIES.map(c => (
                      <option
                        key={c}
                        value={c}
                        style={{ backgroundColor: '#faf9f6', color: '#1a1c1a' }}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                  {/* chevron icon */}
                  <svg
                    className="absolute right-0 bottom-5 pointer-events-none"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M2 5L7 10L12 5" stroke="#7d766c" strokeWidth="1.5" />
                  </svg>
                </div>
              </FormField>
            </div>
          </div>

          {/* Right — image upload */}
          <div className="lg:col-span-2">
            <ImageUploadGrid images={form.images} onChange={handleImages} />
          </div>
        </div>
      </main>

      {/* Floating bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#faf9f6]/95 backdrop-blur-md border-t border-[#e3e2df] px-8 py-5 flex justify-end gap-6 z-40">
        <button 
          onClick={handleSaveDraft} 
          disabled={submitting}
          type="button" 
          className="px-8 py-4 bg-[#f2e1c0] text-[#695d43] text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#e6d5b4]"
        >
          Save Draft
        </button>
        <button 
          onClick={handlePublish} 
          disabled={submitting || !form.title.trim() || !form.priceAmount} 
          type="button" 
          className="px-10 py-4 bg-[#5f5e5e] text-[#ffffff] text-xs font-medium uppercase tracking-[0.2em] transition-all disabled:opacity-50 hover:bg-[#1a1c1a]"
        >
          {submitting ? 'Publishing...' : 'Publish Item'}
        </button>
      </div>
    </div>
  )
}
