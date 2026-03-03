"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function resolveImage(src: string): string {
  if (src.trim().length > 0) return src;
  return "https://placehold.co/640x640/132126/f4f4f2?text=Sem+Imagem";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const effectivePrice = product.desconto && product.desconto > 0 ? product.preco - product.desconto : product.preco;

  return (
    <article className="product-card">
      <Link href={`/produtos/${product.id_produto}`} className="product-image-wrap">
        <Image
          src={resolveImage(product.imagem)}
          alt={product.nome_produto}
          width={640}
          height={640}
          className="product-image"
        />
      </Link>
      <div className="product-content">
        <p className="product-name">{product.nome_produto}</p>
        <p className="product-description">{product.descricao}</p>
        <div className="product-pricing">
          <strong>{formatPrice(effectivePrice)}</strong>
          {product.desconto && product.desconto > 0 ? <span>{formatPrice(product.preco)}</span> : null}
        </div>
        <button className="btn btn-primary" onClick={() => addItem(product)} type="button">
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}

