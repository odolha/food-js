const makePredicate = predicateFn => {
  const enhancedPredicateFn = item => predicateFn(item);
  enhancedPredicateFn.and = otherPredicate => makePredicate(item => predicateFn(item) && otherPredicate(item));
  enhancedPredicateFn.or = otherPredicate => makePredicate(item => predicateFn(item) || otherPredicate(item));
  return enhancedPredicateFn;
};

export const existing = makePredicate(item => !!item);

export const beingInstanceOf = type => makePredicate(item => item instanceof type);

export const equalTo = value => makePredicate(item => item === value);

export const having = (attr, predicate = existing) => makePredicate(item => item && predicate(item[attr]));

export const not = predicate => makePredicate(item => !predicate(item));

export const always = () => true;

export const never = () => false;
