'use client'

import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from 'react'
import { cartReducer, initialState, CartState, CartAction, CartItem } from './cart-reducer'

type CartContextType = CartState & {
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: (isOpen?: boolean) => void
  totalItems: number
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'granny-diets-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', payload: parsed })
        }
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage', e)
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    }
  }, [state.items, isHydrated])

  const totalItems = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  )

  // Actions
  const addItem = React.useCallback(
    (payload: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string }) => {
      dispatch({ type: 'ADD_ITEM', payload })
    },
    []
  )

  const removeItem = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = React.useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const toggleCart = React.useCallback((isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen })
  }, [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
