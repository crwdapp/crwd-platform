export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

export const isNotEmpty = (obj: any): boolean => {
  return !isEmpty(obj);
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj } as Omit<T, K>;
  for (const key of keys) {
    delete (result as any)[key];
  }
  return result;
};

export const keys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const values = <T extends object>(obj: T): T[keyof T][] => {
  return Object.values(obj);
};

export const entries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export const fromEntries = <T>(entries: [string, T][]): Record<string, T> => {
  return Object.fromEntries(entries);
};

export const assign = <T extends object, U extends object>(target: T, source: U): T & U => {
  return Object.assign({}, target, source);
};

export const merge = <T extends object, U extends object>(target: T, source: U): T & U => {
  const result = { ...target } as T & U;
  
  for (const [key, value] of Object.entries(source)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      (result as any)[key] = merge((result as any)[key] || {}, value);
    } else {
      (result as any)[key] = value;
    }
  }
  
  return result;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (cloned as any)[key] = deepClone((obj as any)[key]);
      }
    }
    return cloned;
  }
  return obj;
};

export const get = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

export const set = <T>(obj: any, path: string, value: T): T => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return value;
};

export const has = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
};

export const unset = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1];
  if (current && typeof current === 'object' && lastKey in current) {
    delete current[lastKey];
    return true;
  }
  
  return false;
};

export const invert = <T extends Record<string, any>>(obj: T): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[String(value)] = key;
  }
  return result;
};

export const mapKeys = <T extends object, U extends string>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<U, T[keyof T]> => {
  const result = {} as Record<U, T[keyof T]>;
  for (const [key, value] of Object.entries(obj)) {
    const newKey = fn(value, key as keyof T);
    result[newKey] = value;
  }
  return result;
};

export const mapValues = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> => {
  const result = {} as Record<keyof T, U>;
  for (const [key, value] of Object.entries(obj)) {
    result[key as keyof T] = fn(value, key as keyof T);
  }
  return result;
};

export const transform = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): U[] => {
  return Object.entries(obj).map(([key, value]) => fn(value, key as keyof T));
};

export const defaults = <T extends object>(obj: T, ...sources: Partial<T>[]): T => {
  const result = { ...obj };
  
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (!(key in result)) {
        (result as any)[key] = value;
      }
    }
  }
  
  return result;
};

export const defaultsDeep = <T extends object>(obj: T, ...sources: Partial<T>[]): T => {
  const result = deepClone(obj);
  
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (!(key in result)) {
        (result as any)[key] = value;
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        (result as any)[key] = defaultsDeep((result as any)[key], value);
      }
    }
  }
  
  return result;
};
