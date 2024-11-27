import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface Option {
  id: number;
  nome: string;
  preco: number;
}

const massas: Option[] = [
  { id: 1, nome: 'Baunilha', preco: 5 },
  { id: 2, nome: 'Chocolate', preco: 5 },
  { id: 3, nome: 'Red Velvet', preco: 6 },
  { id: 4, nome: 'Cenoura', preco: 5 },
  { id: 5, nome: 'Nozes', preco: 7 },
];

const recheios: Option[] = [
  { id: 1, nome: 'Brigadeiro', preco: 3 },
  { id: 2, nome: 'Doce de Leite', preco: 3 },
  { id: 3, nome: 'Nutella', preco: 4 },
  { id: 4, nome: 'Creme de Morango', preco: 3 },
  { id: 5, nome: 'Creme de Limão', preco: 3 },
];

const coberturas: Option[] = [
  { id: 1, nome: 'Chantilly', preco: 3 },
  { id: 2, nome: 'Ganache', preco: 4 },
  { id: 3, nome: 'Buttercream', preco: 3 },
  { id: 4, nome: 'Cream Cheese', preco: 4 },
];

const adicionais: Option[] = [
  { id: 1, nome: 'Granulado', preco: 1 },
  { id: 2, nome: 'Morango', preco: 2 },
  { id: 3, nome: 'Nozes Picadas', preco: 2 },
  { id: 4, nome: 'Raspas de Chocolate', preco: 1.5 },
  { id: 5, nome: 'Confeitos Coloridos', preco: 1 },
];

const CustomCupcakeBuilder: React.FC = () => {
  const [quantidade, setQuantidade] = useState(1);
  const [selecoes, setSelecoes] = useState({
    massa: massas[0],
    recheio: recheios[0],
    cobertura: coberturas[0],
    adicionais: [] as Option[],
  });
  const addToCart = useCartStore((state) => state.addToCart);

  const calcularPrecoTotal = () => {
    const precoBase = selecoes.massa.preco + selecoes.recheio.preco + selecoes.cobertura.preco;
    const precoAdicionais = selecoes.adicionais.reduce((total, adicional) => total + adicional.preco, 0);
    return (precoBase + precoAdicionais) * quantidade;
  };

  const toggleAdicional = (adicional: Option) => {
    setSelecoes((prev) => {
      const adicionaisAtuais = prev.adicionais;
      const index = adicionaisAtuais.findIndex((a) => a.id === adicional.id);
      
      if (index >= 0) {
        return {
          ...prev,
          adicionais: adicionaisAtuais.filter((_, i) => i !== index),
        };
      } else if (adicionaisAtuais.length < 3) {
        return {
          ...prev,
          adicionais: [...adicionaisAtuais, adicional],
        };
      }
      
      toast.error('Máximo de 3 adicionais permitidos');
      return prev;
    });
  };

  const handleAddToCart = () => {
    const customCupcake = {
      id: Date.now(),
      nome: `Cupcake Personalizado`,
      descricao: `Massa: ${selecoes.massa.nome}, Recheio: ${selecoes.recheio.nome}, Cobertura: ${selecoes.cobertura.nome}${
        selecoes.adicionais.length > 0
          ? `, Adicionais: ${selecoes.adicionais.map((a) => a.nome).join(', ')}`
          : ''
      }`,
      preco: calcularPrecoTotal() / quantidade,
      imagem: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80",
      categoria: "Personalizado",
      avaliacao: 5,
    };

    for (let i = 0; i < quantidade; i++) {
      addToCart(customCupcake);
    }
    toast.success(`${quantidade} ${quantidade === 1 ? 'Cupcake personalizado adicionado' : 'Cupcakes personalizados adicionados'} ao carrinho!`);
  };

  const SelectionGroup = ({ title, options, selected, onChange }: any) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option: Option) => (
          <button
            key={option.id}
            onClick={() => onChange(option)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              selected.id === option.id
                ? 'border-[#110121] bg-[#110121]/5'
                : 'hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{option.nome}</div>
            <div className="text-sm text-gray-500">+ R$ {option.preco.toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#011206] mb-6">Monte seu Cupcake</h2>
      
      <SelectionGroup
        title="Escolha a Massa"
        options={massas}
        selected={selecoes.massa}
        onChange={(massa: Option) => setSelecoes({ ...selecoes, massa })}
      />

      <SelectionGroup
        title="Escolha o Recheio"
        options={recheios}
        selected={selecoes.recheio}
        onChange={(recheio: Option) => setSelecoes({ ...selecoes, recheio })}
      />

      <SelectionGroup
        title="Escolha a Cobertura"
        options={coberturas}
        selected={selecoes.cobertura}
        onChange={(cobertura: Option) => setSelecoes({ ...selecoes, cobertura })}
      />

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Adicionais (máx. 3)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {adicionais.map((adicional) => (
            <button
              key={adicional.id}
              onClick={() => toggleAdicional(adicional)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selecoes.adicionais.some((a) => a.id === adicional.id)
                  ? 'border-[#110121] bg-[#110121]/5'
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{adicional.nome}</div>
              <div className="text-sm text-gray-500">+ R$ {adicional.preco.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Quantidade:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => quantidade > 1 && setQuantidade(quantidade - 1)}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="h-4 w-4 text-[#110121]" />
            </button>
            <span className="w-8 text-center font-medium">{quantidade}</span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4 text-[#110121]" />
            </button>
          </div>
        </div>
        <div className="text-xl font-bold">
          Total: R$ {calcularPrecoTotal().toFixed(2)}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#110121] text-white py-3 rounded-lg hover:bg-[#011206] transition-colors"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default CustomCupcakeBuilder;