export interface Collectible<T> {
  list: T[];
  isEmpty(): boolean;
}
