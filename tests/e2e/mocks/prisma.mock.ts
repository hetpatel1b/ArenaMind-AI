const createRecursiveMock = (): any => {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'isMock') return true;
      if (prop === 'then') return undefined; // Prevent promise chaining issues
      if (prop === '$queryRaw') return async () => [{ 1: 1 }];
      if (prop === '$executeRaw') return async () => 1;
      if (prop === '$on') return () => {};
      if (prop === '$transaction')
        return async (cb: any) => (typeof cb === 'function' ? cb(target) : cb);

      const mockFn = (...args: any[]) => {
        const firstArg = args[0];
        if (typeof firstArg === 'function') {
          return firstArg(target);
        }
        return Promise.resolve(null);
      };

      return new Proxy(mockFn, handler);
    },
    apply() {
      return Promise.resolve(null);
    },
  };

  return new Proxy({}, handler);
};

export const prismaMock = createRecursiveMock();
export const prisma = prismaMock;
