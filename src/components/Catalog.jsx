import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../adapters/hooks/useCatalog.js';

export default function Catalog({ search, cart, onAddToCart, page, onPageChange, initialCategory = 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const { products, pagination, loading, error } = useCatalog(search, page);

  const fmt = (n) => '$' + n.toLocaleString('es-CL');

  // Filtrado local interactivo para potenciar el Mockup
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStock = !onlyInStock || p.inStock;
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesStock && matchesPrice;
  });

  if (loading) {
    return (
      <div className="page" id="page-catalog">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando catálogo desde el BFF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" id="page-catalog">
        <div className="error-card">
          <i className="ti ti-alert-triangle" style={{ fontSize: '48px', color: 'var(--color-text-danger)' }} aria-hidden="true"></i>
          <p style={{ color: 'var(--color-text-danger)', fontWeight: '500', marginTop: '12px' }}>
            Error al conectar con el BFF: {error}
          </p>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'Todos los Productos', icon: 'ti-apps' },
    { id: 'Electrónica', name: 'Electrónica', icon: 'ti-device-tv' },
    { id: 'Hogar', name: 'Hogar y Electro', icon: 'ti-home' },
    { id: 'Herramientas', name: 'Herramientas', icon: 'ti-tool' },
    { id: 'Tecnología', name: 'Tecnología', icon: 'ti-cpu' }
  ];

  return (
    <div className="catalog-container">
      {/* Sidebar de Filtros (Estilo PC Factory) */}
      <aside className="catalog-sidebar">
        <div className="sidebar-section">
          <h3>Categorías</h3>
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={selectedCategory === cat.id ? 'active' : ''}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={`ti ${cat.icon}`} aria-hidden="true"></i>
                <span>{cat.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Filtros de Precio</h3>
          <div className="price-filter">
            <label htmlFor="price-slider" className="price-label">Precio Máximo: <strong>{fmt(maxPrice)}</strong></label>
            <input
              id="price-slider"
              type="range"
              min="10000"
              max="1000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-inputs">
              <span>$10.000</span>
              <span>$1.000.000</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Disponibilidad</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
            />
            <span className="slider round"></span>
            <span className="toggle-label">Solo con Stock</span>
          </label>
        </div>
      </aside>

      {/* Grid de Productos y Contenido */}
      <main className="catalog-main">
        <div className="catalog-toolbar">
          <span id="result-count">
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{pagination?.total || 0}</strong> productos (vía BFF)
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <i className="ti ti-search-off" aria-hidden="true"></i>
            <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="product-grid" id="product-grid">
            {filteredProducts.map((p) => {
              const inCart = cart[p.id]?.qty || 0;

              return (
                <div key={p.id} className="product-card">
                  <Link to={`/productos/${p.id}`} className="product-img">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.nextSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="product-img-placeholder" style={{ display: p.imageUrl ? 'none' : 'flex' }}>
                      📦
                    </div>
                  </Link>
                  <div className="product-info">
                    <p className="product-cat">{p.category}</p>
                    <Link to={`/productos/${p.id}`} className="product-name" title={p.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {p.name}
                    </Link>
                    <p className="product-price">{fmt(p.price)}</p>
                    <div className="stock-wrapper">
                      {p.inStock ? (
                        <span className="stock-badge stock-ok"><i className="ti ti-circle-check" aria-hidden="true"></i> Disponible</span>
                      ) : (
                        <span className="stock-badge stock-out"><i className="ti ti-circle-x" aria-hidden="true"></i> Sin stock</span>
                      )}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      {!p.inStock ? (
                        <button className="btn btn-sm btn-disabled" style={{ width: '100%' }} disabled>
                          Sin stock
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => onAddToCart(p)}
                        >
                          {inCart > 0 ? (
                            <>
                              <i className="ti ti-shopping-cart-check" aria-hidden="true"></i> En carrito ({inCart})
                            </>
                          ) : (
                            <>
                              <i className="ti ti-shopping-cart-plus" aria-hidden="true"></i> Comprar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination?.totalPages > 1 && (
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
      </main>
    </div>
  );
}
