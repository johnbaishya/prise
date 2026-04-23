"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookLogin = exports.googleLogin = exports.verifyAuthentication = exports.ChangeUserProfilePicture = exports.getUser = exports.updateUser = exports.userLogin = exports.userRegister = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../../libs/auth");
const reqest_1 = require("../../libs/reqest");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
// for register=======================================================================================================
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [Common]
 *     summary: User Register
 *     description: Register a user and return created user with token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: created user with token.
 *       500:
 *         description: some error.
 */
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;
        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
            return;
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = yield user_model_1.default.findOne({ email });
        if (oldUser) {
            res.status(409).send("User Already Exist. Please Login");
        }
        //Encrypt user password
        let encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create user in our database
        const user = yield user_model_1.default.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });
        // Create token
        const params = {
            id: user.id,
            email,
            first_name: user.first_name,
            last_name: user.last_name
        };
        const token = (0, auth_1.createToken)(params);
        // save user token
        let newUser = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: token,
        };
        // return new user
        res.status(201).json(newUser);
    }
    catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});
exports.userRegister = userRegister;
// register ends here ==============================================================================================
// for login  ======================================================================================================
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     operationId: userLogin
 *     tags: [Common]
 *     summary: User login
 *     description: Authenticate an employee and return a session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: user detail with token.
 *       401:
 *         description: Invalid credentials.
 */
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;
        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All inputs are required");
        }
        // Validate if user exist in our database
        const user = yield user_model_1.default.findOne({ email });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            // Create token
            const params = {
                id: user.id,
                email,
                first_name: user.first_name,
                last_name: user.last_name
            };
            const token = (0, auth_1.createToken)(params);
            // save user token
            user.token = token;
            let newUser = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token: token,
            };
            // user
            res.status(200).json(newUser);
        }
        else {
            res.status(400).send("Invalid Credentials");
        }
    }
    catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});
exports.userLogin = userLogin;
/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     operationId: update user profile
 *     tags: [Common]
 *     summary: User profile update
 *     description: update the current user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { first_name, last_name } = req.body;
        let newBody = { first_name, last_name };
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "user not found");
            return;
        }
        let uUser = yield user_model_1.default.findByIdAndUpdate(userId, newBody, { new: true });
        (0, reqest_1.sendSuccessResponse)(res, uUser);
    }
    catch (error) {
        console.log("error from update User", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.updateUser = updateUser;
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: user profile
 *     description: get the current user profile.
 *     responses:
 *       200:
 *         description: user.
 *       401:
 *         description: Invalid credentials.
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "user not found");
            return;
        }
        let uUser = yield user_model_1.default.findById(userId);
        (0, reqest_1.sendSuccessResponse)(res, uUser);
    }
    catch (error) {
        console.log("error from get User", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.getUser = getUser;
/**
 * @swagger
 * /api/user/profile-pic:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: User profile picture update
 *     description: update the current user profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary # Indicates file upload in Swagger
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 *
 */
const ChangeUserProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "user not found");
            return;
        }
        let file = req.file;
        if (!file) {
            return;
        }
        let image = file;
        let uUser = yield user_model_1.default.findByIdAndUpdate(userId, { profile_pic: image.location }, { new: true });
        (0, reqest_1.sendSuccessResponse)(res, uUser);
    }
    catch (error) {
        console.log("error from changeUserProfilePicture");
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.ChangeUserProfilePicture = ChangeUserProfilePicture;
// to check if the token present in the header is valid or not
/**
 * @swagger
 * /api/user/verify-token:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: user authentication status
 *     description: check if the provided bearer token is valid
 *     responses:
 *       200:
 *         description: token is valid.
 *       401:
 *         description: Invalid token.
 */
const verifyAuthentication = (req, res) => {
    try {
        (0, reqest_1.sendResponseWithMessage)(res, 200, "token is valid");
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, 401, "invalid token");
    }
};
exports.verifyAuthentication = verifyAuthentication;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID);
    const { idToken } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID, // Must match the one used in your React Native app
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const last_name = payload.familyName;
        const first_name = payload.name ? payload.name : "user";
        const profile_pic = payload.picture;
        const oldUser = yield user_model_1.default.findOne({ email });
        let user = null;
        if (!oldUser) {
            user = yield user_model_1.default.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                profile_pic,
            });
        }
        else {
            user = yield user_model_1.default.findByIdAndUpdate(oldUser.id, { first_name, last_name, profile_pic }, { new: true });
        }
        const params = {
            id: user.id,
            email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        };
        const token = (0, auth_1.createToken)(params);
        // save user token
        user.token = token;
        let newUser = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_pic: user.profile_pic,
            role: user.role,
        };
        const newResponse = {
            user: newUser,
            token,
        };
        res.status(200).json(newResponse);
        return;
    }
    catch (err) {
        console.log(err);
        (0, reqest_1.sendErrorResponse)(res, err);
    }
});
exports.googleLogin = googleLogin;
const facebookLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID);
    const { accessToken } = req.body;
    try {
        const response = yield axios_1.default.get("https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token=" + accessToken);
        const payload = response.data;
        const email = payload.email;
        const last_name = payload.last_name;
        const first_name = payload.first_name ? payload.first_name : "user";
        const profile_pic = (_b = (_a = payload.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url;
        const facebook_id = payload.id;
        const oldUser = yield user_model_1.default.findOne({ facebook_id });
        let user = null;
        if (!oldUser) {
            user = yield user_model_1.default.create({
                first_name,
                last_name,
                email, // sanitize: convert email to lowercase
                profile_pic,
                facebook_id,
            });
        }
        else {
            user = yield user_model_1.default.findByIdAndUpdate(oldUser.id, { first_name, last_name, profile_pic, email }, { new: true });
        }
        const params = {
            id: user.id,
            email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        };
        const token = (0, auth_1.createToken)(params);
        // save user token
        user.token = token;
        let newUser = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_pic: user.profile_pic,
            role: user.role,
        };
        const newResponse = {
            user: newUser,
            token,
        };
        res.status(200).json(newResponse);
        return;
    }
    catch (err) {
        console.log(err);
        (0, reqest_1.sendErrorResponse)(res, err);
    }
});
exports.facebookLogin = facebookLogin;
