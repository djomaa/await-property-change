import 'reflect-metadata';
import useDebug from 'debug';
import { CoolMap } from './cool-map';
import { ChangeEvent } from './constants';
import { createHandler } from './handler';

export function waitFor<T extends object>(target: T, key: keyof T, value: any = ChangeEvent) {
    const debug = useDebug(`awaitable:${key}`);
    let resolverMap = CoolMap.get(target, key);
    if (!resolverMap) {
        debug('create handler');
        resolverMap = CoolMap.create(target, key);
        // nah that's ugly
        createHandler(target, key);
    }
    return resolverMap.save(value);
}

class Until<T extends object, K extends keyof T> {
    constructor(
        readonly target: T,
        readonly key: K,
    ) {}

    changed(): Promise<void> {
        return waitFor(this.target, this.key, ChangeEvent);
    }

    notEqual(value: any) {
        return waitFor(this.target, this.key, value);
    }

    falsy(handler: (value: T[K]) => boolean) {
        return new Promise<void>(async (resolve, reject) => {
            while (true) {
                const value = await waitFor(this.target, this.key, ChangeEvent);
                const shouldResolve = await handler(value);
            }
        })
    }

}

export function until<T extends object>(target: T, key: keyof T) {
    return new Until()
}