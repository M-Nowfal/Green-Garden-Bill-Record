import mongoose from "mongoose";

const waterBillSchema = new mongoose.Schema({
    doorNo: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: 150
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: false
    }
});

const waterBilldRecordModel = mongoose.model("WaterBill", waterBillSchema);

export default waterBilldRecordModel;