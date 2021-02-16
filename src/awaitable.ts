import 'reflect-metadata';
import useDebug from 'debug';
import { AMap } from './map';
import { CHANGE } from './constants';
import { createHandler } from './handler';

export function waitFor<T extends object, K extends keyof T>(target: T, key: K, value: T[K]) {
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
