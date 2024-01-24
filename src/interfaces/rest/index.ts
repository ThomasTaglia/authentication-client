import { ExpressRestInterface } from "@swissknife-api-components-nodejs/express-rest-interface";

import CreateUser from "../../core/usecases/CreateUser";
import GetUserIdentifiers from "../../core/usecases/GetUserIdentifiers";
import LoginUser from "../../core/usecases/LoginUser";
import VerifyAccessToken from "../../core/usecases/VerifyAccessToken";
import CreateUserRoute from "./routes/CreateUserRoute";
import GetUserIdentifiersRoute from "./routes/GetUserIdentifiersRoute";
import LoginUserRoute from "./routes/LoginUserRoute";
import VerifyAccessTokenRoute from "./routes/VerifyAccessTokenRoute";

export default function getExpressRestInterface(
    agyoRequestService: ConstructorParameters<typeof ExpressRestInterface>[0],
    logger: ConstructorParameters<typeof ExpressRestInterface>[1],
    configuration: Omit<
        ConstructorParameters<typeof ExpressRestInterface>[2],
        "schemas"
    >,
    usecases: {
        createUser: CreateUser;
        loginUser: LoginUser;
        verifyAccessToken: VerifyAccessToken;
        getUserIdentifiers: GetUserIdentifiers;
    },
) {
    return new ExpressRestInterface(
        agyoRequestService,
        logger,
        { ...configuration },
        [
            CreateUserRoute(usecases.createUser),
            LoginUserRoute(usecases.loginUser),
            VerifyAccessTokenRoute(usecases.verifyAccessToken),
            GetUserIdentifiersRoute(usecases.getUserIdentifiers),
        ],
    );
}
