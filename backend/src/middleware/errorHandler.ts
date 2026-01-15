import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    constructor(public statusCode: number, 
        public message: string,
        public isOperational: boolean = true    
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    //Handle Zod Validation errors
    if (err.name === "ZodError") {
        return res.status(400).json({
            error: 'Validation Error',
            details: err 
        })
    }

    console.error("Unexpected Error: ", err);

    return res.status(500).json({
        error: "Internal Server Error",
    });
}