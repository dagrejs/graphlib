export function isFunction(func: unknown): func is (...args: any[]) => any {
  return typeof func === 'function';
}

export function constant<T>(val: T): () => T {
  return () => val;
}
