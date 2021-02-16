import { keyTap } from 'robotjs';
import { Resolve, WMap, NMap } from '../types';
import { REFLECT_KEY, CHANGE } from './constants';

interface IItem<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
}

const storage = new WeakMap<object, Map<PropertyKey, AMap<any>>>();

export class AMap<K, T = K | CHANGE> extends Map<T, IItem<K>> {
    
    create(key: T): Promise<K> {
        const item = AMap.createItem<K>();
        this.set(key, item)
        return item.promise;
    }
    
    getOrCreate(key: T) {
        return this.has(key) ? this.get(key) : this.create(key);
    }

    call(keyAndValue: K): void;
    call(key: T, value: K): void;
    call(key: T | K, value?: K): void {
        if (value === undefined) {
            this._call(key as T, key as K);
        } else {
            this._call(key as T, value)
        }

        
    }

    _call(key: T, value: K) {
        if (this.has(key)) {
            // @ts-ignore
            const { resolve } = this.get(key);
            resolve(value);
            this.delete(key);
        }
    }

    static get<T extends object, K extends keyof T>(target: T, pKey: K): AMap<T[K]> | undefined {
        return storage.get(target)?.get(pKey);
    }

    static create<T extends object, K extends keyof T>(target: T, pKey: K): AMap<T[K]> {
        const map = new AMap<T[typeof pKey]>();
        storage.set(target, new Map([[pKey, map]]));
        return map;
    }

    static createItem<K>() {
        const item: Partial<IItem<K>> = {};
        item.promise = new Promise<K>((resolve) => { item.resolve = resolve; });
        return item as IItem<K>;
    }

}
