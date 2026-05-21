import type { Product } from "./products";

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(q: string): string[] {
  return normalize(q)
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{Letter}\p{Number}]+/gu, ""))
    .filter((t) => t.length >= 2);
}

// Maps PT plural endings to their singular form.
// "cachecois" -> "cachecol", "papeis" -> "papel", "anais" -> "anal".
const PT_PLURAL_MAP: ReadonlyArray<readonly [string, string]> = [
  ["oes", "ao"], // limões -> limão (after accent strip)
  ["aes", "ao"], // pães -> pão
  ["ois", "ol"], // cachecóis -> cachecol
  ["eis", "el"], // papéis -> papel
  ["ais", "al"], // animais -> animal
  ["uis", "ul"], // azuis -> azul
  ["ns", "m"], // moletons -> moletom, jardins -> jardim
];

// Tries token and its stems for simple PT/EN plurals
// Examples: "notebooks" -> "notebook", "monitores" -> "monitor",
// "smartwatches" -> "smartwatch", "cachecois" -> "cachecol"
function tokenMatches(haystack: string, token: string): boolean {
  if (haystack.includes(token)) return true;
  if (token.length <= 3 || !token.endsWith("s")) return false;

  // Strip trailing 's' (notebooks -> notebook, bolsas -> bolsa)
  if (haystack.includes(token.slice(0, -1))) return true;

  if (token.length > 4) {
    // Strip trailing 'es' (monitores -> monitor, smartwatches -> smartwatch)
    if (token.endsWith("es") && haystack.includes(token.slice(0, -2))) return true;

    // PT vowel + 'is' / 'es' transformations
    for (const [from, to] of PT_PLURAL_MAP) {
      if (token.endsWith(from)) {
        const stem = token.slice(0, -from.length) + to;
        if (haystack.includes(stem)) return true;
      }
    }
  }
  return false;
}

export function matchesQuery(product: Product, query: string): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return false;

  const haystack = normalize(
    [
      product.name,
      product.brand,
      product.category,
      product.categorySlug.replace(/-/g, " "),
      product.description ?? "",
      ...(product.specs?.map((s) => `${s.label} ${s.value}`) ?? []),
    ].join(" "),
  );

  // All tokens must match (AND search), each via permissive matching
  return tokens.every((t) => tokenMatches(haystack, t));
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim();
  if (!q) return [];
  return products.filter((p) => matchesQuery(p, q));
}
