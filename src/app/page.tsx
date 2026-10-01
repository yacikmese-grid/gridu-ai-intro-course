import Link from "next/link";

export default function HomePage() {
  return (
    <section className="card">
      <h1>Checkout Training</h1>
      <p>Practice a small browser-to-server checkout flow using synthetic products.</p>
      <Link className="button-link" href="/checkout">
        Go to checkout
      </Link>
    </section>
  );
}
