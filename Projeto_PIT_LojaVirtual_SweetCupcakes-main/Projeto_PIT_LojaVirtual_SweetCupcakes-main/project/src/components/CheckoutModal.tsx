import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { sendOrderConfirmation } from '../services/emailService';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';

interface Address {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [address, setAddress] = useState<Address>({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();

  if (!isOpen) return null;

  const handleCEPChange = async (cep: string) => {
    setAddress(prev => ({ ...prev, cep }));
    
    if (cep.length === 8) {
      setIsLoadingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          toast.error('CEP não encontrado');
          return;
        }

        setAddress(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar CEP e endereço completo
    if (!address.cep || !address.rua || !address.numero || !address.bairro || !address.cidade || !address.estado) {
      toast.error('Por favor, preencha todos os campos do endereço');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const paymentMethods = {
        pix: 'PIX',
        credit: 'Cartão de Crédito',
        debit: 'Cartão de Débito',
        cash: 'Dinheiro'
      };

      // Enviar confirmação por email
      await sendOrderConfirmation(user!.email, {
        orderNumber,
        items,
        total,
        address,
        paymentMethod: paymentMethods[paymentMethod]
      });

      toast.success('Pedido realizado com sucesso! Verifique seu email para mais detalhes.');
      clearCart();
      onClose();
    } catch (error) {
      toast.error('Erro ao processar o pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'pix',
      title: 'PIX',
      description: 'Pagamento instantâneo',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'credit',
      title: 'Cartão de Crédito',
      description: 'Pagamento à vista',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'debit',
      title: 'Cartão de Débito',
      description: 'Débito à vista',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'cash',
      title: 'Dinheiro',
      description: 'Pagamento na entrega',
      icon: <Wallet className="w-6 h-6" />
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#011206]">Finalizar Compra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Dados do Cliente</h3>
            <p className="text-gray-600 mb-2">Nome: {user?.nome}</p>
            <p className="text-gray-600 mb-4">Email: {user?.email}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="CEP (somente números)"
                  className="p-2 border rounded w-full"
                  value={address.cep}
                  onChange={(e) => handleCEPChange(e.target.value.replace(/\D/g, ''))}
                  maxLength={8}
                  required
                />
                {isLoadingCEP && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#110121]"></div>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Rua"
                className="p-2 border rounded"
                value={address.rua}
                onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Número"
                className="p-2 border rounded"
                value={address.numero}
                onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Complemento"
                className="p-2 border rounded"
                value={address.complemento}
                onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bairro"
                className="p-2 border rounded"
                value={address.bairro}
                onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Cidade"
                className="p-2 border rounded"
                value={address.cidade}
                onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Estado"
                className="p-2 border rounded"
                value={address.estado}
                onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-4 border rounded-lg flex items-center space-x-3 ${
                    paymentMethod === method.id
                      ? 'border-[#110121] bg-[#110121]/5'
                      : 'hover:border-gray-300'
                  }`}
                >
                  {method.icon}
                  <div className="text-left">
                    <div className="font-semibold">{method.title}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#110121] text-white py-3 rounded-lg hover:bg-[#011206] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Processando...</span>
              </div>
            ) : (
              'Confirmar Pedido'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;