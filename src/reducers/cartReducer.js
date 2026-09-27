// src/reducers/cartReducer.js
export const initialState = {
  items: [],
  promoCode: '',
  discountPercent: 0,
  error: null,
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        // Agar item pehle se cart mein hai toh quantity barha do
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      } else {
        // Naya item add karo quantity 1 aur note ke sath
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1, note: '' }],
        };
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    }

    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }

    case 'DECREMENT': {
      return {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0), // Quantity 0 hone par remove kar do
      };
    }

    case 'UPDATE_NOTE': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, note: action.payload.note } : item
        ),
      };
    }

    case 'APPLY_PROMO': {
      const codes = {
        WELCOME10: 10,
        FEAST20: 20,
      };
      const upperCode = action.payload.toUpperCase();
      if (codes[upperCode]) {
        return {
          ...state,
          promoCode: upperCode,
          discountPercent: codes[upperCode],
          error: null,
        };
      } else {
        return { ...state, error: 'Invalid Promo Code' };
      }
    }

    case 'REMOVE_PROMO': {
      return { ...state, promoCode: '', discountPercent: 0, error: null };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
};