# Ecommerce Frontend (Next.js)

Frontend de ecommerce em Next.js (App Router + TypeScript), preparado para integrar com backend externo via API HTTP.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm

## Instalar e executar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Variaveis de ambiente

- `NEXT_PUBLIC_API_BASE_URL`: base da API backend.
- `NEXT_PUBLIC_PRODUCTS_PATH`: rota de listagem de produtos.
- `NEXT_PUBLIC_PRODUCT_BY_ID_PATH`: rota de detalhe com placeholder `{id}`.
- `NEXT_PUBLIC_REGISTER_PATH`: rota de cadastro de usuario.
- `NEXT_PUBLIC_LOGIN_PATH`: rota de login.

Exemplo:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
NEXT_PUBLIC_PRODUCTS_PATH=/produtos
NEXT_PUBLIC_PRODUCT_BY_ID_PATH=/produtos/{id}
NEXT_PUBLIC_REGISTER_PATH=/usuarios
NEXT_PUBLIC_LOGIN_PATH=/auth/login
```

## Estrutura principal

- `app/`: paginas e layout (home, produto, carrinho, conta).
- `components/`: componentes reutilizaveis de UI.
- `context/CartContext.tsx`: estado do carrinho com `localStorage`.
- `lib/api.ts`: cliente HTTP e normalizacao de respostas.
- `types/product.ts`: tipos TypeScript.

## Contrato de API esperado

### Produtos

- `GET {NEXT_PUBLIC_PRODUCTS_PATH}` retorna array de produtos:

```json
[
  {
    "id_produto": 1,
    "nome_produto": "Produto",
    "descricao": "Descricao",
    "preco": 199.9,
    "desconto": 20,
    "imagem": "https://..."
  }
]
```

- `GET {NEXT_PUBLIC_PRODUCT_BY_ID_PATH}` (com `{id}` substituido) retorna 1 produto.

### Conta

- `POST {NEXT_PUBLIC_REGISTER_PATH}` com body:

```json
{
  "nome": "Usuario",
  "email": "email@dominio.com",
  "senha": "123456"
}
```

- `POST {NEXT_PUBLIC_LOGIN_PATH}` com body:

```json
{
  "email": "email@dominio.com",
  "senha": "123456"
}
```

Resposta de login pode conter:

```json
{
  "token": "jwt-opcional",
  "mensagem": "Login realizado"
}
```

