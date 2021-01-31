import 'reflect-metadata';
import useDebug from 'debug';

export function waitFor<T extends object>(target: T, key: keyof T) {
    const targetName = (target as any).constructor.name;
    const debug = useDebug(`awaitable:${targetName}:${key}`);
    return new Promise<void>((resolve, reject) => {
        debug('add handler')
        const listeners = Reflect.getMetadata('awaitable:listeners', target);
        if (listeners) {
            debug('add new listener');
            listeners.push(resolve);
        } else {
            debug('create handler');
            Reflect.defineMetadata('awaitable:listeners', [resolve], target);
            const desc = Reflect.getOwnPropertyDescriptor(target, key);
            // TODO: inherit set\get if no value
            // TODO: drop an error if not writeable?
            let value: T[typeof key] = desc.value;
            const succeed = Reflect.defineProperty(target, key, {
                get: () => value,
                set: (newValue: any) => {
                    debug('setting');
                    const listeners = Reflect.getMetadata('awaitable:listeners', target);
                    value = newValue;
                    for (const resolve of listeners) {
                        resolve();
                    }
                },
                enumerable: desc.enumerable,
                configurable: desc.configurable,
            });
            if (!succeed) reject('Can not define property');
        }
    });
}