import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ChevronRight,
  Truck,
  Shield,
  CreditCard,
  Package
} from 'lucide-react';
import { useCatalog } from '../adapters/hooks/useCatalog.js';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  // Fetch real catalog products from BFF for public preview
  const { products, loading, error } = useCatalog('', 1);

  // Categories list mapped to existing categories with mockup details
  const categories = [
    { id: 'Electrónica', name: "Electrónica", icon: "⚡", color: "#1E3A5F" },
    { id: 'Tecnología', name: "Tecnología", icon: "💻", color: "#1A3D2E" },
    { id: 'Hogar', name: "Hogar y Electro", icon: "🏠", color: "#3D2A1A" },
    { id: 'Herramientas', name: "Herramientas", icon: "🔧", color: "#2D1A3D" }
  ];

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  // Action helper to prompt login when clicking private actions
  const handleAction = () => {
    navigate('/login');
  };

  return (
    <div className="f_landing_wrapper">
      {/* ── Public Navbar (Figma mockup style but simple actions) ── */}
      <nav className="nav" style={{ background: '#111514', borderBottom: '1px solid #2A2F2D' }}>
        <div
          className="nav-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#22C55E] mr-1">
            <Zap size={15} color="#0B0F0E" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px', letterSpacing: '-0.5px', color: '#FFF' }}>
            Mini<span style={{ color: '#22C55E' }}>MarketPlace</span>
          </span>
        </div>
        
        <div className="nav-actions">
          <Link className="btn btn-primary" to="/login" style={{ background: '#22C55E', color: '#0B0F0E', borderColor: '#22C55E', fontWeight: 'bold' }}>
            Iniciar sesión
          </Link>
        </div>
      </nav>

      <div className="px-6 py-8 md:px-12 md:py-12 space-y-12">
        {/* ── Hero Banner ── */}
        <div style={{ padding: '0.5rem' }} className="f_hero_banner h-[320px] md:h-[360px] flex items-center justify-between px-8 md:px-14 relative">
          <img
            src="https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=1400&h=700&fit=crop&auto=format"
            alt="Banner tecnología"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
          <div className="relative z-10 max-w-xl flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 f_green_text" style={{ marginLeft: '1rem' }}>
              ✦ Catálogo Público — Inicia sesión para comprar
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white" style={{ marginLeft: '1rem' }}>
              Compra fácil, rápido y seguro en <span className="f_green_text font-black">MiniMarketPlace</span>
            </h1>
            <p className="text-sm md:text-base mb-6 f_text_muted max-w-md leading-relaxed" style={{ marginLeft: '1rem' }}>
              Explora las mejores ofertas en tecnología y productos para el hogar. ¡Inicia sesión para gestionar tu carro de compras!
            </p>
            <div className="flex items-center gap-3">
              <button className="f_green_btn px-6 py-3 text-sm md:text-base font-bold" style={{ marginLeft: '1rem', padding: '0.5rem' }} onClick={handleAction}>
                Ver catálogo completo →
              </button>
            </div>
          </div>

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

        {/* ── Categorías (Placeholders with redirects) ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white" style={{ padding: '0.5rem' }}>Categorías populares</h2>
            <button
              className="text-sm font-semibold flex items-center gap-1 hover:underline f_green_text bg-transparent border-none cursor-pointer"
              onClick={handleAction}
              style={{ padding: '0.5rem' }}
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={handleAction}
                className="f_category_card p-5 flex flex-col items-center gap-3 text-center cursor-pointer group"
                style={{ marginLeft: '1rem', padding: '0.5rem' }}
              >
                <div
                  className="f_category_icon_wrap"
                  style={{ background: cat.color }}
                >
                  {cat.icon}
                </div>
                <div>
                  <span className="text-sm font-bold text-white group-hover:text-[#22C55E] transition-colors">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Productos Destacados (Real products preview) ── */}
        <section style={{ padding: '0.5rem' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white" style={{ marginLeft: '1rem', padding: '0.5rem' }}>Productos destacados</h2>
            <button 
              className="text-sm font-semibold flex items-center gap-1 hover:underline f_green_text bg-transparent border-none cursor-pointer"
              onClick={handleAction}
              style={{ padding: '0.5rem' }}
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 f_text_muted">
              <div className="spinner mx-auto mb-3"></div>
              Cargando catálogo destacado...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Error al cargar destacados del BFF: {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginLeft: '1rem', padding: '0.5rem' }}>
              {products.slice(0, 3).map((p) => {
                return (
                  <div key={p.id} className="f_card_dark flex flex-col justify-between" onClick={handleAction} style={{ cursor: 'pointer', marginLeft: '1rem', padding: '0.5rem' }}>
                    <div className="relative overflow-hidden aspect-[4/3] bg-[#0B0F0E] rounded-t-2xl flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.nextSibling;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="product-img-placeholder flex items-center justify-center text-4xl" style={{ display: p.imageUrl ? 'none' : 'flex', width: '100%', height: '100%' }}>
                        📦
                      </div>
                      <span style={{ padding: '0.5rem', position: 'absolute' }} className="top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full f_badge_primary">
                        Vista Previa
                      </span>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider f_text_muted mb-1 font-semibold" style={{ padding: '0.5rem' }}>{p.category || 'Tecnología'}</p>
                        <h3 className="font-bold text-sm text-white line-clamp-2 h-10 leading-snug" style={{ padding: '0.5rem' }}>{p.name}</h3>
                      </div>

                      <div>
                        <div className="flex items-end justify-between mb-4">
                          <div>
                            <p className="text-lg font-bold f_green_text font-mono">{fmt(p.price)}</p>
                          </div>
                        </div>

                        <button className="f_green_btn w-full py-2.5 text-xs flex items-center justify-center gap-1.5" style={{ padding: '0.5rem' }}>
                          Iniciar sesión para comprar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Info Strip ── */}
        <div style={{ padding: '1rem' }} className="pb-4 border-t f_border_dark pt-8">
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

      <Footer />
    </div>
  );
}
