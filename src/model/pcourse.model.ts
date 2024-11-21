import { Schema, model } from 'mongoose'

const pcourseSchema = new Schema({
    userDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    purchasedCourse: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Courses',
            required: true,
        },
    ],
    purchasedAt: {
        type: Date,
        default: Date.now,
    },
})

const PCourseModel = model('PCourse', pcourseSchema)
export default PCourseModel
