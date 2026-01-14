import React from 'react';
import { Instagram, ShoppingCart, User, Package } from 'lucide-react';

const Header = ({ 
  user, 
  isAdmin, 
  carrinho, 
  setView, 
  setCarrinhoAberto 
}) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setView('loja')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Loja Elegante
            </h1>
            <p className="text-xs text-gray-500">Moda feminina com estilo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && !isAdmin && (
            <button 
              onClick={() => setView('minhaConta')} 
              className="text-pink-600 hover:text-pink-700 transition"
            >
              <User size={24} />
            </button>
          )}
          
          {isAdmin && (
            <button 
              onClick={() => setView('admin')} 
              className="text-purple-600 hover:text-purple-700 transition"
            >
              <Package size={24} />
            </button>
          )}
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-700 transition"
          >
            <Instagram size={24} />
          </a>
          
          <button 
            onClick={() => setCarrinhoAberto(true)} 
            className="relative p-2 hover:bg-pink-50 rounded-full transition"
          >
            <ShoppingCart size={24} className="text-pink-600" />
            {carrinho.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {carrinho.length}
              </span>
            )}
          </button>
          
          {!isAdmin && (
            <button 
              onClick={() => setView('loginAdmin')} 
              className="text-sm text-gray-600 hover:text-gray-800 transition"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;