
import multer from 'multer';
import fs from 'fs';

// Create the 'uploads directory if doesn't exist
const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, uploadDir);
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage}).array("files", 10);

export default upload;