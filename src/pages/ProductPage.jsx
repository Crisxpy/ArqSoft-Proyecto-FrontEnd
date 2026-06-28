import React, { useEffect, useState } from 'react';
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
import { fetchProductById } from '../api';
import { useCart } from '../adapters/hooks/useCart.jsx';

// Pagina de detalle de producto. Diseno visual adaptado del aporte de
// Figma de un companero (rama ITEM_FIGMA) - se removio todo lo que ahi
// era inventado (rating/reviews fijos, descuento fabricado, fotos de
// stock de Unsplash sin relacion al producto, "productos similares"
// hardcodeados). Lo que se muestra aqui es 100% lo que devuelve
// GET /v1/products/{id} del BFF - si un producto no tiene mas de una
// imagen real, simplemente no se muestran miniaturas falsas.
export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveImage(0);
    setQuantity(1);
    setImageFailed(false);

    fetchProductById(id)
      .then((data) => !cancelled && setProduct(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page" style={{ padding: '24px' }}>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page" style={{ padding: '24px' }}>
        <Link to="/tienda">&larr; Volver al catálogo</Link>
        <p style={{ color: 'crimson', marginTop: '12px' }}>
          Error al cargar el producto: {error || 'no encontrado'}
        </p>
      </div>
    );
  }

  // Imagenes reales del producto (G3 vía BFF). Sin fallback inventado -
  // si no hay ninguna, se muestra el placeholder de siempre.
  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasGallery = images.length > 1;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          to="/tienda"
          className="flex items-center gap-1 bg-secondary hover:bg-card text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
        >
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>
        <span className="text-border">/</span>
        <span className="text-primary truncate max-w-[200px]">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="md:grid md:grid-cols-[55%_45%] md:gap-10 md:items-start">
          {/* Galeria - solo imagenes reales */}
          <div className="md:sticky md:top-4">
            <div className="relative bg-secondary rounded-xl overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center">
              {images.length > 0 && !imageFailed ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span style={{ fontSize: '64px' }}>📦</span>
              )}

              {hasGallery && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 p-1.5 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 p-1.5 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {hasGallery && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => {
                      setActiveImage(i);
                      setImageFailed(false);
                    }}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden bg-secondary border-2 ${
                      activeImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle - 100% datos reales del BFF */}
          <div className="mt-6 md:mt-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                {product.category || 'Sin categoría'}
              </span>
              <button
                className="text-muted-foreground hover:text-foreground p-1"
                title="Compartir (no implementado todavía)"
              >
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{product.name}</h1>

            <span className="text-3xl font-extrabold">{fmt(product.price)}</span>

            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle size={15} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Disponible</span>
                  {typeof product.stock === 'number' && (
                    <span className="text-sm text-muted-foreground">({product.stock} en stock)</span>
                  )}
                </>
              ) : (
                <>
                  <XCircle size={15} className="text-destructive" />
                  <span className="text-sm font-medium text-destructive">Sin stock</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || 'Sin descripción disponible.'}
            </p>

            <div className="flex flex-col gap-3 bg-card border border-border rounded-xl p-4 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Cantidad</span>
                <div className="flex items-center gap-3 bg-secondary rounded-lg px-1 py-0.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total</span>
                <span className="font-bold text-foreground text-base">{fmt(product.price * quantity)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full text-primary-foreground font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 ${
                  product.inStock ? 'bg-primary hover:opacity-90' : 'bg-muted cursor-not-allowed opacity-50'
                }`}
              >
                <ShoppingCart size={17} />
                Agregar al carrito
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1"
              >
                <Heart size={15} className={wishlist ? 'fill-primary text-primary' : ''} />
                {wishlist ? 'Guardado en favoritos' : 'Guardar en favoritos'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
