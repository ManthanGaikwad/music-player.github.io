const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
   
    name:{
        type:String,
        required:true
    },
   
    email:{
        type:String,
        required:true,
        unique:true
    },
     gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    }
   
})

module.exports = mongoose.model('User', userSchema)