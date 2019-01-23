// package that allows node to do lots of server side tasks
const express = require('express');
// a template view engine that works with express/see handlebars
const hbs = require('hbs');
const fs = require('fs');

//need to make a new express app. This is set to the return results
//for calling express as a function. In order to create an app all we have to do
//is use the express method below
var app = express();

//Allow partials for templates
hbs.registerPartials(__dirname + '/views/partials')
//lets us set some express related configurations
app.set('view engine', 'hbs');


app.use((req, res, next)=>{
  var now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  console.log(log);

  fs.appendFile('server.log', log + '\n', (err)=>{
    if (err){
      console.log('Unable to append to server.log.')
    }
  });
  //must use next when using middle ware to make the app keep running
  next();
});

//If you don't use next, the browser wont
//continue so you can use something like below to force to maintenance page
app.use((req, res, next)=>{
res.render('maintenance.hbs')
});

//Setting up middlewear. This allows you configure how your express app works
app.use(express.static(__dirname + '/public'));

//you can add functions as hbs parameters as well
hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
});

//Setting up an HTTP route handler. This sets up the HTTP get request handler.
//The get method requres two arguments you have to pass into get

//1. The first is the URL ('/') is refering to the root of the app.
//2. The second is the function to run. The function that tells express what
//to send back to the person who made the request.

//The function requires 2 arguments. req or request and res or response.
//req: stores lots of information about the request coming in. header/body/method that was made
//res: has a bunch of methods you have access to so you can respond to the http request however you want

app.get('/', (req, res)=> {
//the .send method this will allow us to respond to the request sending some data back
//they will see this as the body data

res.render('home.hbs', {
  pageTitle:'Home Page',
  welcomeMessage:'Hello welcome to my app',
  firstName: 'Jared',
  lastName: 'Cannon',
  hobbies: [
    'skiing', 'boating', 'coding'
  ],
  profilePic:'https://image.jimcdn.com/app/cms/image/transf/none/path/sb5a277b993e28bed/image/if7df22c552ce224c/version/1513112411/image.jpg'
,hackerGif:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcFnnysfwVwu7z5ORlnQNnGWXObcutw_8H5u2vkWI1pc-nurgj',
headerImg:'https://media.giphy.com/media/BjILuRhWMnBaU/giphy.gif'
});
})

//cool hacker gif https://media.giphy.com/media/WoYUq6IYYpkKk/giphy.gif

//https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcFnnysfwVwu7z5ORlnQNnGWXObcutw_8H5u2vkWI1pc-nurgj

app.get('/about', (req, res)=> {
  //render allows you to render any templates you have with the current view engine
res.render('about.hbs', {
  pageTitle:'About Page'
});
})

app.get('/bad', (req, res)=> {
res.send({errorMessage:'Unable to complete request'});
})

//we need this to bind the application to a port on our machine. Without this
//The app will not run
//This is a common port for developing locally
app.listen(3000, ()=>{
  console.log('server is up on port 3000');
});
