import * as mongoose from "mongoose";
import * as process from "process";

class DatabaseConnect {
    static async connectDB() {
        const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odkiv4a.mongodb.net/music`;
        return await mongoose.connect(DB_URL);
    }
}

export default DatabaseConnect;
