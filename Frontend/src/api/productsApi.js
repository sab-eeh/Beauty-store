import { getAllProducts, findProductById } from "./mockDb";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchProducts({ search = "", category = "" } = {}) {
  await sleep(250);

  const s = search.trim().toLowerCase();
  const c = category.trim().toLowerCase();

  let list = getAllProducts();

  if (c) list = list.filter((p) => p.category === c);

  if (s) {
    list = list.filter((p) => {
      const hay = `${p.title} ${p.brand} ${p.shortDesc}`.toLowerCase();
      return hay.includes(s);
    });
  }

  return list;
}

export async function fetchProductById(id) {
  await sleep(150);
  const p = findProductById(id);
  if (!p) throw new Error("Product not found");
  return p;
}
