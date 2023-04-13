export declare function makeGrpcServer(port?: number): Promise<{
    close: () => Promise<void>;
}>;
