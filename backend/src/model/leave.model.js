import mongoose from "mongoose";
const leaveschema = new mongoose.Schema({
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
from :{
    type :String ,
     required: true
},
to :{
    type : String,
     required: true
},
reason :{
    type : String,
     required: true
},
status :{
    type : String ,
    enum : ["pending","approved","rejected"],
    default : "pending"
}

})

const leavemodel = await mongoose.model("leave",leaveschema)

export default leavemodel










