const mongoose=require('mongoose');
const DB=process.env.DATABSE;

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("conneectiton succesful");
}).catch((err)=> console.log(`no connections`));