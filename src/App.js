import React, { useState } from 'react';
import { ShoppingCart, X, ChevronLeft, ChevronRight, Instagram, Send, Search, Plus, Minus } from 'lucide-react';

// Dados de exemplo dos produtos
const produtosIniciais = [
  {
    id: 1,
    nome: "Vestido Floral Verão",
    categoria: "Vestidos",
    preco: 129.90,
    imagens: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612336307429-8c3d0c1a87c5?w=500&h=600&fit=crop"
    ],
    cores: ["Rosa", "Azul", "Branco"],
    tamanhos: {
      "P": { "Rosa": 3, "Azul": 0, "Branco": 2 },
      "M": { "Rosa": 5, "Azul": 4, "Branco": 3 },
      "G": { "Rosa": 2, "Azul": 1, "Branco": 0 }
    }
  },
  {
    id: 2,
    nome: "Blusa Básica Premium",
    categoria: "Blusas",
    preco: 79.90,
    imagens: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&h=600&fit=crop"
    ],
    cores: ["Preto", "Branco", "Cinza"],
    tamanhos: {
      "P": { "Preto": 8, "Branco": 5, "Cinza": 3 },
      "M": { "Preto": 10, "Branco": 7, "Cinza": 6 },
      "G": { "Preto": 4, "Branco": 2, "Cinza": 5 }
    }
  },
  {
    id: 3,
    nome: "Calça Jeans Skinny",
    categoria: "Calças",
    preco: 159.90,
    imagens: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop"
    ],
    cores: ["Azul Claro", "Azul Escuro", "Preto"],
    tamanhos: {
      "36": { "Azul Claro": 3, "Azul Escuro": 2, "Preto": 4 },
      "38": { "Azul Claro": 5, "Azul Escuro": 6, "Preto": 3 },
      "40": { "Azul Claro": 2, "Azul Escuro": 4, "Preto": 5 },
      "42": { "Azul Claro": 1, "Azul Escuro": 2, "Preto": 3 }
    }
  },
  {
    id: 4,
    nome: "Saia Midi Elegante",
    categoria: "Saias",
    preco: 99.90,
    imagens: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop"
    ],
    cores: ["Preto", "Vermelho", "Azul Marinho"],
    tamanhos: {
      "P": { "Preto": 4, "Vermelho": 2, "Azul Marinho": 3 },
      "M": { "Preto": 5, "Vermelho": 4, "Azul Marinho": 5 },
      "G": { "Preto": 3, "Vermelho": 2, "Azul Marinho": 2 }
    }
  },
  {
    id: 5,
    nome: "Vestido Longo Festa",
    categoria: "Vestidos",
    preco: 189.90,
    imagens: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop"
    ],
    cores: ["Vinho", "Preto", "Dourado"],
    tamanhos: {
      "P": { "Vinho": 2, "Preto": 3, "Dourado": 1 },
      "M": { "Vinho": 4, "Preto": 5, "Dourado": 2 },
      "G": { "Vinho": 2, "Preto": 3, "Dourado": 0 }
    }
  },
  {
    id: 6,
    nome: "Blusa Renda Delicada",
    categoria: "Blusas",
    preco: 89.90,
    imagens: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&h=600&fit=crop"
    ],
    cores: ["Branco", "Nude", "Preto"],
    tamanhos: {
      "P": { "Branco": 6, "Nude": 4, "Preto": 5 },
      "M": { "Branco": 8, "Nude": 6, "Preto": 7 },
      "G": { "Branco": 3, "Nude": 2, "Preto": 4 }
    }
  }
];

