import React, { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProdutoCard = ({ 
  produto, 
  imagemAtual, 
  proximaImagem, 
  imagemAnterior, 
  getEstoque, 
  adicionarAoCarrinho 
}) => {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  
  const imgAtual = imagemAtual[produto.id] || 0;
  const estoque = tamanhoSelecionado && corSelecionada 
    ? getEstoque(produto, tamanhoSelecionado, corSelecionada) 
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative group">
        <img 
          src={produto.imagens[imgAtual]} 
          alt={produto.nome} 
          className="w-full h-80 object-cover" 
        />
        
        {produto.imagens.length > 1 && (
          <>
            <button
              onClick={() => imagemAnterior(produto.id, produto.imagens.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={() => proximaImagem(produto.id, produto.imagens.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={24} className="text-gray-800" />
            </button>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {produto.imagens.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition ${
                    index === imgAtual ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{produto.nome}</h3>
        <p className="text-2xl font-bold text-pink-600 mb-4">R$ {produto.preco.toFixed(2)}</p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tamanho:</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(produto.tamanhos || {}).map(tamanho => (
              <button
                key={tamanho}
                onClick={() => setTamanhoSelecionado(tamanho)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  tamanhoSelecionado === tamanho
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tamanho}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cor:</label>
          <div className="flex gap-2 flex-wrap">
            {produto.cores.map(cor => (
              <button
                key={cor}
                onClick={() => setCorSelecionada(cor)}
                className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  corSelecionada === cor
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cor}
              </button>
            ))}
          </div>
        </div>

        {tamanhoSelecionado && corSelecionada && (
          <div className="mb-4">
            {estoque > 0 ? (
              <p className="text-green-600 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                {estoque} unidade{estoque > 1 ? 's' : ''} disponível{estoque > 1 ? 'is' : ''}
              </p>
            ) : (
              <p className="text-red-600 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full" />
                Indisponível
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            if (!tamanhoSelecionado || !corSelecionada) {
              alert('Por favor, selecione tamanho e cor!');
              return;
            }
            adicionarAoCarrinho(produto, tamanhoSelecionado, corSelecionada);
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-md"
        >
          <ShoppingCart size={20} />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;