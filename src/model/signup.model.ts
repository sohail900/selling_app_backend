import { Schema, model } from 'mongoose'

const signupSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)
// hash password before saving
signupSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await Bun.password.hash(this.password)
    }
    next()
})
// generate tokens
// signupSchema.methods.generateTokens = function (age: string) {
//     console.log(age)
//     const id = this._id
//     const token = jwt.sign({ id }, process.env.TOKEN as string, {
//         expiresIn: age,
//     })
//     return token
// }
const SignUpModel = model('Auth', signupSchema)
export default SignUpModel
