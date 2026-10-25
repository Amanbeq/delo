
import { products } from "./products.js";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const grid = document.querySelector<HTMLDivElement>("#product-grid")!;
const count = document.querySelector<HTMLSpanElement>("#cart-count")!;
const cartList = document.querySelector<HTMLUListElement>("#cart-items")!;
const totalElement =
  document.querySelector<HTMLElement>("#cart-total")!;
const message = document.querySelector<HTMLParagraphElement>("#message")!;

const filterButtons =
  document.querySelectorAll<HTMLButtonElement>(".filter");

const clearButton =
  document.querySelector<HTMLButtonElement>("#clear-cart")!;

const cart = new Map<number, CartItem>();

function renderProducts(category = "All"): void {
  const filtered = (products as Product[]).filter(
    (product) =>
      category === "All" || product.category === category
  );

  grid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <p>${product.category}</p>
        <h3>${product.name}</h3>
        <strong>$${product.price.toFixed(2)}</strong>
        <button class="button add-button" data-id="${product.id}">
          Add to bag
        </button>
      </div>
    </article>
  `).join("");
}

function renderCart(): void {
  let totalQuantity = 0;
  let totalPrice = 0;

  cartList.innerHTML = "";

  cart.forEach(({ product, quantity }) => {
    totalQuantity += quantity;
    totalPrice += product.price * quantity;

    const item = document.createElement("li");
    item.textContent =
      `${product.name} × ${quantity} — $${(product.price * quantity).toFixed(2)}`;

    cartList.appendChild(item);
  });

  count.textContent = String(totalQuantity);
  totalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

grid.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) return;
  if (!target.matches(".add-button")) return;

  const id = Number(target.dataset.id);
  const product = (products as Product[]).find((item) => item.id === id);

  if (!product) return;

  const existing = cart.get(id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(id, { product, quantity: 1 });
  }

  message.textContent = `${product.name} added to your bag!`;
  renderCart();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    renderProducts(button.dataset.category ?? "All");
  });
});

clearButton.addEventListener("click", () => {
  cart.clear();
  message.textContent = "Your bag is empty.";
  renderCart();
});

renderProducts();
renderCart();
