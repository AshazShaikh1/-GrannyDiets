'use client'

import * as React from 'react'
import { Leaf, Info } from 'lucide-react'

interface ProductDetailsTabsProps {
  productName: string;
}

const getProductData = (name: string) => {
  const normalized = name.toLowerCase();
  
  if (normalized.includes('mango pickle') || normalized.includes('aam ka achar')) {
    return {
      ingredients: [
        'Raw Mango', 'Yellow Mustard Oil & seeds', 'Fennel Seeds', 'Fenugreek seeds', 
        'Black Mustard seeds', 'Red Chilli', 'Salt', 'Turmeric Powder', 
        'Coriander Powder', 'Cumin Powder', 'Asafaetida', 'Nigella seeds'
      ],
      taste: { spicy: 'Medium', sweet: 'Not', sour: 'Medium' }
    }
  }
  
  if (normalized.includes('garlic sauce') || normalized.includes('लहसुन की चटनी') || normalized.includes('garlic')) {
    return {
      ingredients: [
        'Garlic', 'Mustard Oil', 'Black Seeds', 'Black Salt', 'Red Chilli', 
        'Fenugreek', 'Carom', 'Coriander Powder', 'Nigella Seeds', 'Cumin', 
        'Salt', 'Amchoor', 'Turmeric'
      ],
      taste: { spicy: 'High', sweet: 'No', sour: 'Low' }
    }
  }
  
  if (normalized.includes('lemon pickle') || normalized.includes('नींबू का अचार') || normalized.includes('lemon')) {
    return {
      ingredients: ['Lemon', 'Black Salt', 'Red Chilli', 'Suger', 'Cumin Powder & Spices'],
      taste: { spicy: 'Medium', sweet: 'Not', sour: 'Medium' },
      note: '💡 Our lemon pickle pairs Perfectly with your Favorite Parathas.'
    }
  }
  
  if (normalized.includes('green chilli') || normalized.includes('hari mirch') || normalized.includes('chilli')) {
    return {
      ingredients: ['Green Chillies', 'Salt', 'Mustard oil & Seeds', 'Turmeric Powder', 'Coriander Powder', 'Cumin'],
      taste: { spicy: 'Medium', sweet: 'Not', sour: 'Medium' }
    }
  }
  
  if (normalized.includes('amla') || normalized.includes('आंवले')) {
    return {
      ingredients: [
        'Amla (Gooseberry)', 'Red Chilli Powder', 'Turmeric Powder', 'Mustard Seeds', 
        'Mustard Oil', 'Black Mustard Seeds', 'Fennel Seeds', 'Salt', 'Nigella Seeds', 
        'Coriander Powder'
      ],
      taste: { spicy: 'Medium', sweet: 'Not', sour: 'High' }
    }
  }
  
  return {
    ingredients: ['Fresh seasonal ingredients', 'Traditional Spices', 'Mustard Oil', 'Salt'],
    taste: { spicy: 'Medium', sweet: 'Low', sour: 'Medium' }
  }
}

export function ProductDetailsTabs({ productName }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = React.useState('ingredients')
  const data = getProductData(productName)

  const tabs = [
    { id: 'ingredients', label: 'INGREDIENTS' },
    { id: 'taste', label: 'TEXTURE & TASTE' },
    { id: 'shelf', label: 'SHELF LIFE' },
  ]

  return (
    <div className="mt-16 bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-wrap border-b border-border bg-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-sm font-semibold tracking-wider text-center border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-8">
        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <Leaf className="w-5 h-5 text-secondary shrink-0" />
                  <span className="font-medium">{ing}</span>
                </li>
              ))}
            </ul>
            {data.note && (
              <div className="mt-6 bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-primary font-medium">{data.note}</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'taste' && (
          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <span className="block text-sm text-text-muted mb-2 uppercase tracking-wider font-semibold">Spiciness</span>
              <span className="text-xl font-bold text-error">{data.taste.spicy}</span>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <span className="block text-sm text-text-muted mb-2 uppercase tracking-wider font-semibold">Sweetness</span>
              <span className="text-xl font-bold text-success">{data.taste.sweet}</span>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6 text-center">
              <span className="block text-sm text-text-muted mb-2 uppercase tracking-wider font-semibold">Sourness</span>
              <span className="text-xl font-bold text-primary">{data.taste.sour}</span>
            </div>
          </div>
        )}
        
        {activeTab === 'shelf' && (
          <div className="max-w-2xl text-text-secondary leading-relaxed space-y-4 text-lg">
            <p>
              <strong className="text-text-primary">Shelf Life:</strong> 12 months from the date of packaging.
            </p>
            <p>
              For best results and to preserve the authentic flavor, please store in a cool, dry place. Always use a clean and dry spoon to serve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
