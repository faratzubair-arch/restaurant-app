// src/context/CartContext.js
import React, { createContext, useReducer, useContext } from 'react';
import { cartReducer, initialState } from '../reducers/cartReducer';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions for easy dispatching
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const increment = (id) => dispatch({ type: 'INCREMENT', payload: { id } });
  const decrement = (id) => dispatch({ type: 'DECREMENT', payload: { id } });
  const updateNote = (id, note) => dispatch({ type: 'UPDATE_NOTE', payload: { id, note } });
  const applyPromo = (code) => dispatch({ type: 'APPLY_PROMO', payload: code });
  const removePromo = () => dispatch({ type: 'REMOVE_PROMO' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        increment,
        decrement,
        updateNote,
        applyPromo,
        removePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};