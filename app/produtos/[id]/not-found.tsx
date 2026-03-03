import Link from "next/link";

export default function ProductNotFoundPage() {
  return (
    <section className="stack-lg">
      <div className="callout">
        <strong>Produto nao encontrado.</strong>
        <p>Esse item pode ter sido removido ou o backend nao retornou dados para esse ID.</p>
      </div>
      <Link href="/" className="btn btn-primary inline-btn">
        Voltar para a loja
      </Link>
    </section>
  );
}

