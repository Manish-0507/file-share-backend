
const mongoose = require('mongoose');

    // Database connection 🥳
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })
        .then(() => {
            console.log('database connected!!');
        }).catch((err) => {
            console.log(`err:${err}`)
    })



