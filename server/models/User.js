const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const { use } = require('bcrypt/promises');
const saltRounds = 10; //숫자만큼 비번 암호화
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unnique: 1
    },
    
    password:{
        type: String,
        minlength: 5
    },
    
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type:Number,
        default: 0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;

if(user.isModified('password')) {
    //비번 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err) 

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err) 
            user.password = hash
            next()
            //user.password-> 입력한 원래의 비번
            //hash-> 암호화된 비번
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb) {
    //plainPassword=931103  암호화된 비번="$2b$10$a48TEbfuJtqT/1cWgjvX/.UJ8/X5KGSdjNuTA346azhG4MD4Tem0q"
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user =  this;
    //jsonwdbtoken을 이용하여 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')    
    // user._id + 'secertToken' = token
    // ->
    // 'secertToken' -> user._id
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저아이디 이용하여 찾은 후 
        //클라이언트에서 가져온 토큰과 db에 보관된 토큰과 일치하는 지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User =mongoose.model('User', userSchema)

module.exports = { User }