import joi from "joi"

const schemas = new Map()

schemas["adduser"] = joi.object({
    username: joi.string().min(1).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().required(),
    role: joi.number().required()
})

schemas["addtask"] = joi.object({
    task: joi.string().min(1).required(),
    deadline: joi.date().required(),
    assigned: joi.string().min(1).required(),
    assignedby: joi.string().min(1).optional()

})

schemas["updateuser"] = joi.object({
    username: joi.string().min(1).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().required(),
})

schemas["progress"] = joi.object({
    taskid: joi.number().required(),
    comments: joi.string().min(1).required(),
    type:joi.number().min(0).max(1).required(),
    date: joi.date().required()
})

schemas["addteam"] = joi.object({
    lead: joi.number().required(),
    teamName: joi.string().min(1).required(),
    members: joi.array().items(joi.number().min(1).required()).min(1).required()
})

schemas["updateuser2"] = joi.object({
    id: joi.number().required(),
    username: joi.string().min(1).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().required(),
    role: joi.number().required()
})
export default schemas;