import React from 'react';
import { X, Plus, Minus, Send, ShoppingCart } from 'lucide-react';

const Carrinho = ({ 
  carrinhoAberto, 
  setCarrinhoAberto, 
  carrinho, 
  removerDoCarrinho,
  aumentarQuantidade,
  diminuirQuantidade,
  setView
}) => {
  if (!carrinhoAberto) return null;

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={() => setCarrinhoAberto(false)} 
      />
      
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold">Meu Carrinho</h2>
          <button 
            onClick={() => setCarrinhoAberto(false)} 
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {carrinho.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {carrinho.map((item, index) => (
                <div key={index} className="bg-pink-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => removerDoCarrinho(index)}
                    className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-full transition"
                  >
                    <X size={18} />
                  </button>
                  
                  <h3 className="font-bold text-gray-800 pr-8">{item.nome}</h3>
                  <p className="text-sm text-gray-600">Tamanho: {item.tamanho} | Cor: {item.cor}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm text-gray-600 font-semibold">Quantidade:</span>
                    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm">
                      <button
                        onClick={() => diminuirQuantidade(index)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition text-pink-600"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-gray-800 w-8 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => aumentarQuantidade(index)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition text-pink-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-pink-600 font-bold mt-3">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between mb-4 text-xl font-bold">
              <span>Total:</span>
              <span className="text-pink-600">R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                setCarrinhoAberto(false);
                setView('checkout');
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Send size={20} />
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrinho;