import * as mongoose from "mongoose";

class DatabaseConnect {
    static async connectDB() {
        const DB_URL = 'mongodb+srv://langochai11121998:langochai1998@cluster0.odkiv4a.mongodb.net/music';
        return await mongoose.connect(DB_URL);
    }
}

export default DatabaseConnect;