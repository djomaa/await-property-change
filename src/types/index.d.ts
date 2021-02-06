export type Resolve = () => void;
export type WMap = WeakMap<object, Resolve>;
export type NMap = Map<any, Resolve>;
