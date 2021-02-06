import { ChangeEvent } from "./constants";
import { CoolMap } from "./cool-map";
import debugFactory from 'debug';


function handle<T extends object>(target: T, key: keyof T, value: any) {
    const debug = debugFactory(`awaitable:handle:${key}`);
    debug(`value changed to ${value}`)
    const resolverMap = CoolMap.get(target, key);
    if (resolverMap) {
        // @ts-ignore
        resolverMap.call(ChangeEvent);
        resolverMap.call(value);
    }
}

export function createHandler<T extends object, K extends keyof T>(target: T, key: K) {
    const debug = debugFactory(`awaitable:createHandler:${key}`);
    debug('starting');
    // TODO? can not get descriptor for getter (and setter?) when target is a class?
    const oDesc = Reflect.getOwnPropertyDescriptor(target, key);
    debug(oDesc);
    if (!oDesc) {
        debug('there was not descriptor');
        let value: T[K];
        Reflect.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get() { return value; },
            set(newValue: T[K]) {
                value = newValue;
                handle(target, key, newValue);
            }
        })
    } else if (oDesc.writable) {
        debug('recreating for writable descriptor');
        let value: T[K] = oDesc.value;
        Reflect.defineProperty(target, key, {
            configurable: oDesc.configurable,
            enumerable: oDesc.enumerable,
            get() { return value; },
            set(newValue: T[K]) {
                value = newValue;
                handle(target, key, newValue);
            }
        });
    } else if (oDesc.set) {
        debug('recreating for setter');
        Reflect.defineProperty(target, key, {
            configurable: oDesc.configurable,
            enumerable: oDesc.enumerable,
            get: oDesc.get,
            set(value: T[K]) {
                // @ts-ignore
                oDesc.set(value);
                // TODO? wait for promise? we do not resolving results
                const newValue = oDesc.get ? oDesc.get() : value;
                handle(target, key, newValue);
            }
        })
    } else {
        debug('can not do anything');
        throw new Error('Can not handle property change');
    }
    debug('creation succeed');
}
