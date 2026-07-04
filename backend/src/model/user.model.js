import mongoose from 'mongoose'


const userschema = new mongoose.Schema({

name : {
    type : String ,
    unique : true 
},
email : {
     type : String ,
    required : true ,
    unique : true 
},
password :{
    type : String ,
    required : true ,
    select : false
},
role : {
    type : String ,
    enum : ["admin","employee"],
    default : "employee",

},
department :{
    type : String ,
    requires : true 
},
salary :{
    type : Number 
},
phone : {
    type : Number
},
address : {
    type : String,
    required : true 
},
profilePic :{
    type : String ,
    default : "https://i.pinimg.com/736x/b0/19/ac/b019ace0a5650d6325977291535877ec.jpg"
}

})

const usermodel = new mongoose.model("users",userschema)
export default usermodel

