import mongoose from 'mongoose'

mongoose
    .connect('mongodb://localhost:27017/selling_course')
    .then(() => {
        console.log('Database connected successfully!!')
    })
    .catch((err) => {
        console.log(err)
    })
