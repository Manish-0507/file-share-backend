const router = require('express').Router();
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');//destructuring {version 4 ka uuid :uuid4};
const fileStorage_path = path.join(__dirname ,'../uploads');

//Multer configuration
let storage = multer.diskStorage({//file:jo bhi hum upload krenge
    destination: (req, file, cb) => cb(null,fileStorage_path) ,//callback(error,path to store file) 
    filename: (req, file, cb) => {//file ka naam set kr skte h
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 }, })//1mb *100 = 100mb
    .single('myfile');//single means hme single file send krni h ek baar me .front end se jo hum name attribute set krenge wo hi hme yha likhna h.wha likha h js me dekh jaake formData send krte waqt "myfile";


router.post('/', (req, res) => {
    //store File
    upload(req, res, async (err) => {//agr callback m koi error bheja h to multer() ne;
        
      if (err) {
        return res.status(500).send({ error: err.message });
        }
        //Store into Database
        const file = new File({
            filename: req.file.filename,//by multer
            uuid: uuidv4(),//unique uuid will be generated.
            path: req.file.path,//ye path multer de deta h destination wagra me filename add kr kra kde deta h.
            size: req.file.size
        });
        const response = await file.save();
      res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
     
        // //http://localhost:3000/files/2343443jfjdfjdh-rkwjfjshdfjshf
      });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    //validate
    if (!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from db 
  try {
  
      const file = await File.findOne({ uuid: uuid });
    
      if (file.sender) {//if sender has sent email already means not to send again and again...
      return res.status(422).send({ error: 'Email already sent once.'});
    }
   
      file.sender = emailFrom;
      file.receiver = emailTo;
      const response = await file.save();
    
      // send mail
    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    })
    .then(() => {
      return res.json({success: true});
    })
    .catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
  }
  catch (err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}

});

module.exports = router;