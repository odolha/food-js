// apply to a reduce starting with empty object to transform a list to an object with a custom key that can be computer for each item
import { promiseTimeout } from "./async.mjs";

export const toObjectMap = keyFn => (res, item) => Object.assign(res, { [keyFn(item)]: item });

export const toIndexMap = (res, item, idx) => Object.assign(res, { [idx]: item });

export const toMergedObject = (res, obj) => ({ ...res, ...obj });

// flattens a tree
export const flattenBy = (childrenAttr, opts = {}) => (res, item) => {
  const itemWithParent = Object.assign(opts.saveParent ? { [opts.saveParent]: opts.parent || null } : {}, item);
  let children = [];
  if (itemWithParent[childrenAttr]) {
    children = itemWithParent[childrenAttr]
      .reduce(flattenBy(childrenAttr, { saveParent: opts.saveParent, parent: itemWithParent }), []);
    itemWithParent[childrenAttr] = children;
  }
  return [ ...res, itemWithParent, ...children ];
};

// simulates flatMap when applied as reducer after map
export const toFlatArray = (array, subArray) => [ ...array, ...subArray ];

// reduce function useful to keep distinct members only (using === )
export const keepUnique = (array, item) => {
  if (array.find(i => item === i)) {
    return array;
  } else {
    return [ ...array, item ];
  }
};

// reduce function generator useful to keep distinct members only (comparing a property)
export const keepUniqueBy = key => (array, item) => {
  if (array.find(i => item[key] === i[key])) {
    return array;
  } else {
    return [ ...array, item ];
  }
};

// reduce function generator useful to keep distinct members only (comparing via fn)
export const keepUniqueWhere = compareFn => (array, item) => {
  if (array.find(i => compareFn(item, i))) {
    return array;
  } else {
    return [ ...array, item ];
  }
};

// groups a list by given key mapper and values mapper functions
export const groupBy = (keyFn, valueFn) => (res, item) => {
  const key = keyFn(item);
  if (!res[key]) {
    res[key] = [];
  }
  res[key].push(valueFn(item, res[key]));
  return res;
};

export const throttledPromises = timeout => (res, nextGenerator, idx) => [ ...res, promiseTimeout(timeout * idx).then(() => nextGenerator()) ];

export const toSum = (res, val) => res + val;

export const toMax = (res, val) => Math.max(res, val);
