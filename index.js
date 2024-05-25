var express = require('express');
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

require('dotenv').config();

var app = express();

app.use(cors());

// Define the directory for serving static files
app.use('/public', express.static(process.cwd() + '/public'));

// Define the directory for storing uploaded files
var UPLOAD_FOLDER = 'uploads';
var upload = multer({ dest: UPLOAD_FOLDER });

// Define the allowed file extensions
var ALLOWED_EXTENSIONS = new Set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']);

// Function to check if a file has an allowed extension
function allowedFile(name) {
    var ext = path.extname(name).toLowerCase();
    return ALLOWED_EXTENSIONS.has(ext.substring(1));
}

// Route handler for serving the index.html file
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Route handler for handling file uploads and returning file metadata
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
    console.log(req.file);  // Log the file object for debugging
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!allowedFile(req.file.originalname)) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'File type not allowed' });
    }

    var fileInfo = {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
    };

    res.json(fileInfo);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
});




