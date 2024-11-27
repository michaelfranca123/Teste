import { create } from 'zustand';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: { email: string; senha: string; nome: string }[];
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  registeredUsers: [],

  login: async (email: string, senha: string) => {
    const { registeredUsers } = get();
    const user = registeredUsers.find(u => u.email === email && u.senha === senha);

    if (!user) {
      toast.error('Email ou senha inválidos');
      return false;
    }

    set({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        nome: user.nome,
        email: user.email
      },
      isAuthenticated: true
    });

    toast.success(
      `Bem-vindo(a), ${user.nome}!`,
      {
        duration: 4000,
        style: {
          background: '#011206',
          color: '#fff',
          padding: '16px',
        },
        icon: '👋'
      }
    );

    return true;
  },

  register: async (nome: string, email: string, senha: string) => {
    const { registeredUsers } = get();
    
    if (registeredUsers.some(u => u.email === email)) {
      toast.error('Este email já está cadastrado');
      return false;
    }

    set({
      registeredUsers: [...registeredUsers, { email, senha, nome }]
    });

    toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    toast('Até logo!', {
      icon: '👋',
      style: {
        background: '#011206',
        color: '#fff',
        padding: '16px',
      }
    });
  }
}));