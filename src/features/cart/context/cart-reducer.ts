export type CartItem = {
  id: string // This will now act as a unique cart item ID (e.g. productId_variantId)
  productId: string
  variantId?: string
  variantName?: string
  name: string
  slug: string
  image: string
  price: number
  quantity: number
}

export type CartState = {
  items: CartItem[]
  isOpen: boolean
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'HYDRATE'; payload: CartItem[] }

export const initialState: CartState = {
  items: [],
  isOpen: false,
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Generate a unique ID if one isn't provided. This allows variants to exist separately.
      const uniqueId = action.payload.id || `${action.payload.productId}${action.payload.variantId ? `_${action.payload.variantId}` : ''}`
      const existingItemIndex = state.items.findIndex((i) => i.id === uniqueId)
      const quantityToAdd = action.payload.quantity || 1

      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += quantityToAdd
        return { ...state, items: newItems, isOpen: true }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, id: uniqueId, quantity: quantityToAdd } as CartItem],
        isOpen: true,
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        ),
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      }
    case 'HYDRATE':
      return {
        ...state,
        items: action.payload,
      }
    default:
      return state
  }
}
