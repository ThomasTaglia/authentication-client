import { Logger } from "@swissknife-api-components-nodejs/logger";

export default function logStepAndRethrow(
    logger: Logger,
    usecase: string,
    action: string,
) {
    return (error: unknown) => {
        logger.error({
            type: usecase,
            action: action,
            message: (error as any).message,
        });

        throw error;
    };
}
