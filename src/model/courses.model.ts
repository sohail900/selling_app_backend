import { Schema, model } from 'mongoose'

const coursesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)
const CoursesModel = model('Courses', coursesSchema)
export default CoursesModel
