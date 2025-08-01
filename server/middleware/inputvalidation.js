import joi from "joi"
import schemas from "../validationschemas/Validation.js"

function Validation(path, req){
    const thisSchema = schemas[path]
    function ret(req,res,next){
    const {error, value} = thisSchema.validate(req.body, { abortEarly: false })
    console.log("error", error)
    if(error){
        const error1 =  Error (error.details[0].message)
        error1.code = 404;
        throw error1;
    }
    else{
        if(path === "updateuser2"){
            req.user.id = req.body.id || req.user.id;
        }
        console.log("clear")
        next()
    }
}
return ret;
}

export default Validation;