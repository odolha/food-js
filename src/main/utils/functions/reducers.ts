// apply to a reduce starting with empty object to transform a list to an object with a custom key that can be computer for each item
export const toObjectMap = (keyFn: (item: any) => string) => (res, item) => Object.assign(res, { [keyFn(item)]: item });

// flattens a tree
export const flattenBy = (childrenAttr: string, opts: { saveParent?: string, parent?: any } = {}) => (res, item) => {
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
export const toFlatArray = <T>(array: T[], subArray: T[]) => [ ...array, ...subArray ];

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

// groups a list by given key mapper and values mapper functions
export const groupBy = (keyFn: (val: any) => string, valueFn: (val: any, list: any[]) => any[]) => (res: any, item: any) => {
  const key = keyFn(item);
  if (!res[key]) {
    res[key] = [];
  }
  res[key] = valueFn(item, res[key]);
  return res;
};
