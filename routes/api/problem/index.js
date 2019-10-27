const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use('/upload', auth.admin);
router.get('/upload', function (req, res) {
       res.render('upload', {
           token: req.query.token
       }); 
});
router.post('/upload',
            upload.fields([{ name: 'problem' }, { name: 'solution' }]),
            controller.upload);

router.use('/inquiry', auth.login)
router.post('/inquiry', controller.inquiry);

module.exports = router;