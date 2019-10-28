const path = require('path');
const multer = require('multer');
const router = require('express').Router();

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

router.use('/create', auth.admin);
router.get('/create', function (req, res) {
       res.render('problem/create', {
           token: req.query.token
       }); 
});
router.post('/create',
            upload.fields([{ name: 'problem' }, { name: 'solution' }]),
            controller.create);

router.use('/inquiry', auth.login)
router.post('/inquiry', controller.inquiry);

module.exports = router;