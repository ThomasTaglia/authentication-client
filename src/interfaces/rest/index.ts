import { ExpressRestInterface } from "@swissknife-api-components-nodejs/express-rest-interface";

import CreateUser from "../../core/usecases/CreateUser";
import LoginUser from "../../core/usecases/LoginUser";
import CreateUserRoute from "./routes/CreateUserRoute";
import LoginUserRoute from "./routes/LoginUserRoute";

export default function getExpressRestInterface(
    agyoRequestService: ConstructorParameters<typeof ExpressRestInterface>[0],
    logger: ConstructorParameters<typeof ExpressRestInterface>[1],
    configuration: Omit<
        ConstructorParameters<typeof ExpressRestInterface>[2],
        "schemas"
    >,
    usecases: { createUser: CreateUser; loginUser: LoginUser },
) {
    return new ExpressRestInterface(
        agyoRequestService,
        logger,
        { ...configuration },
        [
            CreateUserRoute(usecases.createUser),
            LoginUserRoute(usecases.loginUser),
        ],
    );
}
