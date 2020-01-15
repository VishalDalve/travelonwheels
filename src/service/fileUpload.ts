import * as multer from 'multer';
import * as path from 'path';

export let UPLOAD_PATH = 'uploads';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname + '_' + new Date().getTime() + path.extname(file.originalname));

      // if (req.params.type == undefined)
      //   cb(null, req.loggedInUser.id + '_upload'  + path.extname(file.originalname))
      // else
      //   cb(null, req.loggedInUser.id + '_' + req.params.type + path.extname(file.originalname))
    }
})

let fileFilter = (req, file, cb) => {
    var extensions = ["image/jpeg", "image/png", "image/jpg", "image/JPEG","image/JPG","image/PNG", "application/pdf", "application/PDF", "application/msword"];
    if(extensions.indexOf(file.mimetype) >= 0){
      cb(null, true);
    }
    else{      
      cb(null, false);
    }
  }


export let upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits:{
              fileSize: 5 * 1024 * 1024           // allowed upto 5mb
            }
 })



var profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {


      //cb(null, req.loggedInUser.id + '_' + new Date().getTime() + path.extname(file.originalname));
      cb(null, file.originalname + '_' + new Date().getTime() + path.extname(file.originalname));

      // if (req.params.type == undefined)
      //   cb(null, req.loggedInUser.id + '_upload'  + path.extname(file.originalname))
      // else
      //   cb(null, req.loggedInUser.id + '_' + req.params.type + path.extname(file.originalname))
    }
})

let profileFilter = (req, file, cb) => {
  var extensions = ["image/jpeg", "image/png", "image/jpg", "image/JPEG","image/JPG","image/PNG"];
  if(extensions.indexOf(file.mimetype) >= 0){
    //cb(null, true);
    cb(null, file.originalname + '_' + new Date().getTime() + path.extname(file.originalname));

  }
  else{
    cb(null, false);
  }
}

let propertyFilter = (req, file, cb) => {
  var extensions = ["image/jpeg", "image/png", "image/jpg", "image/JPEG","image/JPG","image/PNG","video/mp4","video/x-ms-wmv","video/x-msvideo","video/x-flv","video/3gpp","video/MP2T","application/x-mpegURL"];
  if(extensions.indexOf(file.mimetype) >= 0){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

export let propertyupload = multer({ 
  storage: storage,
  fileFilter: propertyFilter,
  limits:{
            fileSize: 100 * 1024 * 1024           // allowed upto 100mb
          }
})

export let profileUpload = multer({ 
    storage: profileStorage,
    fileFilter: profileFilter,
    limits:{
              fileSize: 5 * 1024 * 1024         // allowed upto 5mb
            }
 })
 
