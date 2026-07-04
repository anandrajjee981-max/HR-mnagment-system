const mongoose = require("mongoose")

const attendschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
 entrytime: {
        type: Date,
        default: Date.now
    },
    exittime: {
        type: Date
    },
    status: {
        type: String,
        enum: ["INSIDE", "OUTSIDE"],
        default: "INSIDE"
    },
    date: {
        type: String,
        default: () =>
            new Date()
            .toISOString()
            .split("T")[0]
    },
    duration: {
        type: Number,
        default: 0
    }

},
{
    timestamps:true
})

module.exports = mongoose.model(
    "attendance",
    attendschema
)