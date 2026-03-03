export type Product = {
  id_produto: number;
  nome_produto: string;
  descricao: string;
  preco: number;
  desconto?: number | null;
  imagem: string;
};

export type UserRegistrationPayload = {
  nome: string;
  email: string;
  senha: string;
};

export type LoginPayload = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token?: string;
  mensagem?: string;
};

