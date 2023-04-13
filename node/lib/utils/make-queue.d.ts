export declare const makeQueue: () => {
    enqueue<T>(code: () => T | Promise<T>): Promise<T>;
};