const App = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [imagemAtual, setImagemAtual] = useState({});
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const categorias = ['Todos', ...new Set(produtosIniciais.map(p => p.categoria))];

  const produtosFiltrados = produtosIniciais.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const getEstoque = (produto, tamanho, cor) => {
    return produto.tamanhos[tamanho]?.[cor] || 0;
  };

  const adicionarAoCarrinho = (produto, tamanho, cor) => {
    const estoque = getEstoque(produto, tamanho, cor);
    
    if (estoque === 0) {
      alert('Desculpe, este item está indisponível!');
      return;
    }

    const itemExistente = carrinho.find(
      item => item.id === produto.id && item.tamanho === tamanho && item.cor === cor
    );

    if (itemExistente) {
      if (itemExistente.quantidade >= estoque) {
        alert('Quantidade máxima em estoque atingida!');
        return;
      }
      setCarrinho(carrinho.map(item =>
        item.id === produto.id && item.tamanho === tamanho && item.cor === cor
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        ...produto,
        tamanho,
        cor,
        quantidade: 1
      }]);
    }
  };

  const removerDoCarrinho = (index) => {
    setCarrinho(carrinho.filter((_, i) => i !== index));
  };

  const aumentarQuantidade = (index) => {
    const item = carrinho[index];
    const produto = produtosIniciais.find(p => p.id === item.id);
    const estoqueDisponivel = getEstoque(produto, item.tamanho, item.cor);
    
    if (item.quantidade >= estoqueDisponivel) {
      alert('Quantidade máxima em estoque atingida!');
      return;
    }

    setCarrinho(carrinho.map((item, i) =>
      i === index ? { ...item, quantidade: item.quantidade + 1 } : item
    ));
  };

  const diminuirQuantidade = (index) => {
    const item = carrinho[index];
    
    if (item.quantidade === 1) {
      removerDoCarrinho(index);
    } else {
      setCarrinho(carrinho.map((item, i) =>
        i === index ? { ...item, quantidade: item.quantidade - 1 } : item
      ));
    }
  };

  const enviarParaWhatsApp = () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let mensagem = '*🛍️ Novo Pedido da Loja*\n\n';
    let total = 0;

    carrinho.forEach((item, index) => {
      mensagem += `*${index + 1}. ${item.nome}*\n`;
      mensagem += `   • Tamanho: ${item.tamanho}\n`;
      mensagem += `   • Cor: ${item.cor}\n`;
      mensagem += `   • Quantidade: ${item.quantidade}\n`;
      mensagem += `   • Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
      mensagem += `   • Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
      total += item.preco * item.quantidade;
    });

    mensagem += `*💰 TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += '_Aguardando confirmação de forma de pagamento_ 💳';

    const telefone = '5581999999999'; // ALTERE PARA O NÚMERO DA LOJA
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const proximaImagem = (produtoId, totalImagens) => {
    setImagemAtual(prev => ({
      ...prev,
      [produtoId]: ((prev[produtoId] || 0) + 1) % totalImagens
    }));
  };

  const imagemAnterior = (produtoId, totalImagens) => {
    setImagemAtual(prev => ({
      ...prev,
      [produtoId]: ((prev[produtoId] || 0) - 1 + totalImagens) % totalImagens
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
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
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
               className="text-pink-600 hover:text-pink-700 transition">
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
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Coleção Nova Chegando! ✨</h2>
        <p className="text-pink-100">Peças exclusivas selecionadas especialmente para você</p>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Barra de Busca */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition text-gray-800"
            />
          </div>

          {/* Filtro de Categorias */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Categorias:</label>
            <div className="flex gap-3 flex-wrap">
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaFiltro(categoria)}
                  className={`px-6 py-2 rounded-full font-semibold transition shadow-sm ${
                    categoriaFiltro === categoria
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">Nenhum produto encontrado</p>
            <p className="text-sm mt-2">Tente buscar por outro termo ou categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map(produto => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                imagemAtual={imagemAtual[produto.id] || 0}
                proximaImagem={proximaImagem}
                imagemAnterior={imagemAnterior}
                getEstoque={getEstoque}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            ))}
          </div>
        )}
      </main>

      {/* Carrinho Lateral */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setCarrinhoAberto(false)} />
          
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <h2 className="text-2xl font-bold">Meu Carrinho</h2>
              <button onClick={() => setCarrinhoAberto(false)} className="hover:bg-white/20 p-2 rounded-full transition">
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
                      
                      {/* Controles de Quantidade */}
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
                      
                      <p className="text-pink-600 font-bold mt-3">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-between mb-4 text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-pink-600">
                    R$ {carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={enviarParaWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <Send size={20} />
                  Enviar Pedido pelo WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProdutoCard = ({ produto, imagemAtual, proximaImagem, imagemAnterior, getEstoque, adicionarAoCarrinho }) => {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');

  const estoque = tamanhoSelecionado && corSelecionada 
    ? getEstoque(produto, tamanhoSelecionado, corSelecionada) 
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Carrossel de Imagens */}
      <div className="relative group">
        <img
          src={produto.imagens[imagemAtual]}
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
                    index === imagemAtual ? 'bg-white' : 'bg-white/50'
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

        {/* Seleção de Tamanho */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tamanho:</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(produto.tamanhos).map(tamanho => (
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

        {/* Seleção de Cor */}
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

        {/* Status de Estoque */}
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

export default App;