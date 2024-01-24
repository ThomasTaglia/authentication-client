export default function formatError(
    error: unknown,
    stringify: boolean = false,
) {
    const errorObject = {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack,
    };

    return stringify ? JSON.stringify(errorObject) : errorObject;
}
