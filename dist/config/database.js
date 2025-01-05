"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { MONGO_URI } = process.env;
const connectDb = () => {
    console.log("inside connect db", MONGO_URI);
    // Connecting to the database
    mongoose_1.default
        .connect(MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    })
        .then((res) => {
        console.log("Successfully connected to database");
    })
        .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};
exports.default = connectDb;
