import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../hooks/useProduct';
import toast from 'react-hot-toast';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

// ─── Image Upload Grid ──────────────────────────────────────────────────────
const ImageUploadGrid = ({ images, onChange }) => {
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const incoming = files.map(f => ({
            _id: Math.random().toString(36).slice(2),
            file: f,
            url: URL.createObjectURL(f),
        }));
        onChange([...images, ...incoming].slice(0, 8));
        // reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeImage = (id) => onChange(images.filter(img => img._id !== id));

    const slots = Array.from({ length: 8 });

    return (
        <div className="space-y-5">
            <div className="flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#7d766c] font-bold">
                    Variant Media
                </span>
                <span
                    className={`text-[10px] tracking-widest font-mono transition-colors ${
                        images.length === 8 ? 'text-[#695d43]' : 'text-[#7d766c]'
                    }`}
                >
                    {images.length} / 8
                </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {slots.map((_, i) => {
                    const img = images[i];
                    return img ? (
                        /* Filled slot */
                        <div
                            key={img._id}
                            className="relative aspect-[4/5] bg-[#edece9] overflow-hidden group border border-[#cec5b9]/30"
                        >
                            <img
                                src={img.url}
                                alt={`variant-${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* index badge */}
                            <span className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm text-white text-[8px] uppercase tracking-widest px-2 py-0.5">
                                {i + 1}
                            </span>
                            {/* remove button */}
                            <button
                                type="button"
                                onClick={() => removeImage(img._id)}
                                className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            >
                                <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                        </div>
                    ) : (
                        /* Empty slot */
                        <label
                            key={`empty-${i}`}
                            className={`aspect-[4/5] flex flex-col items-center justify-center border border-dashed transition-all duration-300 cursor-pointer group ${
                                images.length === 8
                                    ? 'border-[#cec5b9]/20 opacity-30 pointer-events-none'
                                    : 'border-[#cec5b9]/50 hover:border-[#695d43]/50 hover:bg-[#f2ede8]/40'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[#bab5ae] text-[22px] group-hover:text-[#695d43] transition-colors mb-1">
                                add_photo_alternate
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-[#c0bab2] group-hover:text-[#695d43] transition-colors">
                                Slot {i + 1}
                            </span>
                            {i === images.length && (
                                <input
                                    ref={inputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            )}
                        </label>
                    );
                })}
            </div>

            {images.length < 8 && (
                <p className="text-[9px] text-[#7d766c] tracking-wide text-center">
                    Click any open slot · max 8 images per variant
                </p>
            )}
        </div>
    );
};

// ─── Dynamic Attributes Editor ──────────────────────────────────────────────
const AttributesEditor = ({ attributes, onChange }) => {
    const [newKey, setNewKey] = useState('');
    const [newVal, setNewVal] = useState('');

    const addAttribute = () => {
        const k = newKey.trim();
        const v = newVal.trim();
        if (!k || !v) { toast.error('Attribute key and value are required'); return; }
        if (attributes[k] !== undefined) { toast.error(`"${k}" already exists`); return; }
        onChange({ ...attributes, [k]: v });
        setNewKey('');
        setNewVal('');
    };

    const removeAttribute = (key) => {
        const next = { ...attributes };
        delete next[key];
        onChange(next);
    };

    const updateValue = (key, val) => onChange({ ...attributes, [key]: val });

    return (
        <div className="space-y-6">
            {/* Existing attribute rows */}
            {Object.entries(attributes).map(([key, val]) => (
                <div key={key} className="flex items-end gap-4 group">
                    <div className="flex-1 space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#695d43]">{key}</label>
                        <input
                            value={val}
                            onChange={e => updateValue(key, e.target.value)}
                            className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeAttribute(key)}
                        className="mb-2 text-[#bab5ae] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <span className="material-symbols-outlined text-[18px]">remove_circle_outline</span>
                    </button>
                </div>
            ))}

            {/* Add new attribute row */}
            <div className="pt-4 border-t border-[#cec5b9]/20 space-y-4">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">Add Attribute</p>
                <div className="grid grid-cols-5 gap-3 items-end">
                    <div className="col-span-2 space-y-2">
                        <label className="text-[8px] uppercase tracking-[0.2em] text-[#7d766c]">Key</label>
                        <input
                            value={newKey}
                            onChange={e => setNewKey(e.target.value)}
                            placeholder="e.g. Material"
                            onKeyDown={e => e.key === 'Enter' && addAttribute()}
                            className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9]"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-[8px] uppercase tracking-[0.2em] text-[#7d766c]">Value</label>
                        <input
                            value={newVal}
                            onChange={e => setNewVal(e.target.value)}
                            placeholder="e.g. Cotton"
                            onKeyDown={e => e.key === 'Enter' && addAttribute()}
                            className="w-full bg-transparent border-b border-[#cec5b9] pb-2 text-sm focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addAttribute}
                        className="mb-2 flex items-center justify-center w-8 h-8 border border-[#695d43] text-[#695d43] hover:bg-[#695d43] hover:text-white transition-all duration-300"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AddVariant() {
    const { productId } = useParams();
    const { handleCreateVariant, handleGetproductDetail } = useProducts();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState(null);   // existing product

    const [form, setForm] = useState({
        title: '',
        description: '',
        images: [],          // [{ _id, file, url }]
        stock: '',
        attributes: {
            Size: '',
            Color: '',
        },
        price: {
            amount: '',
            currency: 'INR',
        },
    });

    // ── fetch existing product to get title & description ────────────────
    useEffect(() => {
        const load = async () => {
            const res = await handleGetproductDetail(productId);
            const data = res?.data || res;
            if (data?._id) {
                setProduct(data);
                setForm(p => ({
                    ...p,
                    title: data.title || '',
                    description: data.description || '',
                }));
            }
        };
        load();
    }, [productId]);

    // ── field helpers ──────────────────────────────────────────────────────
    const setImages = (images) => setForm(p => ({ ...p, images }));
    const setAttributes = (attrs) => setForm(p => ({ ...p, attributes: attrs }));
    const setPrice = (key, val) =>
        setForm(p => ({ ...p, price: { ...p.price, [key]: val } }));

    // ── validation ─────────────────────────────────────────────────────────
    const validate = () => {
        if (!form.price.amount || isNaN(Number(form.price.amount))) {
            toast.error('Price amount is required'); return false;
        }
        if (Number(form.price.amount) <= 0) {
            toast.error('Price must be greater than 0'); return false;
        }
        if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
            toast.error('Stock must be a non-negative number'); return false;
        }
        return true;
    };

    // ── submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            // Payload matches addProductVariant API exactly:
            // Payload matches addProductVariant API — title, description, priceCurrency all required
            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                images: form.images,   // keep full objects — API reads .file from each
                stock: form.stock !== '' ? Number(form.stock) : 0,
                attributes: Object.fromEntries(
                    Object.entries(form.attributes).filter(([k, v]) => k.trim() && v.trim())
                ),
                price: {
                    amount: Number(form.price.amount),
                    currency: form.price.currency,
                },
            };

            const res = await handleCreateVariant(productId, payload);

            if (res?.success) {
                toast.success(res.message || 'Variant created!');
                console.log("payload",payload);
                
                navigate(`/seller/product/${productId}`);
            } else {
                toast.error(res?.message || 'Failed to create variant');
            }
        } catch (err) {
            toast.error('An error occurred');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-['Inter'] selection:bg-[#f2e1c0]">
            {/* Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');`}</style>

            {/* ── Sticky Nav ───────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-xl border-b border-[#e3e2df] px-8 md:px-16 py-5 flex items-center justify-between">
                <button
                    onClick={() => navigate(`/seller/product/${productId}`)}
                    className="flex items-center gap-3 group"
                >
                    <span className="material-symbols-outlined text-[20px] text-[#5f5e5e] group-hover:-translate-x-1 transition-transform duration-300">
                        arrow_back
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#7d766c] group-hover:text-[#1a1c1a] transition-colors">
                        Back to Product
                    </span>
                </button>

                <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#1a1c1a]">
                    Snitch Creator
                </span>

                <div className="w-28" />
            </nav>

            {/* ── Page Content ─────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-8 md:px-16 pt-20 pb-40">

                {/* Header */}
                <header className="mb-20 space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#695d43]">
                        Products / Variants / Add New
                    </p>
                    <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.15em] text-[#1a1c1a] leading-tight">
                        Add Variant
                    </h1>
                    <div className="h-px w-16 bg-[#695d43]" />
                    <p className="text-sm text-[#7d766c] font-light max-w-md leading-relaxed">
                        Define a new size, color, or edition of this product. Each variant holds its own pricing, stock, and imagery.
                    </p>
                </header>

                {/* ── Two-column layout ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* LEFT — Form Fields */}
                    <div className="lg:col-span-7 space-y-20">

                        {/* ── Section: Info ──────────────────────────────── */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">
                                    00 — Info
                                </span>
                                <div className="flex-1 h-px bg-[#e3e2df]" />
                            </div>

                            {/* Title */}
                            <div className="space-y-4">
                                <label className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">
                                    Title <span className="text-[#695d43]">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Oversized Linen Blazer — Sand"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-3 text-xl font-light focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9]"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <label className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">
                                    Description <span className="text-[#695d43]">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe the material, fit, or what makes this variant unique…"
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-3 text-sm font-light leading-8 resize-none focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9]"
                                />
                            </div>
                        </section>

                        {/* ── Section: Pricing ───────────────────────────── */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">
                                    01 — Pricing
                                </span>
                                <div className="flex-1 h-px bg-[#e3e2df]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Amount */}
                                <div className="space-y-4">
                                    <label className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">
                                        Price Amount <span className="text-[#695d43]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.price.amount}
                                        onChange={e => setPrice('amount', e.target.value)}
                                        className="w-full bg-transparent border-b border-[#cec5b9] pb-3 text-2xl font-light tracking-widest focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>

                                {/* Currency */}
                                <div className="space-y-4">
                                    <label className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">
                                        Currency
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={form.price.currency}
                                            onChange={e => setPrice('currency', e.target.value)}
                                            className="w-full bg-transparent border-b border-[#cec5b9] pb-3 text-xl font-light tracking-wider focus:outline-none focus:border-[#695d43] transition-colors appearance-none cursor-pointer pr-6"
                                        >
                                            {CURRENCIES.map(c => (
                                                <option key={c} value={c} style={{ background: '#faf9f6' }}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-0 bottom-3 pointer-events-none text-[16px] text-[#7d766c]">
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Section: Stock ─────────────────────────────── */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">
                                    02 — Stock
                                </span>
                                <div className="flex-1 h-px bg-[#e3e2df]" />
                            </div>

                            <div className="max-w-xs space-y-4">
                                <label className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c]">
                                    Units Available
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="e.g. 100"
                                    value={form.stock}
                                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                                    className="w-full bg-transparent border-b border-[#cec5b9] pb-3 text-2xl font-light tracking-widest focus:outline-none focus:border-[#695d43] transition-colors placeholder:text-[#cec5b9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <p className="text-[9px] text-[#7d766c] tracking-wide">
                                    Leave empty for unlimited / untracked stock
                                </p>
                            </div>
                        </section>

                        {/* ── Section: Attributes ────────────────────────── */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">
                                    03 — Attributes
                                </span>
                                <div className="flex-1 h-px bg-[#e3e2df]" />
                            </div>

                            <p className="text-[10px] text-[#7d766c] tracking-wide -mt-4">
                                Dynamic key → value pairs (e.g. Size: L, Color: Sand, Material: Cotton)
                            </p>

                            <AttributesEditor
                                attributes={form.attributes}
                                onChange={setAttributes}
                            />
                        </section>
                    </div>

                    {/* RIGHT — Image Upload */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#1a1c1a]">
                                    04 — Media
                                </span>
                                <div className="flex-1 h-px bg-[#e3e2df]" />
                            </div>

                            <ImageUploadGrid images={form.images} onChange={setImages} />

                            {/* Live payload preview */}
                            <details className="group cursor-pointer">
                                <summary className="text-[9px] uppercase tracking-[0.25em] text-[#7d766c] list-none flex items-center gap-2 select-none">
                                    <span className="material-symbols-outlined text-[14px] group-open:rotate-90 transition-transform">
                                        chevron_right
                                    </span>
                                    Preview payload
                                </summary>
                                <pre className="mt-4 p-4 bg-[#f0efe9] text-[10px] leading-relaxed text-[#5f5e5e] overflow-x-auto border border-[#e3e2df]">
{JSON.stringify({
    images: form.images.map((_, i) => `[File ${i + 1}]`),
    stock: form.stock !== '' ? Number(form.stock) : 0,
    attributes: Object.fromEntries(
        Object.entries(form.attributes).filter(([k, v]) => k.trim() && v.trim())
    ),
    price: {
        amount: Number(form.price.amount) || 0,
        currency: form.price.currency,
    },
}, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Floating Bottom Bar ──────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-t border-[#e3e2df] px-8 py-5 flex items-center justify-between">
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#7d766c]">
                    {form.images.length > 0
                        ? `${form.images.length} image${form.images.length > 1 ? 's' : ''} staged`
                        : 'No media staged'}
                    {Object.values(form.attributes).some(v => v.trim()) && (
                        <span className="ml-4">
                            · {Object.entries(form.attributes).filter(([, v]) => v.trim()).length} attribute{Object.entries(form.attributes).filter(([, v]) => v.trim()).length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/seller/product/${productId}`)}
                        className="px-8 py-3 text-[10px] uppercase tracking-[0.2em] text-[#7d766c] border border-[#e3e2df] hover:border-[#695d43] hover:text-[#695d43] transition-all duration-300"
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !form.price.amount || !form.title.trim() || !form.description.trim()}
                        className="px-12 py-3 bg-[#1a1c1a] text-white text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-[#5f5e5e] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500"
                    >
                        {submitting ? 'Committing…' : 'Commit Variant'}
                    </button>
                </div>
            </div>

            <style>{`
                input[type=number] { -moz-appearance: textfield; }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            `}</style>
        </div>
    );
}
