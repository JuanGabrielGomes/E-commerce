import Link from "next/link";

export default function NotFound() {
  return (
    <section className="stack-lg">
      <div className="callout">
        <strong>Pagina nao encontrada.</strong>
        <p>Confira o endereco ou volte para o catalogo principal.</p>
      </div>
      <Link href="/" className="btn btn-primary inline-btn">
        Voltar para a home
      </Link>
    </section>
  );
}

