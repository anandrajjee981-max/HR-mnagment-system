import mongoose from "mongoose"

const qrSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        unique: true
    },

    token: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const qrmodel = mongoose.model("QrSession", qrSessionSchema);
export default qrmodel 