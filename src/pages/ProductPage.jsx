import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../api';
import { useCart } from '../adapters/hooks/useCart.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Similar products fetched from BFF
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const carouselRef = useRef(null);

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setQuantity(1);

    // Fetch product details from BFF
    fetchProductById(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        
        // Fetch products of the same category for the Similar Products section
        setLoadingSimilar(true);
        fetchProducts({ q: '', page: 1, pageSize: 6 })
          .then((res) => {
            if (cancelled) return;
            // Filter out the current product from similar list
            const filtered = res.data.filter(item => item.id !== data.id);
            setSimilarProducts(filtered);
          })
          .catch(() => {})
          .finally(() => {
            if (!cancelled) setLoadingSimilar(false);
          });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: dir === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="f_detail_wrapper flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-3"></div>
          <p className="text-zinc-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="f_detail_wrapper flex flex-col items-center justify-center min-h-screen p-6">
        <Link to="/tienda" className="flex items-center gap-1 text-[#28C064] hover:underline mb-4">
          <ChevronLeft size={16}  /> Volver al catálogo
        </Link>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-500 font-bold mb-2">Error al cargar el producto</p>
          <p className="text-sm text-zinc-400">{error || 'El producto no fue encontrado.'}</p>
        </div>
      </div>
    );
  }

  // Fallback similar products if BFF returns none
  const fallbackSimilar = [
    { id: 'sim-1', name: "Auriculares Sport BT", price: 59990 },
    { id: 'sim-2', name: "Earbuds Premium TWS", price: 89990 },
    { id: 'sim-3', name: "Headset Gaming RGB", price: 149990 },
    { id: 'sim-4', name: "Auriculares Studio MK2", price: 199990 },
  ];
  const listSimilar = similarProducts.length > 0 ? similarProducts : fallbackSimilar;

  return (
    <div className="f_detail_wrapper bg-[#121212] text-white">
      
      {/* ── Navigation / Breadcrumbs ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between text-xs md:text-sm text-zinc-400 border-b border-zinc-800">
        <div style={{ padding: '0.5rem' }} className="flex items-center gap-2">
          <Link
            to="/tienda"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Volver al catálogo
          </Link>
          <span>/</span>
          <span className="text-zinc-500">{product.category || 'Categoría'}</span>
          <span>/</span>
          <span className="f_detail_price_accent font-semibold truncate max-w-[150px]">{product.name}</span>
        </div>
        
        <button
          onClick={() => setWishlist(!wishlist)}
          className="flex items-center gap-1.5 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        style={{ position: 'relative' }}>
          <Heart size={16} className={wishlist ? "fill-[#28C064] text-[#28C064]" : ""} />
          <span className="hidden sm:inline">{wishlist ? 'Favorito' : 'Favoritos'}</span>
        </button>
      </div>

      {/* ── Main Layout ── */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-start">
          
          {/* ── Left: Image Gallery ── */}
          <div style={{padding: '2rem' }} className="lg:sticky lg:top-8">
            <div className="f_detail_gallery_main bg-[#2A2A2A] rounded-2xl overflow-hidden relative flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextSibling;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="product-img-placeholder flex items-center justify-center text-6xl" style={{ display: product.imageUrl ? 'none' : 'flex', width: '100%', height: '100%', minHeight: '300px' }}>
                📦
              </div>

              {/* Share button */}
              <button 
                title="Compartir"
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2.5 rounded-full border-none cursor-pointer transition-colors"
              >
                <Share2 size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* ── Right: Product details ── */}
          <div style={{ padding: '2rem' }} className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest f_detail_price_accent">
                {product.category || 'Tecnología'}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-2.5 mb-2 text-white leading-tight">
                {product.name}
              </h1>
            </div>

            <hr className="border-zinc-800" />

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 my-2.5">
              <span className="text-3xl font-black text-white">
                {fmt(product.price)}
              </span>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle size={16} className="text-[#28C064]" />
                  <span className="text-sm font-semibold text-[#28C064]">Disponible en stock</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-500">Agotado temporalmente</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-relaxed">
              {product.description || 'Experimenta el máximo rendimiento y diseño de última generación con este producto en MiniMarketPlace. Diseñado bajo los más altos estándares de calidad para satisfacer todas tus necesidades cotidianas y profesionales.'}
            </p>

            {/* Add to Cart widget */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400 font-medium" style={{padding: '0.5rem' }}>
                  Cantidad
                </span>
                <div className="f_detail_qty_selector">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="f_detail_qty_btn"
                    disabled={!product.inStock}
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="f_detail_qty_btn"
                    disabled={!product.inStock}
                  style={{padding: '0.5rem' }}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-4 text-zinc-400">
                <span className="text-sm" style={{padding: '0.5rem' }}>Total del artículo</span>
                <span className="text-xl font-bold text-white" style={{padding: '0.5rem' }}>{fmt(product.price * quantity)}</span>
              </div>

              {product.inStock ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#28C064] hover:bg-[#1fa753] text-[#0A1A10] font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2 border-none"
                  style={{padding: '0.5rem' }}
                >
                  <ShoppingCart size={17} />
                  Agregar al Carrito
                </button>
              ) : (
                <button
                  className="w-full bg-zinc-800 text-zinc-500 font-bold py-3.5 rounded-xl cursor-not-allowed text-sm border-none"
                  disabled
                  style={{padding: '0.5rem' }}
                >
                  Sin Stock disponible
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── Similar Products section ── */}
        <section className="mt-16 border-t border-zinc-800 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white" style={{padding: '0.5rem' }}>Productos similares</h2>
              <p className="text-xs text-zinc-500" style={{padding: '0.5rem' }}>Podría interesarte</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel('left')}
                className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full border border-zinc-800 cursor-pointer text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full border border-zinc-800 cursor-pointer text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {loadingSimilar ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              Cargando sugerencias...
            </div>
          ) : (
            <div style={{padding: '1.5rem' }}className="f_similar_carousel" ref={carouselRef}>
              {listSimilar.map((item) => {
                return (
                  <div key={item.id} className="f_similar_card">
                    <Link to={`/productos/${item.id}`} className="block aspect-square bg-[#2A2A2A] overflow-hidden relative flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.nextSibling;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="product-img-placeholder flex items-center justify-center text-3xl" style={{ display: item.imageUrl ? 'none' : 'flex', width: '100%', height: '100%' }}>
                        📦
                      </div>
                    </Link>
                    <div style={{ padding: '0.75rem' }}className="p-3 flex flex-col gap-2">
                      <Link 
                        to={`/productos/${item.id}`} 
                        className="text-xs font-bold text-white leading-tight line-clamp-2 h-8 hover:text-[#28C064] transition-colors"
                        style={{ textDecoration: 'none' }}
                      >
                        {item.name}
                      </Link>
                      
                      <p className="text-sm font-black f_detail_price_accent">
                        {fmt(item.price)}
                      </p>
                      
                      <button 
                        onClick={() => addToCart(item, 1)}
                        className="f_similar_buy_btn"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
