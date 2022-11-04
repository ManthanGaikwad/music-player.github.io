const express = require('express');
const { Cookie } = require('express-session');
const session = require('express-session');
const MongodbSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')

const app = express();

const UserModel = require('./models/user')

const config = require('./config/config')


const mongoUrl = config.mongoConn

//database connection
mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((res)=>{
    console.log('connect database');
})

const store = new MongodbSession({
    uri:mongoUrl,
    collection:'mySession'
})

//session
app.use(
    session({
        secret:config.sessionSecret,
        resave:false,
        saveUninitialized:false,
        store:store
       
})
);

//authentication

const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('login')
    }
}

//view engine
app.set('view engine', 'ejs');
//app.set('views', './views/users');

app.use(express.urlencoded({extended:true}));

//
app.use(express.static('images'))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(express.static('public'))
app.use('/public',express.static(path.join(__dirname,'public')))

//multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'./public/userImages'))
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null,name)
    }
})

const upload = multer({storage:storage});


const userController = require('./usercontrollers/userControllers')


app.get('/register',userController.loadRegister);

app.post('/register',upload.single('image'),userController.insertUser)

app.get('/verify',userController.verifyEmail)

//app.get('/',userController.loginLoad)
app.get('/login',userController.loginLoad)
app.post('/login',userController.loginVerify);


app.get ('/main',isAuth,userController.loadMain)

app.get('/forget',userController.forgetLoad)
app.post('/forget',userController.forgetVerifyEmail)

app.get('/forget-password',userController.forgetPasswordLoad)
app.post('/forget-password',userController.changePassword)


app.post('/logout',userController.logout)


app.get('/',userController.landingPage)








app.listen(200,console.log('server running 200'));