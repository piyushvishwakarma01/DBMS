export declare class AppError extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const errorMiddleware: (err: Error, req: Request, res: Response, next: NextFunction) => any;
