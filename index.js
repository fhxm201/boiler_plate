const express = require('express') //모듈 가져오기
const app = express() 
const port = 5000 //포트번호

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://fhxm201:1234@boilerplate.1y27u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
}) //HEllo World 출력

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
