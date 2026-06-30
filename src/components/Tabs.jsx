import React from 'react';

export default function Tabs({ activeTab, onTabChange, isLoggedIn }) {
  if (!isLoggedIn) return null;

  return (
    <div className="tabs" id="main-tabs">
      <div
        className={`tab ${activeTab === 'inicio' ? 'active' : ''}`}
        onClick={() => onTabChange('inicio')}
        id="tab-inicio"
      >
        Inicio
      </div>
      <div
        className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => onTabChange('catalog')}
        id="tab-catalog"
      >
        Catálogo
      </div>
      <div
        className={`tab ${activeTab === 'cart' ? 'active' : ''}`}
        onClick={() => onTabChange('cart')}
        id="tab-cart"
      >
        Carrito
      </div>
      <div
        className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => onTabChange('orders')}
        id="tab-orders"
      >
        Mis pedidos
      </div>
    </div>
  );
}
