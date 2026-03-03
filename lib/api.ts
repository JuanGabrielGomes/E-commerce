import type { LoginPayload, LoginResponse, Product, UserRegistrationPayload } from "@/types/product";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:5000";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
const PRODUCTS_PATH = process.env.NEXT_PUBLIC_PRODUCTS_PATH ?? "/produtos";
const PRODUCT_BY_ID_PATH_TEMPLATE = process.env.NEXT_PUBLIC_PRODUCT_BY_ID_PATH ?? "/produtos/{id}";
const REGISTER_PATH = process.env.NEXT_PUBLIC_REGISTER_PATH ?? "/usuarios";
const LOGIN_PATH = process.env.NEXT_PUBLIC_LOGIN_PATH ?? "/auth/login";

type ErrorResponse = {
  erro?: string;
  mensagem?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeProduct(raw: unknown): Product {
  if (!isRecord(raw)) {
    return {
      id_produto: 0,
      nome_produto: "Produto sem nome",
      descricao: "Sem descrição disponível.",
      preco: 0,
      desconto: 0,
      imagem: ""
    };
  }

  return {
    id_produto: toNumber(raw.id_produto),
    nome_produto: toString(raw.nome_produto, "Produto sem nome"),
    descricao: toString(raw.descricao, "Sem descrição disponível."),
    preco: toNumber(raw.preco),
    desconto: toNumber(raw.desconto, 0),
    imagem: toString(raw.imagem)
  };
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      isRecord(data) && (typeof data.erro === "string" || typeof data.mensagem === "string")
        ? String(data.erro ?? data.mensagem)
        : `Falha na requisição (${response.status})`;
    throw new ApiRequestError(message, response.status);
  }

  return data as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await request<unknown>(PRODUCTS_PATH, { method: "GET" });

  if (Array.isArray(data)) {
    return data.map((item) => normalizeProduct(item)).filter((item) => item.id_produto > 0);
  }

  if (isRecord(data) && Array.isArray(data.produtos)) {
    return data.produtos.map((item) => normalizeProduct(item)).filter((item) => item.id_produto > 0);
  }

  return [];
}

export async function fetchProductById(productId: number): Promise<Product | null> {
  const path = PRODUCT_BY_ID_PATH_TEMPLATE.replace("{id}", String(productId));
  try {
    const data = await request<unknown>(path, { method: "GET" });
    const normalized = normalizeProduct(data);
    return normalized.id_produto > 0 ? normalized : null;
  } catch {
    const products = await fetchProducts();
    return products.find((product) => product.id_produto === productId) ?? null;
  }
}

export async function registerUser(payload: UserRegistrationPayload): Promise<ErrorResponse> {
  return request<ErrorResponse>(REGISTER_PATH, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>(LOGIN_PATH, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getApiConfig() {
  return {
    baseUrl: API_BASE_URL,
    productsPath: PRODUCTS_PATH,
    productByIdPath: PRODUCT_BY_ID_PATH_TEMPLATE,
    registerPath: REGISTER_PATH,
    loginPath: LOGIN_PATH
  };
}
