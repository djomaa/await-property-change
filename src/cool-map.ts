// TODO: allow using number
import { Resolve } from './types';
import { REFLECT_KEY } from './constants';

export type WMap<T> = WeakMap<object, Resolve<T>>;
export type NMap<T> = Map<any, Resolve<T>>;
// TODO? work with key as typeof string to improve perfomance and type-checking
export class CoolMap<T> {
    private _weakMap: WMap<T> = new WeakMap<object, Resolve<T>>();
    private _map: NMap<T> = new Map<any, Resolve<T>>();
    private _promises = new WeakMap<Resolve, Promise<T>>();

    create(key: any) {
        return new Promise<T>((resolve) => this.set(key, resolve));
    }

    save(key: any): Promise<T> {
        // @ts-ignore
        if (this.has(key)) return this._promises.get(this.get(key));
        const promise = this.create(key);
        // @ts-ignore
        this._promises.set(this.get(key), promise);
        return promise;
    }

    set(key: any, value: Resolve<T>): void {
        this.map(key).set(key, value);
    }

    get(key: any): Resolve<T> | undefined {
        return this.map(key).get(key);
    }

    has(key: any): boolean {
        return this.map(key).has(key);
    }

    delete(key: any): void {
        if (!this.has(key)) return;
        // @ts-ignore
        this._promises.delete(this.get(key))
        this.map(key).delete(key);
    }

    call(key: any, resolveWith = key): void {
        if (!this.has(key)) return;
        // @ts-ignore
        this.get(key)();
        this.delete(key);
    }

    // private map<T extends object | string>(key: T): T extends object ? WMap : NMap {
    private map(key: T): WMap<T> | NMap<T> {
        return key instanceof Object ? this._weakMap : this._map;
    }

    // TODO: add generic
    static get<T extends object>(target: T, key: keyof T): CoolMap<T[typeof key]> | undefined {
        return Reflect.getMetadata(REFLECT_KEY, target, CoolMap.prepareKey(key));
    }

    static create<T extends object>(target: T, key: keyof T): CoolMap<T[typeof key]> {
        const map = new CoolMap<T[typeof key]>();
        Reflect.defineMetadata(REFLECT_KEY, map, target, CoolMap.prepareKey(key));
        return map;
    }

    // TODO? const pKey = CoolMap.prepareKey ?
    static getOrCreate<T extends object>(target: T, key: keyof T): CoolMap<T[typeof key]> {
        return CoolMap.get(target, key) || CoolMap.create(target, key);
    }

    static prepareKey(key: PropertyKey): string | symbol {
        return typeof key === 'number' ? key.toString() : key;
    }
}
