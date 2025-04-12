//@ts-nocheck
import buildingModel from "../models/building-model.js";
import userModel from "../models/user-model.js";

export const getBuilding = async (req, res, next) => {
    try {
        const { building } = req.params;
        // const details = [];
        // for(let i=1; i<=24; i++) {
        //     details.push({
        //         doorNo: `${building}-${i}`,
        //         owner: null,
        //         waterBills: []
        //     });
        // }
        // await buildingModel.create({ name: building, houses: details });
        // res.json({ message: `Block ${building} Success` });
        const buildingDetails = await buildingModel.findOne({ name: building }).populate("houses.owner");
        res.status(200).json({ message: "Building Details Fetched Successfully", buildingDetails });
    } catch (err) {
        next(err);
    }
}

export const getAllBuildings = async (req, res, next) => {
    try {
        const buildings = await buildingModel.find({}).populate("houses.owner");
        res.status(200).json({ message: "Buildings fetched successfully", buildings });
    } catch (err) {
        next(err);
    }
}