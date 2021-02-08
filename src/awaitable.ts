import 'reflect-metadata';
import useDebug from 'debug';
import { CoolMap } from './cool-map';
import { ChangeEvent } from './constants';
import { createHandler } from './handler';

export function waitFor<T extends object>(target: T, key: keyof T, value: T[typeof key]) {
    const what = value ?? ChangeEvent;
    const debug = useDebug(`awaitable:${key}`);
    let resolverMap = CoolMap.get(target, key);
    if (!resolverMap) {
        debug('create handler');
        resolverMap = CoolMap.create(target, key);
        // nah that's ugly
        createHandler(target, key);
    }
    return resolverMap.save(what);
}
