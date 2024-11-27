export interface Cupcake {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  avaliacao: number;
  categoria: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
}