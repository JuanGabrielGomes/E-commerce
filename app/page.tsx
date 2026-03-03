import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, getApiBaseUrl } from "@/lib/api";
import type { Product } from "@/types/product";

export default async function HomePage() {
  let error: string | null = null;
  let products: Product[] = [];

  try {
    products = await fetchProducts();
  } catch (caughtError) {
    error = caughtError instanceof Error ? caughtError.message : "Erro inesperado ao buscar catálogo.";
  }

  return (
    <section className="stack-lg">
      <div className="hero">
        <p className="eyebrow">Colecao de destaque</p>
        <h1>Seu ecommerce pronto para crescer com API externa.</h1>
        <p>
          Esta interface já está preparada para consumir produtos do backend em{" "}
          <code>{getApiBaseUrl()}</code>.
        </p>
      </div>

      {error ? (
        <div className="callout error">
          <strong>Falha ao carregar produtos.</strong>
          <p>{error}</p>
          <p>Confirme se o backend está online e se a rota `GET /produtos` está disponível.</p>
        </div>
      ) : null}

      <div className="catalog-header">
        <h2>Catalogo</h2>
        <span>{products.length} itens</span>
      </div>

      {products.length === 0 ? (
        <div className="callout">
          <strong>Nenhum produto encontrado.</strong>
          <p>Quando o backend retornar dados, os cards serão renderizados automaticamente.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id_produto} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
