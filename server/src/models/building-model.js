import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    houses: [{
        doorNo: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        waterBills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterBill"
        }]
    }]
});

const buildingModel = mongoose.model("Building", buildingSchema);

export default buildingModel;