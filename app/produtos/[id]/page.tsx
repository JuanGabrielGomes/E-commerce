import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { fetchProductById } from "@/lib/api";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function resolveImage(src: string): string {
  if (src.trim().length > 0) return src;
  return "https://placehold.co/900x900/132126/f4f4f2?text=Produto";
}

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId)) notFound();

  const product = await fetchProductById(parsedId);
  if (!product) notFound();

  const effectivePrice =
    product.desconto && product.desconto > 0 ? product.preco - product.desconto : product.preco;

  return (
    <section className="stack-lg">
      <Link href="/" className="back-link">
        Voltar para o catalogo
      </Link>

      <div className="product-page-grid">
        <div className="product-detail-media">
          <Image
            src={resolveImage(product.imagem)}
            alt={product.nome_produto}
            width={900}
            height={900}
            className="product-detail-image"
            priority
          />
        </div>

        <article className="product-detail-copy">
          <p className="eyebrow">Detalhes do produto</p>
          <h1>{product.nome_produto}</h1>
          <p>{product.descricao}</p>
          <div className="product-pricing">
            <strong>{formatPrice(effectivePrice)}</strong>
            {product.desconto && product.desconto > 0 ? <span>{formatPrice(product.preco)}</span> : null}
          </div>
          <ul className="product-notes">
            <li>Entrega para todo o Brasil.</li>
            <li>Pagamento em ate 12x no cartao.</li>
            <li>Troca em ate 7 dias corridos.</li>
          </ul>
        </article>

        <ProductPurchasePanel product={product} />
      </div>
    </section>
  );
}
