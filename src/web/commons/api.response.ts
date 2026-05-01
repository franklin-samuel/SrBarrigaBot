


export class ApiResponse<T> {
    success: boolean = true;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
    timestamp: string = new Date().toISOString();

    private constructor(init?: Partial<ApiResponse<T>>) {
        Object.assign(this, init);
    }

    public static success<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse<T>({
            success: true,
            data,
            message,
            timestamp: new Date().toISOString(),
        });
    }

    public static successMessage<T>(message: string): ApiResponse<T> {
        return new ApiResponse<T>({
            success: true,
            message,
            timestamp: new Date().toISOString(),
        });
    }

    public static error<T>(error: string, code?: string): ApiResponse<T> {
        return new ApiResponse<T>({
            success: false,
            error,
            code,
            timestamp: new Date().toISOString(),
        });
    }
}