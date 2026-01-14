import React, { useState } from 'react';
import { Package, Tag, LogOut, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

const AdminPanel = ({ 
  produtos, 
  cupons, 
  carregarProdutos, 
  carregarCupons,
  setView 
}) => {
  const [adminView, setAdminView] = useState('produtos');
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    preco: '',
    categoria: '',
    imagens: [''],
    cores: [''],
    tamanhos: {}
  });
  const [novoCupom, setNovoCupom] = useState({
    codigo: '',
    desconto: '',
    ativo: true
  });

  const handleLogout = async () => {
    await signOut(auth);
    setView('loja');
  };

  const adicionarImagemInput = () => {
    setNovoProduto({ ...novoProduto, imagens: [...novoProduto.imagens, ''] });
  };

  const atualizarImagem = (index, valor) => {
    const novasImagens = [...novoProduto.imagens];
    novasImagens[index] = valor;
    setNovoProduto({ ...novoProduto, imagens: novasImagens });
  };

  const removerImagem = (index) => {
    const novasImagens = novoProduto.imagens.filter((_, i) => i !== index);
    setNovoProduto({ ...novoProduto, imagens: novasImagens });
  };

  const adicionarCorInput = () => {
    setNovoProduto({ ...novoProduto, cores: [...novoProduto.cores, ''] });
  };

  const atualizarCor = (index, valor) => {
    const novasCores = [...novoProduto.cores];
    novasCores[index] = valor;
    setNovoProduto({ ...novoProduto, cores: novasCores });
  };

  const removerCor = (index) => {
    const novasCores = novoProduto.cores.filter((_, i) => i !== index);
    setNovoProduto({ ...novoProduto, cores: novasCores });
  };

  const adicionarTamanho = (tamanho) => {
    if (!novoProduto.tamanhos[tamanho]) {
      const novosTamanhos = { ...novoProduto.tamanhos };
      novosTamanhos[tamanho] = {};
      novoProduto.cores.filter(c => c.trim() !== '').forEach(cor => {
        novosTamanhos[tamanho][cor] = 0;
      });
      setNovoProduto({ ...novoProduto, tamanhos: novosTamanhos });
    }
  };

  const atualizarEstoque = (tamanho, cor, quantidade) => {
    const novosTamanhos = { ...novoProduto.tamanhos };
    if (!novosTamanhos[tamanho]) novosTamanhos[tamanho] = {};
    novosTamanhos[tamanho][cor] = parseInt(quantidade) || 0;
    setNovoProduto({ ...novoProduto, tamanhos: novosTamanhos });
  };

  const removerTamanho = (tamanho) => {
    const novosTamanhos = { ...novoProduto.tamanhos };
    delete novosTamanhos[tamanho];
    setNovoProduto({ ...novoProduto, tamanhos: novosTamanhos });
  };

  const salvarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria) {
      alert('Preencha todos os campos obrigatórios (nome, preço e categoria)!');
      return;
    }

    const produtoData = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco),
      imagens: novoProduto.imagens.filter(img => img.trim() !== ''),
      cores: novoProduto.cores.filter(cor => cor.trim() !== '')
    };

    if (editandoProduto) {
      await updateDoc(doc(db, 'produtos', editandoProduto.id), produtoData);
      alert('Produto atualizado com sucesso!');
    } else {
      await addDoc(collection(db, 'produtos'), produtoData);
      alert('Produto criado com sucesso!');
    }

    setNovoProduto({ nome: '', preco: '', categoria: '', imagens: [''], cores: [''], tamanhos: {} });
    setEditandoProduto(null);
    carregarProdutos();
  };

  const editarProduto = (produto) => {
    setNovoProduto(produto);
    setEditandoProduto(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirProduto = async (id) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      await deleteDoc(doc(db, 'produtos', id));
      alert('Produto excluído!');
      carregarProdutos();
    }
  };

  const salvarCupom = async () => {
    if (!novoCupom.codigo || !novoCupom.desconto) {
      alert('Preencha todos os campos!');
      return;
    }

    await addDoc(collection(db, 'cupons'), {
      ...novoCupom,
      desconto: parseFloat(novoCupom.desconto)
    });

    setNovoCupom({ codigo: '', desconto: '', ativo: true });
    carregarCupons();
    alert('Cupom criado com sucesso!');
  };

  const toggleCupom = async (cupom) => {
    await updateDoc(doc(db, 'cupons', cupom.id), { ativo: !cupom.ativo });
    carregarCupons();
  };

  const excluirCupom = async (id) => {
    if (window.confirm('Deseja realmente excluir este cupom?')) {
      await deleteDoc(doc(db, 'cupons', id));
      alert('Cupom excluído!');
      carregarCupons();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-purple-100 text-sm">Gerenciar Loja</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('loja')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
            >
              Ver Loja
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navegação Admin */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setAdminView('produtos')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition border-b-4 ${
                adminView === 'produtos'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package size={20} />
              Produtos
            </button>
            <button
              onClick={() => setAdminView('cupons')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition border-b-4 ${
                adminView === 'cupons'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Tag size={20} />
              Cupons
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Seção de Produtos */}
        {adminView === 'produtos' && (
          <div className="space-y-8">
            {/* Formulário de Produto */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editandoProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do Produto *"
                    value={novoProduto.nome}
                    onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço *"
                    value={novoProduto.preco}
                    onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Categoria *"
                  value={novoProduto.categoria}
                  onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />

                {/* URLs das Imagens */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URLs das Imagens (Imgur, Google Drive, etc):
                  </label>
                  {novoProduto.imagens.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder={`URL da imagem ${index + 1}`}
                        value={img}
                        onChange={(e) => atualizarImagem(index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                      {novoProduto.imagens.length > 1 && (
                        <button
                          onClick={() => removerImagem(index)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={adicionarImagemInput}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition font-semibold"
                  >
                    <Plus size={18} />
                    Adicionar Imagem
                  </button>
                </div>

                {/* Cores */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cores Disponíveis:
                  </label>
                  {novoProduto.cores.map((cor, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`Cor ${index + 1}`}
                        value={cor}
                        onChange={(e) => atualizarCor(index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                      {novoProduto.cores.length > 1 && (
                        <button
                          onClick={() => removerCor(index)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={adicionarCorInput}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition font-semibold"
                  >
                    <Plus size={18} />
                    Adicionar Cor
                  </button>
                </div>

                {/* Tamanhos e Estoque */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tamanhos e Estoque:
                  </label>
                  <div className="flex gap-2 mb-4">
                    {['P', 'M', 'G', 'GG', '36', '38', '40', '42', '44'].map(tam => (
                      <button
                        key={tam}
                        onClick={() => adicionarTamanho(tam)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          novoProduto.tamanhos[tam]
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tam}
                      </button>
                    ))}
                  </div>

                  {Object.keys(novoProduto.tamanhos).map(tamanho => (
                    <div key={tamanho} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-gray-800">Tamanho: {tamanho}</h4>
                        <button
                          onClick={() => removerTamanho(tamanho)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {novoProduto.cores.filter(c => c.trim() !== '').map(cor => (
                          <div key={cor}>
                            <label className="block text-xs text-gray-600 mb-1">{cor}</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="Qtd"
                              value={novoProduto.tamanhos[tamanho]?.[cor] || 0}
                              onChange={(e) => atualizarEstoque(tamanho, cor, e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  {editandoProduto && (
                    <button
                      onClick={() => {
                        setNovoProduto({ nome: '', preco: '', categoria: '', imagens: [''], cores: [''], tamanhos: {} });
                        setEditandoProduto(null);
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={salvarProduto}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    {editandoProduto ? 'Atualizar Produto' : 'Salvar Produto'}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Cadastrados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map(produto => (
                  <div key={produto.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                    <img 
                      src={produto.imagens[0]} 
                      alt={produto.nome} 
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-bold text-gray-800 mb-1">{produto.nome}</h3>
                    <p className="text-purple-600 font-bold mb-2">R$ {produto.preco.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mb-3">Categoria: {produto.categoria}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarProduto(produto)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => excluirProduto(produto.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seção de Cupons */}
        {adminView === 'cupons' && (
          <div className="space-y-8">
            {/* Formulário de Cupom */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Cupom</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Código do Cupom (ex: VERÃO2026)"
                  value={novoCupom.codigo}
                  onChange={(e) => setNovoCupom({ ...novoCupom, codigo: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Desconto (%)"
                  value={novoCupom.desconto}
                  onChange={(e) => setNovoCupom({ ...novoCupom, desconto: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={salvarCupom}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Criar Cupom
                </button>
              </div>
            </div>

            {/* Lista de Cupons */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Cupons Cadastrados</h2>
              <div className="space-y-4">
                {cupons.map(cupom => (
                  <div key={cupom.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{cupom.codigo}</h3>
                      <p className="text-purple-600 font-semibold">{cupom.desconto}% de desconto</p>
                      <p className={`text-sm ${cupom.ativo ? 'text-green-600' : 'text-red-600'}`}>
                        {cupom.ativo ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCupom(cupom)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                          cupom.ativo
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {cupom.ativo ? <EyeOff size={16} /> : <Eye size={16} />}
                        {cupom.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => excluirCupom(cupom.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;