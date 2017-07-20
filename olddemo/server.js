var express= require('express');
var app=express();
app.get('/',(req,res)=>{
    res.send('D3 API Test');
});
app.use(express.static('./'));
app.listen(3000,()=>{
    console.log('server listening port 3000');
});