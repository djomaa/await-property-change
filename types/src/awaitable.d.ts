import 'reflect-metadata';
export declare function waitFor<T extends object>(target: T, key: keyof T, value?: any): Promise<void>;
