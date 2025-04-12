import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    doorNo: {
        type: String,
        required: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
        required: true
    }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
