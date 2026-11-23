const mongoose=require("mongoose");
const comment=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},text:{type:String,required:true,trim:true,maxlength:500}},{timestamps:true});
const schema=new mongoose.Schema({author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},content:{type:String,required:true,trim:true,maxlength:2000},imageUrl:{type:String,default:""},likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],comments:[comment]},{timestamps:true});
module.exports=mongoose.model("Post",schema);
