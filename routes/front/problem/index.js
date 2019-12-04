// Modules
const path = require('path');
const multer = require('multer');

const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

const upload = multer({ storage: multer.memoryStorage({}), 
                        fileFilter: function (req, file, callback) {
                            let ext = path.extname(file.originalname).toLowerCase();
                            if( ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' ) {
                                return callback(new Error('Only .png, .jpg, .jpeg images are allowed'));
                            }
                            callback(null, true);
                        },
                        limits: {
                            fileSize: 10 * 1024 * 1024,
                        }});

router.use('/create', frontAuth.admin);
router.get('/create', require('./create').get);
router.post('/create', upload.fields([{ name: 'problem' }, { name: 'solution' }]), require('./create').post);

router.use('/inquiry', frontAuth.login);
router.get('/inquiry', require('./inquiry').get);
router.post('/inquiry', require('./inquiry').post);

router.use('/update', frontAuth.admin);
router.get('/update/:problemID', require('./update').get);
router.post('/update/:problemID', require('./update').post);

module.exports = router;