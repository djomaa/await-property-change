import 'reflect-metadata';
import useDebug from 'debug';
import { AMap } from './map';
import { CHANGE, REFLECT_KEY } from './constants';
import { createHandler } from './handler';

export function waitFor<T extends object, K extends keyof T>(target: T, key: K, value: T[K] | CHANGE): Promise<T[K]> {
    const debug = useDebug(`awaitable:${key}`);
    let resolverMap = AMap.get(target, key);
    if (resolverMap) {
        return resolverMap.create(value);
    } else {
        debug('create handler');
        resolverMap = AMap.create(target, key);
        // TODO: promise should be only <T[K]> without change
        const promise = resolverMap.create(value);
        createHandler(target, key);
        return promise;
    }
}

type RT<T> = T | PromiseLike<T>
type NRT<A extends any[], T> = ((...args: A) => RT<T>) | undefined | null;
// TODO: use implement
class Property<T extends object, K extends keyof T> extends Promise<T[K]> {


    constructor(readonly target: T, readonly key: K) {
        super(() => {});
    }
    // then(onfullfilled(v: V) ): Promise<any> {
    //     super.then(...args);
    //     console.log('then');
    //     return this;
    // }

    then<TResult1 = T[K], TResult2 = never>(
        onfulfilled?: NRT<[result: T[K]], TResult1>,
        onrejected?: NRT<[reason: any], TResult2>,
    ): Promise<TResult1 | TResult2> {
        return waitFor(this.target, this.key, CHANGE).then(onfulfilled, onrejected);
    }

    toBe(value: T[K]) {
        return waitFor(this.target, this.key, value);
    }

    to(fn: (value: T[K]) => boolean) {
        return new Promise(async (resolve) => {
            while (true) {
                const value = await waitFor(this.target, this.key, CHANGE);
                if (fn(value)) resolve(value);
            }
        });
    }

}

export function property<T extends object, K extends keyof T>(target: T, key: K) {
    return new Property(target, key);
}
