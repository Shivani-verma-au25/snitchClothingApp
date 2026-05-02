import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProduct';

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleGetproductDetail } = useProducts();
  const navigate = useNavigate();

  const [product,    setProduct]    = useState(null);
  const [selVariant, setSelVariant] = useState(null);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartDone,   setCartDone]   = useState(false);
  const [buyDone,    setBuyDone]    = useState(false);
  const [isDesktop,  setIsDesktop]  = useState(() => window.innerWidth >= 768);

  /* fetch */
  useEffect(() => {
    (async () => {
      const res  = await handleGetproductDetail(productId);
      const data = res?.data ?? res;
      setProduct(data);
      if (data?.variants?.length) setSelVariant(data.variants[0]);
    })();
  }, [productId]);

  /* track screen size */
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const allImgs  = product ? [...(product.images ?? []), ...(selVariant?.images ?? [])] : [];
  const price    = selVariant?.price?.amount  ?? product?.price?.amount  ?? 0;
  const currency = selVariant?.price?.currency ?? product?.price?.currency ?? 'INR';
  const sym      = currency === 'INR' ? '₹' : currency;
  const stock    = selVariant?.stock ?? 0;
  const attrs    = selVariant?.attributes ?? {};
  const heroImg  = allImgs[imgIdx]?.url ?? allImgs[imgIdx];

  const addToCart = () => { setCartDone(true); setTimeout(() => setCartDone(false), 2000); };
  const buyNow    = () => { setBuyDone(true);  setTimeout(() => setBuyDone(false),  2000); };

  /* ── Loading ── */
  if (!product) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0e0d0b', fontFamily:'Inter,sans-serif', gap:14 }}>
      <div style={{ width:26, height:26, border:'2px solid rgba(201,185,154,0.6)', borderTopColor:'#c9b99a', borderRadius:'50%', animation:'pdSpin .8s linear infinite' }} />
      <span style={{ fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>Loading</span>
      <style>{`@keyframes pdSpin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     SHARED SUB-COMPONENTS (used in both layouts)
  ══════════════════════════════════════════════════════════ */

  /* Thumbnail strip — adapts direction via prop */
  const Thumbs = ({ direction = 'row' }) => (
    allImgs.length > 1 ? (
      <div style={{
        display:'flex',
        flexDirection: direction,
        gap:8,
        overflowX: direction === 'row' ? 'auto' : 'visible',
        overflowY: direction === 'column' ? 'auto' : 'visible',
        scrollbarWidth:'none',
        padding: direction === 'column' ? '0 0 4px' : '0 0 4px',
      }}>
        {allImgs.map((img, i) => (
          <button
            key={i}
            onClick={() => setImgIdx(i)}
            style={{
              flexShrink:0, width:52, height:52, borderRadius:'50%',
              padding:2, cursor:'pointer',
              border: i===imgIdx ? '2px solid #c9b99a' : '2px solid transparent',
              background:'none', overflow:'hidden',
              outline: i===imgIdx ? '1.5px solid rgba(201,185,154,0.45)' : 'none',
              outlineOffset:2,
              transition:'all .2s',
              opacity: i===imgIdx ? 1 : 0.5,
            }}
          >
            <img src={img?.url ?? img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
          </button>
        ))}
      </div>
    ) : null
  );

  /* Size selector buttons */
  const SizeSelector = () => (
    product.variants?.length > 0 ? (
      <div>
        <p style={{ margin:'0 0 10px', fontSize:9, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#7d766c' }}>Select Size</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {product.variants.map(v => {
            const active = selVariant?._id === v._id;
            return (
              <button
                key={v._id}
                onClick={() => { setSelVariant(v); setImgIdx(0); }}
                style={{
                  padding:'9px 20px', borderRadius:0,
                  fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                  fontFamily:'Inter,sans-serif', cursor:'pointer',
                  border:`1.5px solid ${active ? '#1a1c1a' : 'rgba(206,197,185,0.55)'}`,
                  background: active ? '#1a1c1a' : 'transparent',
                  color: active ? '#fff' : '#4b463d',
                  transition:'all .22s',
                }}
              >
                {v.attributes?.Size ?? 'One Size'}
              </button>
            );
          })}
        </div>
      </div>
    ) : null
  );

  /* CTA bar — mobile */
  const CTABar = () => (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {/* Buy Now — top, full width */}
      <button
        onClick={buyNow}
        className={`pd-btn-buy${buyDone ? ' pd-btn-buy-done' : ''}`}
        style={{
          height:40, border:'none', borderRadius:0, cursor:'pointer',
          background: buyDone ? '#5a4f38' : '#695d43',
          color:'#faf9f6',
          fontSize:9, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase',
          fontFamily:'Inter,sans-serif',
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          transition:'background .3s',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize:14 }}>{buyDone ? 'check' : 'bolt'}</span>
        {buyDone ? 'Order Placed!' : 'Buy Now'}
      </button>
      {/* Add to Cart + Wishlist — bottom row */}
      <div style={{ display:'flex' }}>
        <button
          onClick={() => setWishlisted(w => !w)}
          style={{
            flex:'0 0 40%',
            height:40, border:'none', borderRadius:0, cursor:'pointer',
            background: wishlisted ? '#f2e1c0' : 'rgba(242,225,192,0.7)',
            color:'#6f6349',
            fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase',
            fontFamily:'Inter,sans-serif',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            transition:'background .25s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize:14, fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0", transition:'font-variation-settings .25s' }}>favorite</span>
          {wishlisted ? 'Saved' : 'Wishlist'}
        </button>
        <button
          onClick={addToCart}
          style={{
            flex:'0 0 60%',
            height:40, border:'none', borderRadius:0, cursor:'pointer',
            background: cartDone ? '#695d43' : '#1a1c1a',
            color:'#fff',
            fontSize:9, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase',
            fontFamily:'Inter,sans-serif',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            transition:'background .4s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize:14 }}>{cartDone ? 'check' : 'add_shopping_cart'}</span>
          {cartDone ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     DESKTOP LAYOUT  (≥ 768px)
     Left col: image (sticky) + thumbnails below
     Right col: scrollable product info
  ══════════════════════════════════════════════════════════ */
  if (isDesktop) return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Inter,sans-serif', background:'#faf9f6' }} className="pd-page">

      {/* ── Left: image panel ── */}
      <div style={{ flex:'0 0 50%', position:'relative', background:'#f4f3f0', display:'flex', flexDirection:'column', padding:'20px 20px 0' }} className="pd-left">

        {/* Top row: back button + brand */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexShrink:0 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'8px 16px', border:'none', borderRadius:0, cursor:'pointer',
              background:'rgba(26,28,26,0.07)', color:'#1a1c1a',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_back</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>Back</span>
          </button>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.4em', textTransform:'uppercase', color:'#4b463d' }}>SNITCH</span>
          <div style={{ width:72 }} />{/* spacer to centre brand */}
        </div>

        {/* Main image — softly contained, not full-bleed */}
        <div style={{ flex:1, overflow:'hidden', position:'relative' }} className="pd-img-wrap">
          {heroImg ? (
            <img
              key={imgIdx}
              src={heroImg}
              alt={product.title}
              className="pd-hero-img"
              style={{
                width:'100%', height:'100%',
                objectFit:'cover', objectPosition:'center top',
                display:'block',
              }}
            />
          ) : (
            <div style={{ width:'100%', height:'100%', background:'#dedad7' }} />
          )}
        </div>

        {/* Thumbnail strip */}
        {allImgs.length > 1 && (
          <div style={{
            flexShrink:0, display:'flex', gap:8, overflowX:'auto',
            padding:'14px 0 16px', scrollbarWidth:'none',
          }}>
            {allImgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className="pd-thumb"
                style={{
                  flexShrink:0, width:60, height:60, borderRadius:0,
                  padding:0, cursor:'pointer', overflow:'hidden', border:'none',
                  outline: i===imgIdx ? '2px solid #695d43' : '2px solid transparent',
                  outlineOffset:2,
                  opacity: i===imgIdx ? 1 : 0.45,
                  transition:'all .25s', background:'none',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <img src={img?.url ?? img} alt="" className="pd-thumb-img" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: info panel ── */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        background:'#faf9f6', overflow:'hidden',
      }} className="pd-right">

        {/* Top bar — wishlist + cart icons */}
        <div style={{
          flexShrink:0, display:'flex', justifyContent:'flex-end', alignItems:'center',
          padding:'24px 36px 0', gap:4,
        }}>
          {/* Wishlist */}
          <button
            onClick={() => setWishlisted(w => !w)}
            style={{
              width:40, height:40, background:'none', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius:'50%',
              transition:'background .2s',
            }}
            title="Wishlist"
          >
            <span className="material-symbols-outlined" style={{
              fontSize:22, color: wishlisted ? '#695d43' : '#7d766c',
              fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
              transition:'color .25s, font-variation-settings .25s',
            }}>favorite</span>
          </button>
          {/* Cart */}
          <button
            onClick={addToCart}
            style={{
              width:40, height:40, background: cartDone ? '#f2e1c0' : 'none',
              border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius:'50%', transition:'background .3s',
            }}
            title="Add to Cart"
          >
            <span className="material-symbols-outlined" style={{
              fontSize:22, color: cartDone ? '#695d43' : '#7d766c',
              transition:'color .3s',
            }}>{cartDone ? 'check_circle' : 'shopping_bag'}</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', padding:'24px 36px 0' }}>

          {/* Label */}
          <p className="pd-s1" style={{ margin:'0 0 10px', fontSize:9, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#695d43' }}>New Arrival · SS26</p>

          {/* Title */}
          <h1 className="pd-s2" style={{ margin:'0 0 6px', fontSize:'clamp(22px,2.2vw,34px)', fontWeight:400, lineHeight:1.18, color:'#1a1c1a', letterSpacing:'-0.01em' }}>
            {product.title}
          </h1>

          {/* Price */}
          <div className="pd-s3" style={{ display:'flex', alignItems:'baseline', gap:8, margin:'16px 0 20px' }}>
            <span style={{ fontSize:'clamp(18px,1.8vw,26px)', fontWeight:700, color:'#695d43' }}>{sym}{price}</span>
            <span style={{ fontSize:10, color:'#7d766c', letterSpacing:'0.14em', textTransform:'uppercase' }}>{currency}</span>
          </div>

          {/* Attr + stock pills */}
          <div className="pd-s4" style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:28 }}>
            {Object.entries(attrs).map(([k, v], pi) => (
              <span key={k} className="pd-pill" style={{ fontSize:9, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#6f6349', background:'#f2e1c0', padding:'5px 12px', animationDelay:`${pi*60}ms` }}>{k}: {v}</span>
            ))}
            <span className="pd-pill" style={{ fontSize:9, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color: stock>0?'#5c5d6f':'#ba1a1a', background: stock>0?'#e1e1f7':'#ffdad6', padding:'5px 12px', animationDelay:'120ms' }}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Tonal divider */}
          <div style={{ height:16, margin:'0 -36px', background:'#f4f3f0', marginBottom:24 }} />

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom:24 }}>
              <p style={{ margin:'0 0 6px', fontSize:9, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#7d766c' }}>Description</p>
              <p style={{ margin:0, fontSize:13, fontStyle:'italic', fontWeight:300, lineHeight:1.9, color:'#6b6359' }}>
                "{product.description}"
              </p>
            </div>
          )}

          {/* Size */}
          <div style={{ marginBottom:28 }}>
            <SizeSelector />
          </div>

          {/* Details */}
          {Object.keys(attrs).length > 0 && (
            <div style={{ marginBottom:0 }}>
              <p style={{ margin:'0 0 14px', fontSize:9, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#7d766c' }}>Details</p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {Object.entries(attrs).map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'#7d766c', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500 }}>{k}</span>
                    <span style={{ fontSize:12, color:'#1a1c1a', fontWeight:500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:20 }}>
                  <span style={{ fontSize:11, color:'#7d766c', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500 }}>Availability</span>
                  <span style={{ fontSize:12, fontWeight:600, color: stock>0?'#5c5d6f':'#ba1a1a' }}>{stock>0?`${stock} in stock`:'Out of stock'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Action buttons — below Availability ── */}
          <div className="pd-s8" style={{ margin:'20px 0 32px' }}>

            {/* Buy Now — full width, most prominent */}
            <button
              onClick={buyNow}
              className={`pd-btn-buy${buyDone ? ' pd-btn-buy-done' : ''}`}
              style={{
                width:'100%', height:40, border:'none', borderRadius:0, cursor:'pointer',
                background: buyDone ? '#5a4f38' : '#695d43',
                color:'#faf9f6', fontSize:9, fontWeight:700,
                letterSpacing:'0.26em', textTransform:'uppercase',
                fontFamily:'Inter,sans-serif',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                transition:'background .3s, transform .15s',
                marginBottom:8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize:15 }}>{buyDone ? 'check' : 'bolt'}</span>
              {buyDone ? 'Order Placed!' : 'Buy Now'}
            </button>

            {/* Add to Cart + Wishlist */}
            <div style={{ display:'flex', gap:8 }}>
              <button
                onClick={addToCart}
                className={`pd-btn-cart${cartDone ? ' pd-btn-done' : ''}`}
                style={{
                  flex:'0 0 60%', height:38, border:'none', borderRadius:0, cursor:'pointer',
                  background: cartDone ? '#695d43' : '#1a1c1a',
                  color:'#fff', fontSize:9, fontWeight:700,
                  letterSpacing:'0.2em', textTransform:'uppercase',
                  fontFamily:'Inter,sans-serif',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  transition:'background .35s, transform .15s',
                  position:'relative', overflow:'hidden',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize:14, transition:'transform .3s' }}>{cartDone ? 'check' : 'add_shopping_cart'}</span>
                {cartDone ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setWishlisted(w => !w)}
                className="pd-btn-wish"
                style={{
                  flex:1, height:38, border:'none', borderRadius:0, cursor:'pointer',
                  background: wishlisted ? '#f2e1c0' : '#f4f3f0',
                  color:'#6f6349', fontSize:9, fontWeight:700,
                  letterSpacing:'0.2em', textTransform:'uppercase',
                  fontFamily:'Inter,sans-serif',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  transition:'background .25s, transform .15s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize:14, fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0", transition:'font-variation-settings .35s, transform .3s' }}>favorite</span>
                {wishlisted ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Keyframes ── */
        @keyframes pdSpin     { to { transform:rotate(360deg); } }
        @keyframes pdFadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pdFadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes pdSlideL   { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes pdSlideR   { from { opacity:0; transform:translateX(28px);  } to { opacity:1; transform:translateX(0); } }
        @keyframes pdPopIn    { 0%{opacity:0;transform:scale(0.82);} 70%{transform:scale(1.05);} 100%{opacity:1;transform:scale(1);} }
        @keyframes pdKenBurns { from{transform:scale(1);} to{transform:scale(1.06);} }
        @keyframes pdPulseRing{ 0%{box-shadow:0 0 0 0 rgba(105,93,67,0.45);} 70%{box-shadow:0 0 0 10px rgba(105,93,67,0);} 100%{box-shadow:0 0 0 0 rgba(105,93,67,0);} }

        /* ── Panel entrances ── */
        .pd-left  { animation: pdSlideL .55s cubic-bezier(0.16,1,0.3,1) both; }
        .pd-right { animation: pdSlideR .55s cubic-bezier(0.16,1,0.3,1) both; }

        /* ── Hero image: ken-burns subtle zoom ── */
        .pd-hero-img { animation: pdKenBurns 8s ease-in-out infinite alternate; transition: opacity .45s ease; }

        /* ── Thumbnail hover lift ── */
        .pd-thumb     { transition: opacity .25s, outline-color .25s, transform .2s !important; }
        .pd-thumb:hover { opacity: 0.85 !important; transform: translateY(-3px) scale(1.04); }
        .pd-thumb-img { transition: transform .4s ease; }
        .pd-thumb:hover .pd-thumb-img { transform: scale(1.1); }

        /* ── Staggered right-panel content ── */
        .pd-s1 { animation: pdFadeUp .5s .10s both; }
        .pd-s2 { animation: pdFadeUp .5s .18s both; }
        .pd-s3 { animation: pdFadeUp .5s .26s both; }
        .pd-s4 { animation: pdFadeUp .5s .34s both; }
        .pd-s5 { animation: pdFadeUp .5s .42s both; }
        .pd-s6 { animation: pdFadeUp .5s .50s both; }
        .pd-s7 { animation: pdFadeUp .5s .58s both; }
        .pd-s8 { animation: pdFadeUp .5s .66s both; }

        /* ── Pill pop-in ── */
        .pd-pill { display:inline-block; animation: pdPopIn .35s both; }

        /* ── Back button hover ── */
        .pd-back:hover { background: rgba(26,28,26,0.13) !important; transform: translateX(-2px); }
        .pd-back { transition: background .2s, transform .2s; }

        /* ── Icon buttons hover ── */
        .pd-icon-btn:hover { background: rgba(26,28,26,0.07) !important; transform: scale(1.1); }
        .pd-icon-btn { transition: background .2s, transform .2s; }

        /* ── CTA buttons ── */
        .pd-btn-cart:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,28,26,0.22); }
        .pd-btn-cart:active { transform: scale(0.97); }
        .pd-btn-cart.pd-btn-done { animation: pdPulseRing .5s ease-out; }
        .pd-btn-wish:hover  { transform: translateY(-1px); }
        .pd-btn-wish:active { transform: scale(0.97); }
        .pd-btn-buy  { transition: background .3s, transform .15s, box-shadow .2s; }
        .pd-btn-buy:hover  { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(105,93,67,0.35); }
        .pd-btn-buy:active { transform: scale(0.97); }
        .pd-btn-buy-done   { animation: pdPulseRing .5s ease-out; }

        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     MOBILE LAYOUT  (< 768px)  — untouched floating card
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', fontFamily:'Inter,sans-serif', background:'#111' }}>

      {/* Full-bleed background image */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {heroImg ? (
          <img key={imgIdx} src={heroImg} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity .5s ease' }} />
        ) : (
          <div style={{ width:'100%', height:'100%', background:'#2a2826' }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.55) 100%)' }} />
      </div>

      {/* Top nav */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 18px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width:32, height:32, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
          <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_back</span>
        </button>
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,255,255,0.92)' }}>SNITCH</span>
        <button onClick={() => setWishlisted(w => !w)} style={{ width:32, height:32, borderRadius:'50%', border:'none', cursor:'pointer', background: wishlisted?'rgba(201,185,154,0.35)':'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .3s' }}>
          <span className="material-symbols-outlined" style={{ fontSize:16, color:'#fff', fontVariationSettings: wishlisted?"'FILL' 1":"'FILL' 0", transition:'font-variation-settings .3s' }}>favorite</span>
        </button>
      </div>

      {/* Floating bottom sheet */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, background:'#faf9f6', borderRadius:'24px 24px 0 0', display:'flex', flexDirection:'column', maxHeight:'62vh', boxShadow:'0 -6px 32px rgba(0,0,0,0.14)', animation:'pdSlideUp .55s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* Drag handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(100,90,80,0.2)' }} />
        </div>

        {/* Scrollable interior */}
        <div style={{ overflowY:'auto', flex:1, scrollbarWidth:'none', padding:'4px 24px 0' }}>
          <p style={{ margin:'0 0 6px', fontSize:9, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'#695d43' }}>New Arrival · SS26</p>

          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
            <h1 style={{ margin:0, fontSize:26, fontWeight:500, lineHeight:1.2, color:'#1a1c1a', letterSpacing:'-0.01em', flex:1 }}>{product.title}</h1>
            <div style={{ textAlign:'right', flexShrink:0, paddingTop:3 }}>
              <div style={{ fontSize:22, fontWeight:700, color:'#695d43', lineHeight:1 }}>{sym}{price}</div>
              <div style={{ fontSize:9, color:'#7d766c', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:3 }}>{currency}</div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:18, flexWrap:'wrap' }}>
            {Object.entries(attrs).map(([k, v]) => (
              <span key={k} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#6f6349', background:'#f2e1c0', padding:'4px 10px', borderRadius:3 }}>{k}: {v}</span>
            ))}
            <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:stock>0?'#5c5d6f':'#ba1a1a', background:stock>0?'#e1e1f7':'#ffdad6', padding:'4px 10px', borderRadius:3 }}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <Thumbs direction="row" />

          <div style={{ height:1, background:'rgba(206,197,185,0.25)', margin:'4px -24px 18px' }} />

          {product.description && (
            <p style={{ margin:'0 0 18px', fontSize:13, fontStyle:'italic', fontWeight:300, lineHeight:1.8, color:'#6b6359' }}>
              "{product.description}"
            </p>
          )}

          <div style={{ marginBottom:18 }}>
            <SizeSelector />
          </div>
        </div>

        {/* CTA */}
        <CTABar />
      </div>

      <style>{`
        @keyframes pdSpin    { to { transform:rotate(360deg); } }
        @keyframes pdSlideUp { from { transform:translateY(60px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        ::-webkit-scrollbar  { display:none; }
      `}</style>
    </div>
  );
};

export default ProductDetail;