import mongoose from "mongoose";

const { MONGO_URI } = process.env;

const connectDb = () => {
  console.log("inside connect db",MONGO_URI)

  // Connecting to the database
  mongoose
    .connect(MONGO_URI as string, {
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

export default connectDb;