import mongoose from 'mongoose';

const vietStockGDPSchema = new mongoose.Schema({
    xem_theo: {type: String, required: true},
    quarter: {type: String, required: false},
    year: {type: String, required: true},
    value: [{  
        category: {type: String},
        chi_tieu: {type: String},
        don_vi: {type: String},
        gia_tri: {type: String}
    }]
});

const vietStockGDP = mongoose.model("vietStockGDP", vietStockGDPSchema);
export default vietStockGDP;