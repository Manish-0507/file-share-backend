const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function fetchData() {
    //old files than 24 hours fetch them
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)//aaj ki date se 24 hours back.
    const files = File.find({ createdAt: { $lt: pastDate } });
    
    if (file.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);//delete from storage means from our upload folder
                await file.remove();//remove from database
                console.log('work done!!')
            } catch (err) {
                console.log(`error while deleting file ${err}`);
           }
        }
        console.log('job done!!');
    }
    
}

fetchData().then(process.exit())
    
