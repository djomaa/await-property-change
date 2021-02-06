// TODO: allow using number
import { Resolve, WMap, NMap } from './types';
import { REFLECT_KEY } from './constants';
// TODO? work with key as typeof string to improve perfomance and type-checking
export class CoolMap {
    private _weakMap: WMap = new WeakMap<object, Resolve>();
    private _map: NMap = new Map<any, Resolve>();
    private _promises = new WeakMap<Resolve, Promise<void>>();

    create(key: any) {
        return new Promise<void>((resolve) => this.set(key, resolve));
    }

    save(key: any): Promise<void> {
        // @ts-ignore
        if (this.has(key)) return this._promises.get(this.get(key));
        const promise = this.create(key);
        // @ts-ignore
        this._promises.set(this.get(key), promise);
        return promise;
    }

    set(key: any, value: Resolve): void {
        this.map(key).set(key, value);
    }

    get(key: any): Resolve | undefined {
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

    call(key: any): void {
        if (!this.has(key)) return;
        // @ts-ignore
        this.get(key)();
        this.delete(key);
    }

    // private map<T extends object | string>(key: T): T extends object ? WMap : NMap {
    private map<T>(key: T): WMap | NMap {
        return key instanceof Object ? this._weakMap : this._map;
    }

    // TODO: add generic
    static get<T extends object>(target: T, key: keyof T): CoolMap | undefined {
        return Reflect.getMetadata(REFLECT_KEY, target, CoolMap.prepareKey(key));
    }

    static create<T extends object>(target: T, key: keyof T): CoolMap {
        const map = new CoolMap();
        Reflect.defineMetadata(REFLECT_KEY, map, target, CoolMap.prepareKey(key));
        return map;
    }

    // TODO? const pKey = CoolMap.prepareKey ?
    static getOrCreate<T extends object>(target: T, key: keyof T): CoolMap {
        return CoolMap.get(target, key) || CoolMap.create(target, key);
    }


    static prepareKey(key: PropertyKey): string | symbol {
        return typeof key === 'number' ? key.toString() : key;
    }
}
