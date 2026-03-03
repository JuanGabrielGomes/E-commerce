"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const effectivePrice = product.desconto && product.desconto > 0 ? product.preco - product.desconto : product.preco;

  return (
    <aside className="purchase-panel">
      <p className="purchase-title">Resumo da compra</p>
      <div className="purchase-price-block">
        <strong>{formatPrice(effectivePrice)}</strong>
        {product.desconto && product.desconto > 0 ? (
          <span className="purchase-price-strike">{formatPrice(product.preco)}</span>
        ) : null}
      </div>
      <button className="btn btn-primary" type="button" onClick={() => addItem(product)}>
        Adicionar ao carrinho
      </button>
      <p className="purchase-note">Frete e prazo calculados no checkout.</p>
    </aside>
  );
}

