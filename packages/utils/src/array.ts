export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const uniqueBy = <T, K>(array: T[], key: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return array.filter(item => {
    const value = key(item);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const groupBy = <T, K>(array: T[], key: (item: T) => K): Map<K, T[]> => {
  const groups = new Map<K, T[]>();
  
  for (const item of array) {
    const groupKey = key(item);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }
  
  return groups;
};

export const sortBy = <T>(array: T[], key: (item: T) => any, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = key(a);
    const bValue = key(b);
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sample = <T>(array: T[], size: number = 1): T[] => {
  if (size >= array.length) return shuffle(array);
  return shuffle(array).slice(0, size);
};

export const sampleOne = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

export const deepFlatten = <T>(array: any[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? deepFlatten(item) : item);
  }, []);
};

export const intersection = <T>(...arrays: T[][]): T[] => {
  return arrays.reduce((intersection, array) => {
    return intersection.filter(item => array.includes(item));
  });
};

export const union = <T>(...arrays: T[][]): T[] => {
  return unique(flatten(arrays));
};

export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item));
};

export const symmetricDifference = <T>(array1: T[], array2: T[]): T[] => {
  return union(difference(array1, array2), difference(array2, array1));
};

export const countBy = <T>(array: T[], key: (item: T) => any): Map<any, number> => {
  const counts = new Map<any, number>();
  
  for (const item of array) {
    const value = key(item);
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  
  return counts;
};

export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
};

export const zip = <T, U>(array1: T[], array2: U[]): [T, U][] => {
  const length = Math.min(array1.length, array2.length);
  const result: [T, U][] = [];
  
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }
  
  return result;
};

export const unzip = <T, U>(array: [T, U][]): [T[], U[]] => {
  const array1: T[] = [];
  const array2: U[] = [];
  
  for (const [item1, item2] of array) {
    array1.push(item1);
    array2.push(item2);
  }
  
  return [array1, array2];
};

export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const isEmpty = <T>(array: T[]): boolean => {
  return array.length === 0;
};

export const isNotEmpty = <T>(array: T[]): boolean => {
  return array.length > 0;
};

export const first = <T>(array: T[]): T | undefined => {
  return array[0];
};

export const last = <T>(array: T[]): T | undefined => {
  return array[array.length - 1];
};

export const take = <T>(array: T[], n: number): T[] => {
  return array.slice(0, n);
};

export const takeRight = <T>(array: T[], n: number): T[] => {
  return array.slice(-n);
};

export const drop = <T>(array: T[], n: number): T[] => {
  return array.slice(n);
};

export const dropRight = <T>(array: T[], n: number): T[] => {
  return array.slice(0, -n);
};
