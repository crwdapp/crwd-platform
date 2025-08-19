export const isObjectEmpty = (obj) => {
    if (obj == null)
        return true;
    if (Array.isArray(obj) || typeof obj === 'string')
        return obj.length === 0;
    if (obj instanceof Map || obj instanceof Set)
        return obj.size === 0;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    return false;
};
export const isObjectNotEmpty = (obj) => {
    return !isObjectEmpty(obj);
};
export const pick = (obj, keys) => {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
};
export const omit = (obj, keys) => {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
};
export const keys = (obj) => {
    return Object.keys(obj);
};
export const values = (obj) => {
    return Object.values(obj);
};
export const entries = (obj) => {
    return Object.entries(obj);
};
export const fromEntries = (entries) => {
    return Object.fromEntries(entries);
};
export const assign = (target, source) => {
    return Object.assign({}, target, source);
};
export const merge = (target, source) => {
    const result = { ...target };
    for (const [key, value] of Object.entries(source)) {
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = merge(result[key] || {}, value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
};
export const get = (obj, path, defaultValue) => {
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
export const set = (obj, path, value) => {
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
export const has = (obj, path) => {
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
export const unset = (obj, path) => {
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
export const invert = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[String(value)] = key;
    }
    return result;
};
export const mapKeys = (obj, fn) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = fn(value, key);
        result[newKey] = value;
    }
    return result;
};
export const mapValues = (obj, fn) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = fn(value, key);
    }
    return result;
};
export const transform = (obj, fn) => {
    return Object.entries(obj).map(([key, value]) => fn(value, key));
};
export const defaults = (obj, ...sources) => {
    const result = { ...obj };
    for (const source of sources) {
        for (const [key, value] of Object.entries(source)) {
            if (!(key in result)) {
                result[key] = value;
            }
        }
    }
    return result;
};
export const defaultsDeep = (obj, ...sources) => {
    const result = deepClone(obj);
    for (const source of sources) {
        for (const [key, value] of Object.entries(source)) {
            if (!(key in result)) {
                result[key] = value;
            }
            else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = defaultsDeep(result[key], value);
            }
        }
    }
    return result;
};
//# sourceMappingURL=object.js.map