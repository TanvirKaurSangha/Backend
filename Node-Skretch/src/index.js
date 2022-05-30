var express = require('express');

var path = require('path');
var app = express();
var PORT = 3009;
var apiRoutes = require('./api-routes/api-routes');
require('./services/mongoService.js');

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', apiRoutes);

app.listen(PORT, () => console.log('Server is running on PORT:', PORT));