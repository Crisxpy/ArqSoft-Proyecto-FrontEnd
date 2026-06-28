import { createContext, useContext, useState } from 'react';
import { Cart } from '../../domain/entities/Cart.js';
import { placeOrderUseCase } from '../../config/di.js';

// Context, no solo un hook con useState local - igual razon que useAuth:
// StorePage (/tienda) y ProductPage (/productos/:id) son rutas hermanas,
// no una anidada en la otra, asi que necesitan ver el MISMO carro. Antes
// de esto, agregar un producto desde la pagina de detalle no se reflejaba
// en /tienda porque cada uno tenia su propia instancia de useCart().
const CartContext = createContext(null);

// Pedidos de demostracion del mockup (antes se cargaban via seedOrders()
// al iniciar sesion en el App.jsx viejo). Se siembran una sola vez al
// montar el provider.
const DEMO_ORDERS = [
  {
    id: 'ORD-A4F2B1',
    date: '10/06/2026',
    status: 'delivered',
    items: [
      { name: 'Monitor 27"', qty: 1, price: 319990 },
      { name: 'Mouse inalámbrico', qty: 2, price: 24990 }
    ],
    total: 369970
  },
  {
    id: 'ORD-C9D3E8',
    date: '12/06/2026',
    status: 'shipped',
    items: [{ name: 'Notebook Pro 14"', qty: 1, price: 699990 }],
    total: 699990
  },
  {
    id: 'ORD-F1A0B3',
    date: '14/06/2026',
    status: 'processing',
    items: [
      { name: 'Silla ergonómica', qty: 1, price: 189990 },
      { name: 'Lámpara LED', qty: 2, price: 19990 }
    ],
    total: 229970
  }
];

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState({});
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [orderSuccessToken, setOrderSuccessToken] = useState('');

  const cart = Cart.fromState(cartState);

  const addToCart = (product, qty = 1) => {
    try {
      cart.addItem(product, qty);
      setCartState(cart.toState());
    } catch (err) {
      alert(err.message);
    }
  };

  const changeQty = (productId, delta) => {
    cart.changeQty(productId, delta);
    setCartState(cart.toState());
  };

  const removeItem = (productId) => {
    cart.removeItem(productId);
    setCartState(cart.toState());
  };

  const clearCart = () => {
    cart.clear();
    setCartState(cart.toState());
  };

  const placeOrder = async () => {
    if (cart.count === 0) return;
    try {
      const order = await placeOrderUseCase.execute(cart);
      setOrders((prev) => [order, ...prev]);
      setOrderSuccessToken(order.id);

      setTimeout(() => {
        cart.clear();
        setCartState(cart.toState());
        setOrderSuccessToken('');
      }, 1600);
    } catch (err) {
      alert('Error al generar pedido: ' + err.message);
    }
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const value = {
    cartState,
    cartCount: cart.count,
    orders,
    orderSuccessToken,
    addToCart,
    changeQty,
    removeItem,
    clearCart,
    placeOrder,
    clearOrders
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
}
