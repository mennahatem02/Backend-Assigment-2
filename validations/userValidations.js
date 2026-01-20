const joi = require('joi');


const createUserSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    age: joi.number().integer().min(0).optional(),
    salary: joi.number().precision(2).positive().required(),
    role: joi.string().valid('user', 'admin' , 'manager').required()
});


const idSchema = joi.object({
    id : joi.number().integer().positive().required()
})

module.exports={
    createUserSchema,
    idSchema
}