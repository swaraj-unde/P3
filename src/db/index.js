import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Error in connecting the Database! ", error);
        process.exit(1);
    }
};

export default connectDB;
