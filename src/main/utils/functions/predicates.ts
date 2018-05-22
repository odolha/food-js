interface EnhancedPredicateFn {
  (item: any): boolean;
  and?(otherPredicate: (item: any) => boolean): EnhancedPredicateFn;
  or?(otherPredicate: (item: any) => boolean): EnhancedPredicateFn;
}

const makePredicate = predicateFn => {
  const enhancedPredicateFn: EnhancedPredicateFn = item => predicateFn(item);
  enhancedPredicateFn.and = otherPredicate => makePredicate(item => predicateFn(item) && otherPredicate(item));
  enhancedPredicateFn.or = otherPredicate => makePredicate(item => predicateFn(item) || otherPredicate(item));
  return enhancedPredicateFn;
};

export const existing = makePredicate(item => !!item);

export const beingInstanceOf = type => makePredicate(item => item instanceof type);

export const having = (attr, predicate = existing) => makePredicate(item => item && predicate(item[attr]));

export const equalTo = value => makePredicate(item => item === value);

export const not = predicate => makePredicate(item => !predicate(item));
