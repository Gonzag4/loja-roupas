import React from 'react';
import { ArrowLeft, Package, Clock } from 'lucide-react';

const MinhaConta = ({ user, pedidos, setView }) => {
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
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Minha Conta</h2>
              <p className="text-gray-600">{user?.email || 'Cliente'}</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package size={24} className="text-pink-600" />
              Meus Pedidos
            </h3>

            {pedidos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">Nenhum pedido realizado ainda</p>
                <p className="text-sm mt-2">Seus pedidos aparecerão aqui após a primeira compra</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pedidos.map((pedido, index) => (
                  <div key={pedido.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-pink-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          Pedido #{pedidos.length - index}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Clock size={16} />
                          {new Date(pedido.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        pedido.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : pedido.status === 'Confirmado'
                          ? 'bg-blue-100 text-blue-700'
                          : pedido.status === 'Enviado'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {pedido.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-gray-700 mb-3">Itens:</h5>
                      {pedido.itens.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="font-semibold text-gray-800">{item.nome}</p>
                            <p className="text-sm text-gray-600">
                              {item.tamanho} | {item.cor} | Qtd: {item.quantidade}
                            </p>
                          </div>
                          <p className="font-bold text-pink-600">
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p><strong>Pagamento:</strong> {pedido.cliente.formaPagamento}</p>
                        {pedido.desconto > 0 && (
                          <p className="text-green-600">
                            <strong>Desconto aplicado:</strong> R$ {pedido.desconto.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-pink-600">
                          R$ {pedido.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;