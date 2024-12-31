import mongoose from "mongoose";

const { MONGO_URI } = process.env;

const connectDb = () => {

  // Connecting to the database
  mongoose
    .connect(MONGO_URI as string, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

export default connectDb;