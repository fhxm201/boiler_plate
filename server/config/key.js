if(process.env.NODE_ENV === 'prodution') {
    module.exports = require('./prod'); //배포
}
else{
    module.exports = require('./dev'); 
}

//NODE_ENV: 환경변수