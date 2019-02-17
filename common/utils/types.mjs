export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function isAsyncFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object AsyncFunction]';
}

export function isAnyFunction(functionToCheck) {
  return isFunction(functionToCheck) || isAsyncFunction(functionToCheck);
}

export function isDefined(value) {
  return value !== undefined && value !== null;
}

export function allPrototypeProperties(obj) {
  let result = [];
  for (let prop in obj) {
    if (!obj.hasOwnProperty(prop)) {
      result.push(prop);
    }
  }
  return result;
}

export function allFunctions(object) {
  return allPrototypeProperties(object).filter(p => typeof object[p] === 'function');
}

export const isArray = Array.isArray;

export function areArraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const isObject = item => typeof item === 'object';

export const digitsForPrecision = precision => {
  const logValue = Math.log10(precision);
  return Math.max(2, -Math.floor(logValue) + 1);
};

export const keepMinDigitsFor = (val, min) => {
  val = Math.abs(val);
  const k = 10 ** (min - 1);
  return digitsForPrecision(val / k || (1 / k));
};

export const displayNumber = (number, digits) => {
  if (digits === undefined || digits === null) {
    digits = digitsForPrecision(number);
  }
  if (digits > 12) {
    digits = 12;
  }
  if (isDefined(number) && isNumber(number)) {
    return number.toFixed(digits);
  }
};

export const traverse = (objOrArr, traverseFn) => {
  if (objOrArr === undefined || objOrArr === null) {
    return;
  }
  if (isArray(objOrArr)) {
    objOrArr.forEach((item, idx) => {
      if (isArray(item) || isObject(item)) {
        traverse(item, traverseFn);
      } else {
        traverseFn(objOrArr, idx);
      }
    });
  } else {
    Object.keys(objOrArr).forEach((key) => {
      const val = objOrArr[key];
      if (isArray(val) || isObject(val)) {
        traverse(val, traverseFn);
      } else {
        traverseFn(objOrArr, key);
      }
    });
  }
};

export const deepCopy = (objOrArr, keepFn, mapFn, parentFn, visited = [], parent = objOrArr) => {
  if (objOrArr === undefined || objOrArr === null) {
    return objOrArr;
  }
  if (visited.find(x => x === objOrArr)) {
    return null; // shortcut recursive structures
  }
  if (isArray(objOrArr)) {
    const newArr = [];
    objOrArr.forEach((item, idx) => {
      if (keepFn(parent, objOrArr, idx)) {
        const mapped = mapFn(parent, objOrArr, idx);
        if (mapped !== undefined) {
          newArr.push(mapped);
        } else if (isArray(item) || isObject(item)) {
          let newParent = parent;
          if (parentFn(item)) {
            newParent = item;
          }
          newArr.push(deepCopy(item, keepFn, mapFn, parentFn, visited.concat([objOrArr]), newParent));
        } else {
          newArr.push(item);
        }
      }
    });
    return newArr;
  } else {
    const newObj = {};
    Object.setPrototypeOf(newObj, Object.getPrototypeOf(objOrArr));
    Object.keys(objOrArr).forEach((key) => {
      if (keepFn(parent, objOrArr, key)) {
        const val = objOrArr[key];
        const mapped = mapFn(parent, objOrArr, key);
        if (mapped !== undefined) {
          newObj[key] = mapped;
        } else if (isArray(val) || isObject(val)) {
          let newParent = parent;
          if (parentFn(val)) {
            newParent = val;
          }
          newObj[key] = deepCopy(val, keepFn, mapFn, parentFn, visited.concat([objOrArr]), newParent);
        } else {
          newObj[key] = val;
        }
      }
    });
    return newObj;
  }
};

export const classHasSuperType = (type, superType) => {
  if (!type) {
    return false;
  }
  const typePrototype = Object.getPrototypeOf(type);
  return type === superType || classHasSuperType(typePrototype, superType);
};

export function isNumber(n) {
  return typeof n === 'number' && !isNaN(n) && isFinite(n);
}

export const toCase = {
  snakeCase: str => {
    if (!str) return '';
    return String(str)
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => a + '_' + b.toLowerCase())
      .replace(/[^A-Za-z0-9]+|_+/g, '_')
      .toLowerCase();
  }
};
