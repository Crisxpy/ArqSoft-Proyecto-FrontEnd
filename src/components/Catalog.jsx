import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';

export default function Catalog({ search, cart, onAddToCart, page, onPageChange }) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts({ q: search, page, pageSize: 6 })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.data);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, page]);

  if (loading) {
    return (
      <div className="page" id="page-catalog">
        <p>Cargando productos desde el BFF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" id="page-catalog">
        <p style={{ color: 'crimson' }}>Error al conectar con el BFF: {error}</p>
      </div>
    );
  }

  return (
    <div className="page" id="page-catalog">
      <div className="catalog-toolbar">
        <span id="result-count">
          {pagination.total} producto{pagination.total !== 1 ? 's' : ''} (vía {`/v1/products`} del BFF)
        </span>
      </div>

      <div className="product-grid" id="product-grid">
        {products.map((p) => {
          const inCart = cart[p.id]?.qty || 0;

          return (
            <div key={p.id} className="product-card">
              <div className="product-img" style={{ background: 'var(--color-background-secondary)' }}>
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span style={{ display: p.imageUrl ? 'none' : 'block' }}>📦</span>
              </div>
              <p className="product-name">{p.name}</p>
              <p className="product-cat">{p.category}</p>
              <p className="product-price">{fmt(p.price)}</p>
              {p.inStock ? (
                <span className="stock-badge stock-ok">Disponible</span>
              ) : (
                <span className="stock-badge stock-out">Sin stock</span>
              )}
              <div style={{ marginTop: '8px' }}>
                {!p.inStock ? (
                  <button className="btn btn-sm" style={{ width: '100%', opacity: 0.5 }} disabled>
                    Sin stock
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => onAddToCart(p)}
                  >
                    {inCart > 0 ? `En carrito (${inCart})` : 'Agregar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination" id="pagination">
          {pagination.hasPrev && (
            <div className="page-btn" onClick={() => onPageChange(page - 1)}>
              <i className="ti ti-chevron-left" aria-hidden="true"></i>
            </div>
          )}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`page-btn ${n === page ? 'active' : ''}`}
              onClick={() => onPageChange(n)}
            >
              {n}
            </div>
          ))}
          {pagination.hasNext && (
            <div className="page-btn" onClick={() => onPageChange(page + 1)}>
              <i className="ti ti-chevron-right" aria-hidden="true"></i>
            </div>
          )}
          <span className="page-info">
            Página {pagination.page} de {pagination.totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
