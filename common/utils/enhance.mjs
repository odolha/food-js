import { promiseTimeout } from "./async.mjs";
import { groupBy, toFlatArray } from "./reducer.mjs";
import { identity } from "./mapper.mjs";

String.prototype.startsWith = function(t) {
  return this.indexOf(t) === 0;
};

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.firstN = function(n) {
  return this.slice(0, n)
};

Array.prototype.last = function() {
  return this.length > 0 ? this[this.length - 1] : null;
};

Array.prototype.lastN = function(n) {
  return this.slice(-n);
};

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

Array.prototype.pushAll = function(vals) {
  vals.forEach(v => this.push(v));
};

Array.prototype.sortByFn = function(fn) {
  return _.sortBy(this, fn);
};

Array.prototype.sortBy = function(attr, asc = true) {
  return asc ? this.sort((a, b) => a[attr] - b[attr]) : this.sort((a, b) => b[attr] - a[attr]);
};

Array.prototype.sortByAll = function(attrs) {
  return _.sortBy(this, attrs);
};

Array.prototype.groupBy = function(attr) {
  return this.groupByFn(_ => _[attr]);
};

Array.prototype.groupByFn = function(keyFn, valFn = identity) {
  return this.reduce(groupBy(keyFn, valFn), {});
};

Array.prototype.equals = function(other) {
  return other && this.length === other.length && this.every((item, idx) => item === other[idx]);
};

Array.prototype.notEquals = function(other) {
  return !other || this.length !== other.length || this.some((item, idx) => item !== other[idx]);
};

Array.prototype.toFlatArray = function() {
  return this.reduce(toFlatArray, []);
};

Array.prototype.asyncToParallel = async function() {
  return await Promise.all(this);
};

Array.prototype.asyncToParallelFns = async function() {
  return await Promise.all(this.map(fn => fn()));
};

const toSequence = async (res, next) =>  [ ...(await res), await next() ];
Array.prototype.asyncToSequence = async function() {
  return await this.reduce(toSequence, Promise.resolve([]));
};

const toSequenceThrottled = timeout => async (res, next) =>  [ ...(await res), await (promiseTimeout(timeout).then(() => next())) ];
Array.prototype.asyncToSequenceThrottled = async function(timeout) {
  return await this.reduce(toSequenceThrottled(timeout), Promise.resolve([]));
};

Number.prototype.precisionRound = function(precision) {
  const factor = Math.pow(10, precision);
  return Math.round(this * factor) / factor;
};

Number.prototype.project = function(s1, t1, s2, t2) {
  return project(s1, t1, s2, t2, this);
};

Number.prototype.scale = function(factor) {
  return this * factor;
};

Object.defineProperty(Number.prototype, "%", {
  get: function perc() {
    return this / 100.0;
  }
});

Date.prototype.equals = function(other) {
  return other && this.getTime() === other.getTime();
};

console.info('Enhancements loaded');
