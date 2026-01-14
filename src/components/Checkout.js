import React, { useState } from 'react';
import { ArrowLeft, Send, Tag } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Checkout = ({ 
  carrinho, 
  setView, 
  setCarrinho,
  cupons,
  user
}) => {
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
    formaPagamento: '',
    cupomAplicado: null
  });
  
  const [cupomInput, setCupomInput] = useState('');
  const [etapa, setEtapa] = useState(1); // 1: dados, 2: endereço, 3: pagamento, 4: confirmação

  const aplicarCupom = () => {
    const cupom = cupons.find(c => c.codigo.toUpperCase() === cupomInput.toUpperCase() && c.ativo);
    if (cupom) {
      setDadosCliente({ ...dadosCliente, cupomAplicado: cupom });
      alert(`Cupom aplicado! ${cupom.desconto}% de desconto`);
    } else {
      alert('Cupom inválido!');
    }
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    const desconto = dadosCliente.cupomAplicado ? (subtotal * dadosCliente.cupomAplicado.desconto / 100) : 0;
    return { subtotal, desconto, total: subtotal - desconto };
  };

  const finalizarPedido = async () => {
    if (!dadosCliente.nome || !dadosCliente.telefone || !dadosCliente.endereco || !dadosCliente.formaPagamento) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const { subtotal, desconto, total } = calcularTotal();

    // Salvar pedido no Firebase
    const pedido = {
      userId: user?.uid || 'anonimo',
      cliente: dadosCliente,
      itens: carrinho,
      subtotal,
      desconto,
      total,
      data: new Date().toISOString(),
      status: 'Pendente'
    };

    await addDoc(collection(db, 'pedidos'), pedido);

    // Enviar para WhatsApp
    let mensagem = '*🛍️ Novo Pedido da Loja*\n\n';
    mensagem += `*📱 Cliente:* ${dadosCliente.nome}\n`;
    mensagem += `*📞 Telefone:* ${dadosCliente.telefone}\n\n`;
    mensagem += `*📍 Endereço:*\n${dadosCliente.endereco}\n${dadosCliente.bairro}, ${dadosCliente.cidade} - ${dadosCliente.estado}\nCEP: ${dadosCliente.cep}\n`;
    if (dadosCliente.complemento) mensagem += `Complemento: ${dadosCliente.complemento}\n`;
    mensagem += `\n*🛒 Itens do Pedido:*\n\n`;

    carrinho.forEach((item, index) => {
      mensagem += `*${index + 1}. ${item.nome}*\n`;
      mensagem += `   • Tamanho: ${item.tamanho}\n`;
      mensagem += `   • Cor: ${item.cor}\n`;
      mensagem += `   • Quantidade: ${item.quantidade}\n`;
      mensagem += `   • Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
      mensagem += `   • Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
    });

    if (desconto > 0) {
      mensagem += `*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
      mensagem += `*Desconto (${dadosCliente.cupomAplicado.codigo}):* -R$ ${desconto.toFixed(2)}\n`;
    }
    mensagem += `\n*💰 TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += `*💳 Forma de Pagamento:* ${dadosCliente.formaPagamento}`;

    const telefone = '5581999999999'; // ALTERE PARA O NÚMERO DA LOJA
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    setCarrinho([]);
    setView('loja');
    alert('Pedido enviado com sucesso!');
  };

  const { subtotal, desconto, total } = calcularTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <button
          onClick={() => setView('loja')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Voltar para a loja
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Finalizar Pedido
          </h2>

          {/* Indicador de etapas */}
          <div className="flex justify-between mb-8">
            {['Dados', 'Endereço', 'Pagamento', 'Confirmar'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold ${
                  etapa > idx ? 'bg-green-500 text-white' : etapa === idx + 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <p className="text-xs mt-2 text-gray-600">{label}</p>
              </div>
            ))}
          </div>

          {/* Etapa 1: Dados pessoais */}
          {etapa === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Seus Dados</h3>
              <input
                type="text"
                placeholder="Nome completo *"
                value={dadosCliente.nome}
                onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Telefone (com DDD) *"
                value={dadosCliente.telefone}
                onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                required
              />
              <button
                onClick={() => setEtapa(2)}
                disabled={!dadosCliente.nome || !dadosCliente.telefone}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Etapa 2: Endereço */}
          {etapa === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Endereço de Entrega</h3>
              <input
                type="text"
                placeholder="CEP *"
                value={dadosCliente.cep}
                onChange={(e) => setDadosCliente({ ...dadosCliente, cep: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Endereço (Rua, número) *"
                value={dadosCliente.endereco}
                onChange={(e) => setDadosCliente({ ...dadosCliente, endereco: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Bairro *"
                value={dadosCliente.bairro}
                onChange={(e) => setDadosCliente({ ...dadosCliente, bairro: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Cidade *"
                  value={dadosCliente.cidade}
                  onChange={(e) => setDadosCliente({ ...dadosCliente, cidade: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Estado *"
                  value={dadosCliente.estado}
                  onChange={(e) => setDadosCliente({ ...dadosCliente, estado: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Complemento (opcional)"
                value={dadosCliente.complemento}
                onChange={(e) => setDadosCliente({ ...dadosCliente, complemento: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setEtapa(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setEtapa(3)}
                  disabled={!dadosCliente.endereco || !dadosCliente.bairro || !dadosCliente.cidade || !dadosCliente.estado || !dadosCliente.cep}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Etapa 3: Pagamento */}
          {etapa === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Forma de Pagamento</h3>
              
              <div className="bg-pink-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Nota:</strong> O pagamento será confirmado no WhatsApp após o envio do pedido.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={18} className="text-pink-600" />
                  <span className="font-semibold text-gray-800">Tem um cupom?</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código do cupom"
                    value={cupomInput}
                    onChange={(e) => setCupomInput(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    onClick={aplicarCupom}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
                  >
                    Aplicar
                  </button>
                </div>
                {dadosCliente.cupomAplicado && (
                  <p className="text-green-600 font-semibold mt-2">
                    ✅ Cupom "{dadosCliente.cupomAplicado.codigo}" aplicado! {dadosCliente.cupomAplicado.desconto}% de desconto
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito'].map((forma) => (
                  <button
                    key={forma}
                    onClick={() => setDadosCliente({ ...dadosCliente, formaPagamento: forma })}
                    className={`w-full p-4 border-2 rounded-lg font-semibold transition ${
                      dadosCliente.formaPagamento === forma
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {forma}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEtapa(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setEtapa(4)}
                  disabled={!dadosCliente.formaPagamento}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Confirmação */}
          {etapa === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirme seu Pedido</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Dados do Cliente:</h4>
                <p className="text-gray-700">{dadosCliente.nome}</p>
                <p className="text-gray-700">{dadosCliente.telefone}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Endereço de Entrega:</h4>
                <p className="text-gray-700">{dadosCliente.endereco}</p>
                <p className="text-gray-700">{dadosCliente.bairro}, {dadosCliente.cidade} - {dadosCliente.estado}</p>
                <p className="text-gray-700">CEP: {dadosCliente.cep}</p>
                {dadosCliente.complemento && <p className="text-gray-700">Complemento: {dadosCliente.complemento}</p>}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">Itens do Pedido:</h4>
                {carrinho.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.nome}</p>
                      <p className="text-sm text-gray-600">
                        {item.tamanho} | {item.cor} | Qtd: {item.quantidade}
                      </p>
                    </div>
                    <p className="font-bold text-pink-600">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-pink-50 rounded-lg p-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-800">R$ {subtotal.toFixed(2)}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Desconto ({dadosCliente.cupomAplicado.codigo}):</span>
                    <span className="font-semibold">-R$ {desconto.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t-2 border-pink-200 mt-2 pt-2">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">R$ {total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Forma de pagamento:</strong> {dadosCliente.formaPagamento}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEtapa(3)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizarPedido}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <Send size={20} />
                  Enviar Pedido pelo WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;