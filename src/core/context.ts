export enum Parameters {
    DATA = 'data',
    RESULT = 'result'
}

export class Context extends Map<string, any> {

    constructor(data?: any) {
        super();
        if (data !== undefined) {
            this.setData(data);
        }
    }

    public getDataClass(): any {
        const data = this.get(Parameters.DATA);
        return data ? data.constructor : null;
    }

    public getResultClass(): any {
        const result = this.get(Parameters.RESULT);
        return result ? result.constructor : null;
    }

    public getData<T>(clazz?: new (...args: any[]) => T): T | null {
        return this.getProperty<T>(Parameters.DATA, clazz);
    }

    public setData(data: any): void {
        this.set(Parameters.DATA, data);
    }

    public getResult<T>(clazz?: new (...args: any[]) => T): T | null {
        return this.getProperty<T>(Parameters.RESULT, clazz);
    }

    public setResult(result: any): void {
        this.set(Parameters.RESULT, result);
    }

    public putProperty(key: string, value: any): void {
        this.set(key, value);
    }

    public getProperty<R>(key: string, clazz?: any): R | null {
        const value = this.get(key);

        if (value === undefined || value === null) {
            return null;
        }

        if (clazz) {
            if (clazz === String && typeof value !== 'string') return null;
            if (clazz === Number && typeof value !== 'number') return null;
            if (clazz === Boolean && typeof value !== 'boolean') return null;

            if (typeof clazz === 'function' &&
                clazz !== String && clazz !== Number && clazz !== Boolean &&
                !(value instanceof clazz)) {
                return null;
            }
        }

        return value as R;
    }
}