import mongoose from 'mongoose';

const vietStockCPISchema = new mongoose.Schema({
    xem_theo: {type: String, required: true},
    month: {type: String, required: false},
    year: {type: String, required: true},
    value: [{  
        category: {type: String},
        chi_tieu: {type: String},
        don_vi: {type: String},
        gia_tri: {type: String}
    }]
});

const vietStockCPI = mongoose.model("vietStockCPI", vietStockCPISchema);
export default vietStockCPI;