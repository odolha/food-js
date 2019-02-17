// TODO: there must be a better way
import rxjs from 'https://dev.jspm.io/rxjs@6';
import operators from 'https://dev.jspm.io/rxjs@6/operators';

window.rxjs = rxjs;

rxjs.Observable.empty = () => operators.empty;
rxjs.Observable.of = val => operators.of(val);
rxjs.Observable.prototype.map = function(fn) { return this.pipe(operators.map(fn)) };
rxjs.Observable.prototype.filter = function(fn) { return this.pipe(operators.filter(fn)) };
rxjs.Observable.prototype.take = function(arg) { return this.pipe(operators.take(arg)) };
rxjs.Observable.prototype.skip = function(arg) { return this.pipe(operators.skip(arg)) };
rxjs.Observable.prototype.debounceTime = function(arg) { return this.pipe(operators.debounceTime(arg)) };
rxjs.Observable.prototype.merge = function(arg) { return this.pipe(operators.merge(arg)) };
rxjs.Observable.prototype.pairwise = function(arg) { return this.pipe(operators.pairwise(arg)) };
rxjs.Observable.prototype.toArray = function(arg) { return this.pipe(operators.toArray(arg)) };
