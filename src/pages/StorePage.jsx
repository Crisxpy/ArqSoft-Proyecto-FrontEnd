import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Tabs from '../components/Tabs';
import Catalog from '../components/Catalog';
import Cart from '../components/Cart';
import Orders from '../components/Orders';
import Footer from '../components/Footer';
import { useAuth } from '../adapters/hooks/useAuth.jsx';
import { useCart } from '../adapters/hooks/useCart.jsx';

// Tienda principal (catalogo/carro/pedidos). Requiere sesion iniciada -
// el guard de ruta vive en App.jsx (RequireAuth). El carro/pedidos vienen
// de CartProvider (Context) para compartir estado con ProductPage.
export default function StorePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    cartState,
    cartCount,
    orders,
    orderSuccessToken,
    addToCart,
    changeQty,
    removeItem,
    clearCart,
    placeOrder,
    clearOrders
  } = useCart();

  const handleLogout = () => {
    logout();
    clearCart();
    clearOrders();
    setSearch('');
    setPage(1);
    navigate('/');
  };

  const handleSearchChange = (query) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        cartCount={cartCount}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        search={search}
        onSearchChange={handleSearchChange}
        isLoggedIn={true}
      />

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} isLoggedIn={true} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'catalog' && (
          <Catalog
            search={search}
            cart={cartState}
            onAddToCart={addToCart}
            page={page}
            onPageChange={setPage}
          />
        )}
        {activeTab === 'cart' && (
          <Cart
            cart={cartState}
            onQtyChange={changeQty}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onPlaceOrder={placeOrder}
            orderSuccessToken={orderSuccessToken}
            onGoToCatalog={() => setActiveTab('catalog')}
          />
        )}
        {activeTab === 'orders' && <Orders orders={orders} error={false} />}
      </main>
      <Footer />
    </div>
  );
}
