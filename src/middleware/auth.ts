import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request,Response } from "express";
import {UserRequest } from "../Types/request";
import { userTokenPayload } from "../Types/auth";


const config = process.env;


const verifyToken = (req:UserRequest, res:Response, next:NextFunction) => {

  let token:string|undefined;
  const authHeader = req.headers["authorization"]!;
  // if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract the token part
  // } else {
    // Fallback to token in body or query for backward compatibility
    // token = req.body.token || req.query.token || req.headers["x-access-token"];
  // }

  if (!token) {
     res.status(403).send("A token is required for authentication");
     return
  }
  try {
    const decoded = jwt.verify(token as string, config.TOKEN_KEY as string) as userTokenPayload;
    req.user = decoded;
  } catch (err) {
    res.status(401).send("Invalid Token");
    return
  }
  return next();
};

export default verifyToken;


