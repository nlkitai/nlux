import {IObserver} from './observer';

type ObservableOperator = (observable: Observable<any>) => Observable<any>;

export class Observable<DataType> {

    private readonly isReplayObservable: boolean = false;

    private buffer: DataType[] = [];
    private errorReceived: Error | null = null;
    private isCompleted: boolean = false;
    private subscribers: Set<IObserver<DataType>> = new Set();

    constructor({replay}: {replay?: boolean} = {}) {
        this.isReplayObservable = replay ?? false;
    }

    complete() {
        this.subscribers.forEach(observer => observer.complete?.());
        this.isCompleted = true;
    }

    error(error: Error) {
        this.subscribers.forEach(observer => observer.error?.(error));
        if (this.isReplayObservable) {
            this.errorReceived = error;
        }
    }

    next(value: DataType) {
        this.subscribers.forEach(observer => observer.next(value));
        if (this.isReplayObservable) {
            this.buffer.push(value);
        }
    }

    pipe(...operators: Array<ObservableOperator>) {
        let currentObservable = this;

        for (let i = 0; i < arguments.length; i++) {
            currentObservable = arguments[i](currentObservable);
        }

        return currentObservable;
    }

    reset() {
        this.subscribers.clear();
        this.buffer = [];
    }

    subscribe(observer: IObserver<DataType>) {
        this.subscribers.add(observer);
        if (this.isReplayObservable) {
            this.sendBufferToObserver(observer);
        }

        return {
            unsubscribe: () => this.unsubscribe(observer),
        };
    }

    unsubscribe(observer: IObserver<DataType>) {
        this.subscribers.delete(observer);
    }

    private sendBufferToObserver(observer: IObserver<DataType>) {
        this.buffer.forEach(value => observer.next(value));
        if (this.errorReceived) {
            observer.error?.(this.errorReceived);
        } else {
            if (this.isCompleted) {
                observer.complete?.();
            }
        }
    }
}
