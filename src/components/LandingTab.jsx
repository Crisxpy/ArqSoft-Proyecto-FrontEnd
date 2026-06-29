import React, { useState, useEffect } from 'react';
import {
  Zap,
  ChevronRight,
  Star,
  Truck,
  Shield,
  CreditCard,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useCatalog } from '../adapters/hooks/useCatalog.js';

// Static high-quality images from the Figma mockup to keep the premium design look
const STATIC_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1519086588705-c935fdedcc14?w=600&h=450&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1583305727488-61f82c7eae4b?w=600&h=450&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=450&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?w=600&h=450&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=450&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1632064824547-e77c36851495?w=600&h=450&fit=crop&auto=format",
];

const getStaticProductImage = (name, index) => {
  if (!name) return STATIC_PRODUCT_IMAGES[index % STATIC_PRODUCT_IMAGES.length];
  const lower = name.toLowerCase();
  if (lower.includes('macbook')) return STATIC_PRODUCT_IMAGES[0];
  if (lower.includes('sony') || lower.includes('audifono') || lower.includes('headphone')) return STATIC_PRODUCT_IMAGES[1];
  if (lower.includes('iphone') || lower.includes('celular') || lower.includes('phone')) return STATIC_PRODUCT_IMAGES[2];
  if (lower.includes('samsung') || lower.includes('televisor') || lower.includes('tv')) return STATIC_PRODUCT_IMAGES[3];
  if (lower.includes('logitech') || lower.includes('mouse') || lower.includes('teclado')) return STATIC_PRODUCT_IMAGES[4];
  if (lower.includes('monitor') || lower.includes('dell') || lower.includes('pantalla')) return STATIC_PRODUCT_IMAGES[5];
  return STATIC_PRODUCT_IMAGES[index % STATIC_PRODUCT_IMAGES.length];
};

