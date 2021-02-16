import { keyTap } from 'robotjs';
import { Resolve, WMap, NMap } from '../types';
import { REFLECT_KEY, CHANGE } from './constants';

interface IItem<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
}

const storage = new WeakMap<object, Map<PropertyKey, AMap<any>>>();

export class AMap<K, T = K | CHANGE> extends Map<T, IItem<T>> {
    
    create(key: T): Promise<T> {
        const item = AMap.createItem<T>();
        this.set(key, item)
        return item.promise;
    }
    
    getOrCreate(key: T) {
        return this.has(key) ? this.get(key) : this.create(key);
    }

    call(key: T) {
        if (this.has(key)) {
            // @ts-ignore
            const { resolve } = this.get(key);
            resolve(key);
            this.delete(key);
        }
    }

    static get<O extends object>(target: O, pKey: keyof O): AMap<O[typeof pKey]> | undefined {
        return storage.get(target)?.get(pKey);
    }

    static create<T extends object>(target: T, pKey: keyof T): AMap<T[typeof pKey]> {
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
