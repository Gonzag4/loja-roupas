import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

// Importar componentes
import Header from './components/Header';
import ProdutoCard from './components/ProdutoCard';
import Carrinho from './components/Carrinho';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import MinhaConta from './components/MinhaConta';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('loja');
  
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState(['Todos']);
  const [cupons, setCupons] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [imagemAtual, setImagemAtual] = useState({});
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [pedidos, setPedidos] = useState([]);

 const ADMIN_EMAIL = 'admin@admin.com';

  useEffect(() => {
    carregarProdutos();
    carregarCupons();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
      if (currentUser && currentUser.email !== ADMIN_EMAIL) {
        carregarPedidosUsuario(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const carregarProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const produtosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(produtosData);
      
      const cats = ['Todos', ...new Set(produtosData.map(p => p.categoria))];
      setCategorias(cats);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const carregarCupons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cupons'));
      const cuponsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCupons(cuponsData);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    }
  };

  const carregarPedidosUsuario = async (userId) => {
    try {
      const q = query(collection(db, 'pedidos'), where('userId', '==', userId), orderBy('data', 'desc'));
      const querySnapshot = await getDocs(q);
      const pedidosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const getEstoque = (produto, tamanho, cor) => {
    return produto.tamanhos?.[tamanho]?.[cor] || 0;
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
      setCarrinho([...carrinho, { ...produto, tamanho, cor, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (index) => {
    setCarrinho(carrinho.filter((_, i) => i !== index));
  };

  const aumentarQuantidade = (index) => {
    const item = carrinho[index];
    const produto = produtos.find(p => p.id === item.id);
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

  // Componente de Login Admin
  const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        setView('admin');
      } catch (error) {
        alert('Email ou senha incorretos!');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Login Administrativo
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition"
            >
              Entrar
            </button>
            
            <button
              type="button"
              onClick={() => setView('loja')}
              className="w-full text-gray-600 py-2 hover:text-gray-800"
            >
              Voltar à loja
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Renderização condicional das views
  if (view === 'loginAdmin') {
    return <LoginAdmin />;
  }

  if (view === 'admin' && isAdmin) {
    return (
      <AdminPanel 
        produtos={produtos}
        cupons={cupons}
        carregarProdutos={carregarProdutos}
        carregarCupons={carregarCupons}
        setView={setView}
      />
    );
  }

  if (view === 'checkout') {
    return (
      <Checkout 
        carrinho={carrinho}
        setView={setView}
        setCarrinho={setCarrinho}
        cupons={cupons}
        user={user}
      />
    );
  }

  if (view === 'minhaConta') {
    return (
      <MinhaConta 
        user={user}
        pedidos={pedidos}
        setView={setView}
      />
    );
  }

  // View principal da loja
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header 
        user={user}
        isAdmin={isAdmin}
        carrinho={carrinho}
        setView={setView}
        setCarrinhoAberto={setCarrinhoAberto}
      />

      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Coleção Nova Chegando! ✨</h2>
        <p className="text-pink-100">Peças exclusivas selecionadas especialmente para você</p>
      </div>

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none text-gray-800"
            />
          </div>
          
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
          
          <div className="mt-4 text-sm text-gray-600">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
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
                imagemAtual={imagemAtual}
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
      <Carrinho
        carrinhoAberto={carrinhoAberto}
        setCarrinhoAberto={setCarrinhoAberto}
        carrinho={carrinho}
        removerDoCarrinho={removerDoCarrinho}
        aumentarQuantidade={aumentarQuantidade}
        diminuirQuantidade={diminuirQuantidade}
        setView={setView}
      />
    </div>
  );
};

export default App;