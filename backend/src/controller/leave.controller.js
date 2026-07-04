import leavemodel from "../model/leave.model.js";

 export async function submitleave(req,res){
try{
let user = req.user.id  
const {from , to , reason} = req.body
if (!from || !to || !reason) {
    return res.status(400).json({
        message: "All fields are required"
    });
}
if (new Date(from) > new Date(to)) {
    return res.status(400).json({
        message: "From date cannot be after To date"
    });
}
const leave = await leavemodel.create({
    user : user ,
    from : from ,
    to : to , 
    reason : reason 
})
res.status(200).json({
    message : "submit suceessfully"
})


}
catch(err){
    console.log(err)
    return res.status(500).json({
        message : "internal server error"
    })
}

 }

 export async function leavelist(req,res){
    try{
let user = req.user.id
const check = await leavemodel.find({ user: user });
if(!check){
      
    return res.status(404).json({
        message : "internal server error"
    })
}
res.status(200).json({
    message : "leave list",
    check
})


    }
    catch(err){
          console.log(err)
    return res.status(500).json({
        message : "internal server error"
    })
    }
 }








