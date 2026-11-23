require("dotenv").config();
const express=require("express"), mongoose=require("mongoose"), cors=require("cors"), path=require("path");
const app=express();
app.use(cors()); app.use(express.json({limit:"1mb"})); app.use(express.static(path.join(__dirname,"../frontend")));
app.get("/api/health",(req,res)=>res.json({status:"ok"}));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users",require("./routes/users"));
app.use("/api/posts",require("./routes/posts"));
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({message:err.message||"Server error"});});
const port=process.env.PORT||3000;
if(!process.env.MONGODB_URI||!process.env.JWT_SECRET){console.error("Set MONGODB_URI and JWT_SECRET in the root .env file.");process.exit(1);}
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`SocialHub running at http://localhost:${port}`))).catch(e=>{console.error("MongoDB connection failed:",e.message);process.exit(1);});
