const mongoose=require("mongoose");
const schema=new mongoose.Schema({username:{type:String,required:true,unique:true,trim:true,lowercase:true,minlength:3,maxlength:24},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},name:{type:String,required:true,trim:true,maxlength:60},bio:{type:String,default:"",maxlength:240},avatar:{type:String,default:""},followers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]},{timestamps:true});
module.exports=mongoose.model("User",schema);
