import { Cupcake } from '../types';

interface OrderDetails {
  orderNumber: string;
  items: { cupcake: Cupcake; quantity: number }[];
  total: number;
  address: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  paymentMethod: string;
}

export const sendOrderConfirmation = async (email: string, order: OrderDetails) => {
  // In a real application, this would connect to an email service
  // For demo purposes, we'll log the email content
  console.log(`
    Enviando email para: ${email}
    
    Assunto: Confirmação do Pedido #${order.orderNumber}
    
    Olá!
    
    Seu pedido foi confirmado com sucesso!
    
    Resumo do Pedido #${order.orderNumber}:
    
    Itens:
    ${order.items.map(item => `
    - ${item.cupcake.nome}
      Quantidade: ${item.quantity}
      Preço unitário: R$ ${item.cupcake.preco.toFixed(2)}
      Subtotal: R$ ${(item.cupcake.preco * item.quantity).toFixed(2)}
    `).join('\n')}
    
    Total do Pedido: R$ ${order.total.toFixed(2)}
    
    Endereço de Entrega:
    ${order.address.rua}, ${order.address.numero}
    ${order.address.complemento ? order.address.complemento + '\n' : ''}
    ${order.address.bairro}
    ${order.address.cidade} - ${order.address.estado}
    CEP: ${order.address.cep}
    
    Forma de Pagamento: ${order.paymentMethod}
    
    Obrigado por escolher a Sweet Cupcake!
    
    Atenciosamente,
    Equipe Sweet Cupcake
  `);

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};