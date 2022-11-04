//const UserModel = require('./models/user')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const session = require('express-session');
const nodeMailer = require('nodemailer')
const randomstring = require('randomstring');

const config = require('../config/config')







const loadRegister = async(req,res)=>{
    try {
       
        res.render('register')
        
    } catch (error) {
        console.log(error);
    }
}

//secure password function
const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }
}

//send email on register
const sendVerifyEmail = async(name,email,user_id)=>{
    try {
        
      const transport =   nodeMailer.createTransport({
            host:'smtp.server.com',
            //port:2525,
            //secure:false,
            service:'gmail',
            //requireTLS:true,            
            auth:{
                user:config.myEmail,
                pass:config.myPassword
            }
        })

        const mailOption = {
            from:config.myEmail,
            to:email,
            subject:'verification mail',
            html:'<P> Hi '+ name +' , please click here <a href="http://localhost:200/verify?id='+ user_id+'">verify</a> your mail </p>'
        }
        transport.sendMail(mailOption, function(error,info){
            if (error) {
                console.log(error);
            } else {
                console.log('email send :' , info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

//send forget email
const sendForgetEmail = async(name,email,token)=>{
    try {
        
        const transporter = nodeMailer.createTransport({
            host:'smtp.server.com',
            //port:2525,
            //secure:false,
            service:'gmail',
            auth:{
                user:config.myEmail,
                pass:config.myPassword
            }
        });
        
        const mailOption={
            from:config.myEmail,
            to:email,
            subject:'Reset your Password',
            html:'<P> Hi '+ name +' , please click here <a href="http://localhost:200/forget-password?token='+ token +'"> Reset </a> your password </p>'

        }
        transporter.sendMail(mailOption, function(error,info){
            if (error) {
                console.log(error);
            } else {
                console.log('email send:' + info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

//send register user in database

const insertUser = async(req,res)=>{
    try {
        
        const sPassword = await securePassword(req.body.password);

        const user = new User({
            name:req.body.name,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            image:req.file.filename,
            age:req.body.age,
            password:sPassword,
            

        })
        //promise return
        const userData = await user.save();
        if (userData) {
            sendVerifyEmail(req.body.name, req.body.email, userData._id)
            res.render('login',{message:'Registration successfully ! Please verify your email'})
        } else {
            res.render('register',{message:'Registration failed'})

        }

    } catch (error) {
        console.log(error.message);
    }
}

//verify email by our team

const verifyEmail = async(req,res)=>{
    try {
        
        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})

        console.log(updateInfo);
        res.render('email-verified')

    } catch (error) {
        console.log(error.message);
    }
}

//login
const loginLoad = async (req,res)=>{
    try {
        
        res.render('login')


    } catch (error) {
        console.log(error.message);
    }
}
//landing page
const landingPage = async(req,res)=>{
    try {
        res.render('index')
    } catch (error) {
        console.log(error.message);
    }
}
//login verify 

const loginVerify = async(req,res)=>{
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email})
        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login',{message:'Please verify your email'})
                } else {
                    req.session.isAuth= true;
                    res.render('main',{message:'Login Successfully'})
                }
               
            } else {
                res.render('login',{message:'Email and password incorrect !!'})

            }


        } else {
            res.render('login',{message:'Email and password incorrect !!'})
        }

    } catch (error) {
        console.log(error.message);
    }
}
//forget password
const forgetLoad = async(req,res)=>{
    try {
        res.render('forget')
    } catch (error) {
        console.log(error.message);
    }
}

//forget password email verify
const forgetVerifyEmail = async(req,res)=>{
    try {
        
        const email = req.body.email;

        const userData = await User.findOne({email:email})

        if (userData) {
            
            if (userData.is_verified === 0) {
                res.render('forget',{message:'Your Email is incorrect !!!'})
                
            } else {
                const randomString = randomstring.generate();
                const updateData = await User.updateOne({email:email},{$set:{ token:randomString }})

                sendForgetEmail(userData.name, userData.email, randomString)
                res.render('forget',{message:'Please  check Your email and chang the password. '})

            }

        } else {
            res.render('forget', {message:'Your Email is incorrect !!!'})
        }

    } catch (error) {
        console.log(error.message);
    }
}

//check Forget email token
const forgetPasswordLoad = async(req,res)=>{
    try {
       
        const token = req.query.token;
        const tokenData = await User.findOne({token:token})

        if (tokenData) {
            res.render('forget-password', {user_id:tokenData._id})

        } else {
            res.render('404', {message:'Token is invalid'})
        }

    } catch (error) {
        console.log(error.message);
    }
}

//change Password

const changePassword = async(req,res)=>{
    try {
        
        const password = req.body.password;
        const user_id = req.body.users_id;

        const newPassword = await securePassword(password);

        const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:newPassword, token:''}})
        

       // console.log(updatedData);

       // res.render('forget-password',{message:'change password'})
        res.redirect('login')
    } catch (error) {
        console.log(error.message);
    }
}


//main page view
const loadMain = async(req,res)=>{
    try {
        
        res.render('main')

    } catch (error) {
        console.log(error.message);
    }
}

//logout

const logout = async(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        
        res.redirect('/')
    })
}

module.exports = {
    loadRegister,
    insertUser,
    verifyEmail,
    loginLoad,
    loginVerify,
    loadMain,
    forgetLoad,
    forgetVerifyEmail,
    forgetPasswordLoad,
    changePassword,
    logout,
    landingPage
}
