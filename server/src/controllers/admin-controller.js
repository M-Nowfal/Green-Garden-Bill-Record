import buildingModel from "../models/building-model.js";
import userModel from "../models/user-model.js";
import waterBuildRecordModel from "../models/water-bill-records-model.js";

function findMonthByNumber(month) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for (let i = 0; i < 12; i++) {
        if ((i + 1) == month) {
            return months[i];
        }
    }
}

export const payWaterBill = async (req, res, next) => {
    try {
        const { doorNo, month, year, amount } = req.body.waterBillDetails;
        if(!await userModel.findOne({ doorNo })) {
            return res.status(404).json({ message: `House ${doorNo} is not registered yet` });
        }
        const payment = await waterBuildRecordModel.create({
            doorNo,
            month: findMonthByNumber(month),
            year,
            amount,
            paid: true
        });

        const updatedBuilding = await buildingModel.findOneAndUpdate(
            { name: doorNo[0], "houses.doorNo": doorNo },
            { $push: { "houses.$.waterBills": payment._id } },
            { new: true }
        );

        if (!updatedBuilding) {
            return res.status(404).json({ message: "Building or house not found" });
        }

        res.status(200).json({ message: "Paid Successfully", paid: true });
    } catch (err) {
        next(err);
    }
}