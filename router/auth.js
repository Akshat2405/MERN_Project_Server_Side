const express=require('express');
const router=express.Router();
const User=require("../model/userSchema");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const authenticate=require("../middleware/authenticate");
router.get('/',(req,res)=>{
    res.send('Hello world from the auth.js');
});


//using promises
// router.post('/register',(req,res)=>{
//     const {name,email,phone,work,password,cpassword}=req.body;
//     console.log(name);
//     // console.log(req.body);
//     // res.send("My register page is ready");
//     // res.json({message:req.body})
//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Plz filled the field properly"});
//     }

//     User.findOne({email: email})
//     .then((userExits)=>{
//         if(userExits){
//             return res.status(422).json({error:"Email already exits"});
//         }
//         const user=new User({name,email,phone,work,password,cpassword});
//         user.save().then(()=>{
//             return res.status(201).json({message:"user registered succesfully"});
//         }).catch((err)=>{
//             return res.status(500).json({error:"Failed to registerd"});
//         })
//     }).catch((err)=>{
//         console.log(err);
//     })
    
// });



//using assync await
router.post('/register',async(req,res)=>{
    const {name,email,phone,work,password,cpassword}=req.body;
    // console.log(name);
    // console.log(req.body);
    // res.send("My register page is ready");
    // res.json({message:req.body})
    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Plz filled the field properly"});
    }
    
    try{
        const userExits=await User.findOne({email: email})
        if(userExits){
            return res.status(422).json({error:"Email already exits"});
        } else if(password!=cpassword){
            return res.status(422).json({error:"Password does not match"});
        }
        const user=new User({name,email,phone,work,password,cpassword});

        await user.save();
        // console.log(user); 
        // if(userRegister){
            res.status(201).json({message:"user registered succesfully"});
        // }else{
        //     res.status(500).json({error:"Failed to registerd"});
        // }
    } catch(err){
        console.log(err);
    }
    
    
});

//login route
router.post('/signin',async (req,res)=>{
    // console.log(req.body);
    // res.json({message:"awesome"});
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({error:"Plz filled tehe data"});
        }
        const userLogin=await User.findOne({email: email});
        // console.log(userLogin);

        
        if(!userLogin){
            res.status(400).json({error:"INVALID CREDNTIALS"});
        }
        else{
            const isMatch=await bcrypt.compare(password,userLogin.password);
            if(!isMatch){
                res.status(400).json({error:"INVALID CREDNTIALS"});
            }
            else{
                const token= await userLogin.generateAuthToken();
                console.log(token);
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+258292000000),
                    httpOnly:true
                });
                res.status(202).json({message:"User Loigned succesfully"});
            }
        }
    }
    catch(err){
        console.log(err);
    }
});



//about us ke page ke liye
router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
})

//contactus ke page ke liye user ka data mangane ke liye
router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootUser);
})

router.post('/contact',authenticate,async (req,res)=>{
    try{
        const{name,email,message}=req.body;
        // console.log(req.body);
        if(!name || !email || !message){
            console.log("error in response form");
            return res.status(422).json({error:"Plz filling the field properly"});
        }
        const userContact=await User.findOne({_id: req.userID});
        if(userContact){
            const userMessage=await userContact.addMessage(name,email,message);
            await userContact.save();
            res.status(201).json({message:"user save message succesfully"});
        }
    }
    catch(err){
        console.log(err);
    }
})
router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send(`user will be logout`);
})

module.exports=router;