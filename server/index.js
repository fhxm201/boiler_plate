const express = require('express')
const app = express() 
const port = 5000 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{

}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!')) 

app.get('/api/hello',(req,res) => {
  res.send("안녕하세요")
})

//회원가입 시 필요한 정보들을 client에서 가져오면
//데이터 베이스에 넣어준다
app.post('/api/users/register', (req, res) =>{

  const user= new User(req.body)

user.save((err, userInfo) => {
  if (err) return res.json({ success:false, err})
  return res.status(200).json({
    success: true
    })
  })
})

app.post('/api/users/login', (req, res)=> {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email}, (err, user) =>{
    if(!user) {
    return res.json({
      loginSuccess: false,
      message:"이메일에 해당하는 유저가 없습니다."
    })
  }

  //요청된 이메일이 데이터베이스에 있다면 비번이 옳은지 확인
  user.comparePassword(req.body.password, (err,isMatch) =>{
    if(!isMatch)
    return res.json({loginSuccess: false,message:"비밀번호가 틀렸습니다." })

    //비번까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //token을 쿠키 or 로컬스토리지에 저장함
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

//Auth Route
// role 1 어드민 role 2 특정 부서 어드민
// role 0 -> 일반유저, role 0이 아니면 관리자
app.get('/api/users/auth',auth, (req,res)=> {

  //이 곳까지 미들웨어를 통과해왔다는 얘기는 Authentication이 true라는 뜻

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ?  false: true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname:req.user.lastname,
    role: req.user.role,
    inmage: req.user.image
  })
})

 app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => 
console.log('Exammple app listening on port ${port}!'))