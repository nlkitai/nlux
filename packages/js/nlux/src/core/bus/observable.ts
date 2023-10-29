import {IObserver} from './observer';

type ObservableOperator = (observable: Observable<any>) => Observable<any>;

export class Observable<DataType> {

    private subscribers: Set<IObserver<DataType>> = new Set();

    complete() {
        this.subscribers.forEach(observer => observer.complete?.());
    }

    error(error: Error) {
        this.subscribers.forEach(observer => observer.error?.(error));
    }

    next(value: DataType) {
        this.subscribers.forEach(observer => observer.next(value));
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
    }

    subscribe(observer: IObserver<DataType>) {
        this.subscribers.add(observer);

        return {
            unsubscribe: () => this.unsubscribe(observer),
        };
    }

    unsubscribe(observer: IObserver<DataType>) {
        this.subscribers.delete(observer);
    }
}
