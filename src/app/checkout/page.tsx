"use client";

import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Status =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function CheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = (await response.json()) as Product[];
        if (!cancelled) {
          setProducts(data);
          setProductId(data[0]?.id ?? "");
        }
      } catch (cause) {
        if (!cancelled) {
          setStatus({
            kind: "error",
            message: cause instanceof Error ? cause.message : "Could not load products.",
          });
        }
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "pending") {
      return;
    }

    setStatus({ kind: "pending" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          items: [{ productId, quantity: Number(quantity) }],
        }),
      });

      const data = (await response.json()) as { total?: number; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed.");
      }

      setStatus({ kind: "success", message: `Total: $${data.total}` });
    } catch (cause) {
      setStatus({
        kind: "error",
        message: cause instanceof Error ? cause.message : "Checkout failed.",
      });
    }
  }

  const isPending = status.kind === "pending";

  return (
    <section className="card">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Product
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            disabled={isPending || products.length === 0}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — ${product.price}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={isPending}
          />
        </label>

        <button type="submit" disabled={isPending || productId === ""}>
          {isPending ? "Submitting…" : "Submit checkout"}
        </button>
      </form>

      {status.kind === "success" && <p role="status">{status.message}</p>}
      {status.kind === "error" && <p role="alert">{status.message}</p>}
      {status.kind === "pending" && <p role="status">Checkout pending…</p>}
    </section>
  );
}
