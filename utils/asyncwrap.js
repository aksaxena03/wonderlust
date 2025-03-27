module.exports=(fn)=>{return (req,res,next)=>{
    fn(req,res,next).catch(next)
}}
    

// function Asyncwrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch((err)=>next(err))
//     }
// }