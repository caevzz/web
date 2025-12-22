const g = globalThis;

if (!g.__ORDER_STORE__) {
  g.__ORDER_STORE__ = new Map();
}

/**
 * Order shape:
 * {
 *   orderId, createdAt,
 *   product: { code, name?, price?, type },
 *   target,
 *   deposit: { reff_id, id?, raw? },
 *   trx: { reff_id, id?, raw? },
 *   status: "UNPAID" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED"
 * }
 */
export function putOrder(order) {
  g.__ORDER_STORE__.set(order.orderId, order);
  return order;
}
export function getOrder(orderId) {
  return g.__ORDER_STORE__.get(orderId) || null;
}
export function updateOrder(orderId, patch) {
  const cur = getOrder(orderId);
  if (!cur) return null;
  const next = { ...cur, ...patch };
  g.__ORDER_STORE__.set(orderId, next);
  return next;
}
