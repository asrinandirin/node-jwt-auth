const mongoose = require('mongoose')
const {isEmail} = require('validator')
const Joi = require('joi')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email."] 
    },
    password: {
        type: String,
        required: [true, "Please enter an email"],
        minlength: [5, "minimum password length is 5 characters."]
    }
})

// Fire a function before doc saved to db.
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

//Static method to login user
userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({ email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Authantication Error')
    }
    throw Error('Incorrect Email')
}

const User = mongoose.model('user', userSchema)

const validateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    return schema.validate(user)
}

exports.validate = validateUser
exports.User = User
