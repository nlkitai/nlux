export interface IObserver<DataType> {
    complete?(): void;
    error?(error: Error): void;
    next(value: DataType): void;
}
