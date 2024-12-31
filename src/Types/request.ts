import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { userTokenPayload } from "./auth"

export interface UserRequest extends Request{
    user?:userTokenPayload
}

