import mongoose from 'mongoose';

const vietStockOverviewSchema = new mongoose.Schema({
    ordinalNumber: {type: Number, required: true},
    indicator: {type: String, required: true},
    unit: {type: String},
    latestData: {
        chart: {type: String},
        value: {type: Number},
    },
    chartUrl: {type: String}
});

const vietStockOverview = mongoose.model("vietStockOverview", vietStockOverviewSchema);
export default vietStockOverview;