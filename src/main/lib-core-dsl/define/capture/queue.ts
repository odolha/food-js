export class Queue<T> {

  static empty = <T>() => new Queue<T>();

  constructor(public items: T[] = []) { }

  adding(...items: T[]): Queue<T> {
    return new Queue<T>([...this.items, ...items]);
  }

  map<U>(fn: (t: T) => U): Queue<U> {
    return new Queue<U>(this.items.map(fn));
  }

  filter(p: (t: T) => boolean): Queue<T> {
    return new Queue<T>(this.items.filter(p));
  }

  find(p: (t: T) => boolean): T {
    return this.items.find(p);
  }

  findLast(p: (t: T) => boolean): T {
    return this.items.reverse().find(p);
  }

  toString() {
    return `<<${this.items.map(item => item.toString()).join('; ')}>>`;
  }

}
