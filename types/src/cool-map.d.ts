import { Resolve } from '../types/common';
export declare class CoolMap {
    private _weakMap;
    private _map;
    private _promises;
    create(key: any): Promise<void>;
    save(key: any): Promise<void>;
    set(key: any, value: Resolve): void;
    get(key: any): Resolve | undefined;
    has(key: any): boolean;
    delete(key: any): void;
    call(key: any): void;
    private map;
    static get<T extends object>(target: T, key: keyof T): CoolMap | undefined;
    static create<T extends object>(target: T, key: keyof T): CoolMap;
    static getOrCreate<T extends object>(target: T, key: keyof T): CoolMap;
    static prepareKey(key: PropertyKey): string | symbol;
}
