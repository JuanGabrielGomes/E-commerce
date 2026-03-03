"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="stack-lg">
        <h1>Carrinho</h1>
        <div className="callout">
          <strong>Seu carrinho esta vazio.</strong>
          <p>Adicione produtos da vitrine para comecar a compra.</p>
        </div>
        <Link href="/" className="btn btn-primary inline-btn">
          Ir para loja
        </Link>
      </section>
    );
  }

  return (
    <section className="stack-lg">
      <div className="catalog-header">
        <h1>Carrinho</h1>
        <button type="button" className="btn btn-ghost" onClick={clearCart}>
          Limpar tudo
        </button>
      </div>

      <div className="cart-layout">
        <div className="stack-md">
          {items.map((item) => {
            const unitPrice = item.desconto && item.desconto > 0 ? item.preco - item.desconto : item.preco;
            return (
              <article className="cart-item" key={item.id_produto}>
                <div>
                  <p className="product-name">{item.nome_produto}</p>
                  <p className="product-description">{item.descricao}</p>
                </div>
                <div className="cart-controls">
                  <label htmlFor={`qty-${item.id_produto}`}>Qtd</label>
                  <input
                    id={`qty-${item.id_produto}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      updateQuantity(item.id_produto, Number.isFinite(nextValue) ? nextValue : 1);
                    }}
                  />
                  <strong>{formatPrice(unitPrice * item.quantity)}</strong>
                  <button className="btn btn-link" type="button" onClick={() => removeItem(item.id_produto)}>
                    Remover
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="purchase-panel">
          <p className="purchase-title">Resumo</p>
          <div className="purchase-price-block">
            <strong>{formatPrice(subtotal)}</strong>
            <span>Subtotal sem frete</span>
          </div>
          <button className="btn btn-primary" type="button">
            Ir para checkout
          </button>
        </aside>
      </div>
    </section>
  );
}