export default function LandingTab({ onGoToCatalog, onAddToCart, cart }) {
  // Fetch real catalog products from BFF to show in "Productos Destacados"
  const { products, loading, error } = useCatalog('', 1);
  
  // Real-time countdown timer for Flash Deals (mock countdown starting at 5h 42m 18s)
  const [timeLeft, setTimeLeft] = useState(20538); // seconds
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 20538));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Categories list mapped to existing categories with mockup details
  const categories = [
    { id: 'Electrónica', name: "Electrónica", icon: "⚡", count: 1284, color: "#1E3A5F" },
    { id: 'Tecnología', name: "Tecnología", icon: "💻", count: 876, color: "#1A3D2E" },
    { id: 'Hogar', name: "Hogar y Electro", icon: "🏠", count: 2103, color: "#3D2A1A" },
    { id: 'Herramientas', name: "Herramientas", icon: "🔧", count: 534, color: "#2D1A3D" }
  ];

  // Daily Deals static mockup items as requested (combining Figma design style)
  const dailyDeals = [
    {
      id: 'deal-1',
      name: "Teclado Mecánico Keychron K2",
      price: 79990,
      oldPrice: 119990,
      discount: 33,
      img: "https://images.unsplash.com/photo-1626958390943-a70309376444?w=400&h=300&fit=crop&auto=format",
    },
    {
      id: 'deal-2',
      name: "Webcam Logitech C920",
      price: 54990,
      oldPrice: 84990,
      discount: 35,
      img: "https://images.unsplash.com/photo-1614588876378-b2ffa4520c22?w=400&h=300&fit=crop&auto=format",
    },
    {
      id: 'deal-3',
      name: "SSD Samsung 1TB NVMe",
      price: 69990,
      oldPrice: 99990,
      discount: 30,
      img: "https://images.unsplash.com/photo-1601737487795-dab272f52420?w=400&h=300&fit=crop&auto=format",
    },
    {
      id: 'deal-4',
      name: "Auriculares AirPods Pro 2",
      price: 189990,
      oldPrice: 249990,
      discount: 24,
      img: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&auto=format",
    }
  ];

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  // Render static star rating for premium look
  const renderStars = (rating) => {
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={11}
            className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-[#2A2F2D]"}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="f_landing_wrapper px-6 py-8 md:px-12 md:py-12 space-y-12" >
      
      {/* ── Hero Banner (Figma mock theme) ── */}
      <div style={{ padding: '0.5rem' }}className="f_hero_banner h-[320px] md:h-[360px] flex items-center justify-between px-8 md:px-14 relative">
        <img 
          src="https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=1400&h=700&fit=crop&auto=format"
          alt="Banner tecnología"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          
        />
        <div className="relative z-10 max-w-xl flex flex-col justify-center">
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 f_green_text" style={{ marginLeft: '1rem' }}>
            ✦ Bienvenido a la mejor experiencia de compra
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white" style={{ marginLeft: '1rem' }}>
            Compra fácil, rápido y seguro en <span className="f_green_text font-black" >MiniMarketPlace</span>
          </h1>
          <p className="text-sm md:text-base mb-6 f_text_muted max-w-md leading-relaxed" style={{ marginLeft: '1rem' }}>
            Miles de productos tecnológicos con los mejores precios y envío rápido a todo Chile.
          </p>
          <div className="flex items-center gap-3">
            <button className="f_green_btn px-6 py-3 text-sm md:text-base font-bold" style={{ marginLeft: '1rem', padding: '0.5rem' }} onClick={() => onGoToCatalog('all')}>
              Comprar ahora →
            </button>
            <button className="px-6 py-3 text-sm md:text-base font-semibold rounded-lg border f_border_dark text-white bg-transparent hover:bg-[#171C1B]/80 transition-colors" style={{ marginLeft: '1rem', padding: '0.5rem' }}>
              Ver ofertas
            </button>
          </div>
        </div>

        {/* Floating statistics on desktop */}
        <div className="hidden lg:flex flex-col gap-3 relative z-10">
          {[
            { n: "50K+", l: "Productos" },
            { n: "200K+", l: "Clientes" },
            { n: "4.9★", l: "Calificación" },
          ].map(({ n, l }) => (
            <div key={l} className="f_stat_card px-5 py-2.5 text-center min-w-[120px]">
              <div className="text-lg font-bold f_green_text">{n}</div>
              <div className="text-[10px] uppercase tracking-wider f_text_muted">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categorías Populares (Figma layout connected to BFF filter action) ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white"style={{padding: '0.5rem' }}>Categorías populares</h2>
          <button
            className="text-sm font-semibold flex items-center gap-1 hover:underline f_green_text bg-transparent border-none cursor-pointer"
            onClick={() => onGoToCatalog('all')}
          style={{ padding: '0.5rem' }}>
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onGoToCatalog(cat.id)}
              className="f_category_card p-5 flex flex-col items-center gap-3 text-center cursor-pointer group"
            style={{ marginLeft: '1rem', padding: '0.5rem' }}>
              <div
                className="f_category_icon_wrap"
                style={{ background: cat.color }}
              >
                {cat.icon}
              </div>
              <div>
                <span className="text-sm font-bold text-white group-hover:text-[#22C55E] transition-colors">{cat.name}</span>
                <p className="text-xs f_text_muted mt-1">{cat.count.toLocaleString()} productos</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Ofertas del día (Figma mock flash deals with real countdown) ── */}
      <section style={{padding: '1rem' }}>
        <div className="f_card_dark p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div  className="f_flash_icon_wrap w-9 h-9">
                <Zap size={18} className="text-red-500 fill-red-500" />
              </div>
              <div >
                <h2 className="text-lg md:text-xl font-bold text-white" style={{ marginTop: '1rem',marginLeft: '1rem', padding: '0.5rem' }}>Ofertas del día</h2>
                <p className="text-[10px] uppercase tracking-wider f_text_muted"style={{ marginLeft: '1rem', padding: '0.5rem' }}>Válido por tiempo limitado</p>
              </div>
              <div className="f_deal_timer px-3 py-1.5 rounded-lg font-mono font-bold text-sm md:text-base ml-2">
                {formatTimer(timeLeft)}
              </div>
            </div>
            <button 
              onClick={() => onGoToCatalog('all')}
              className="text-sm font-semibold flex items-center gap-1 hover:underline f_green_text bg-transparent border-none cursor-pointer self-start md:self-auto"
            style={{ padding: '0.5rem' }}>
              Ver todas <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4"style={{ marginLeft: '1rem', marginRight: '1rem', padding: '0.5rem' }}>
            {dailyDeals.map((d) => (
              <div
                key={d.id}
                className="f_card_dark rounded-xl overflow-hidden cursor-pointer group border f_border_dark"
                style={{ background: '#0B0F0E' }}
                onClick={() => onGoToCatalog('all')}
              >
                <div className="relative aspect-[4/3] bg-[#0B0F0E] overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500 text-white">
                    -{d.discount}%
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-white line-clamp-2 mb-1.5 h-8 leading-tight"style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>{d.name}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm font-bold f_green_text"style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>{fmt(d.price)}</span>
                    <span className="text-[10px] line-through f_text_muted">{fmt(d.oldPrice)}</span>
                  </div>
                  <button
                    className="f_green_btn w-full py-1.5 text-[11px] font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart({ id: d.id, name: d.name, price: d.price, inStock: true });
                    }}
                  style={{ padding: '0.5rem', }}>
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos Destacados (Real products from BFF, styled in Figma layout) ── */}
      <section style = {{ padding: '0.5rem' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white" style={{ marginLeft: '1rem', padding: '0.5rem' }}>Productos destacados</h2>
          <button 
            className="text-sm font-semibold flex items-center gap-1 hover:underline f_green_text bg-transparent border-none cursor-pointer"
            onClick={() => onGoToCatalog('all')}
          style={{ padding: '0.5rem' }}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 f_text_muted">
            <div className="spinner mx-auto mb-3"></div>
            Cargando catálogo destacado del BFF...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Error al cargar destacados del BFF: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5"style={{ marginLeft: '1rem', padding: '0.5rem' }}>
            {products.slice(0, 3).map((p, index) => {
              const staticImg = getStaticProductImage(p.name, index);
              const inCart = cart[p.id]?.qty || 0;
              // Generate mock reviews/ratings to align with Figma premium look
              const mockRating = (4.5 + (p.id % 5) * 0.1).toFixed(1);
              const mockReviews = 100 + (p.id * 17) % 400;
              const mockOldPrice = p.price + 50000;

              return (
                <div key={p.id} className="f_card_dark flex flex-col justify-between" style={{ marginLeft: '1rem', padding: '0.5rem' }}>
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#0B0F0E] rounded-t-2xl">
                    <img
                      src={staticImg}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span style={{ padding: '0.5rem' }} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full f_badge_primary">
                        Destacado
                      </span>
                      {!p.inStock && (
                        <span style={{  padding: '0.5rem' }}className="text-[10px] font-bold px-2.5 py-0.5 rounded-full f_badge_danger">
                          Sin Stock
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider f_text_muted mb-1 font-semibold"style={{padding: '0.5rem' }}>{p.category || 'Tecnología'}</p>
                      <h3 className="font-bold text-sm text-white line-clamp-2 h-10 leading-snug"style={{ padding: '0.5rem' }}>{p.name}</h3>
                      <div className="flex items-center gap-2 mt-2 mb-3">
                        {renderStars(mockRating)}
                        <span className="text-[10px] f_text_muted">({mockReviews})</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold f_green_text font-mono" >{fmt(p.price)}</p>
                          <p className="text-xs line-through f_text_muted">{fmt(mockOldPrice)}</p>
                        </div>
                        <span className="text-[10px] f_text_muted font-semibold">
                          Stock: {p.inStock ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>

                      {p.inStock ? (
                        <button
                          className="f_green_btn w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                          onClick={() => onAddToCart(p)}
                        style={{ padding: '0.5rem' }}>
                          <ShoppingCart size={14} />
                          {inCart > 0 ? `En carrito (${inCart})` : 'Comprar'}
                        </button>
                      ) : (
                        <button style={{padding: '0.5rem' }}className="w-full py-2.5 text-xs rounded-lg bg-zinc-800 text-zinc-500 font-bold border-none cursor-not-allowed" disabled>
                          Sin stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Trust/Info Strip (Figma footer banner strip) ── */}
      <div style={{  padding: '1rem' }} className="pb-4 border-t f_border_dark pt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={20} />, t: "Envío rápido", d: "A todo Chile en 24-72 hrs", bg: "#1A3D2E" },
            { icon: <Shield size={20} />, t: "Compra segura", d: "Protección total en cada pago", bg: "#1E3A5F" },
            { icon: <CreditCard size={20} />, t: "Cuotas sin interés", d: "Hasta 12 cuotas con tarjeta", bg: "#3D2A1A" },
            { icon: <Package size={20} />, t: "Devoluciones", d: "30 días para cambios", bg: "#2D1A3D" },
          ].map(({ icon, t, d, bg }) => (
            <div key={t} className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-white">{t}</p>
                <p className="text-[10px] md:text-xs f_text_muted mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
