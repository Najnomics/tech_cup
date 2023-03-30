require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.SECRET_KEY);
const db = require('./database/connection');
const SignUp = require('./database/sign_up_schema')
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

let package = '';
let inputedEmail = '';
let inputedName = '';
let reply = '';
let notify = 'id';
let number = 0;
const packages = ['Free', 'Basic', 'Pro']
const price = [29.99, 49.99];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth()+1;
const day = date.getDate();
const time = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
})
const currentDate = `${day}-${month}-${year},  ${time}`
console.log(currentDate);
app.get('/', (req, res) => {
    res.render('pages/index', {notify:notify, packages:packages, price:price});
})

app.get('/admin', async (req, res) => {
    const users = await SignUp.find({});
    try {
        //console.log(users);
    } catch(err) {
        console.log(err)
    }
        const filter = {email:inputedEmail};
        const update = {payments:'payed'};
        const payedUsers =  await SignUp.findOneAndUpdate(filter, update, {new:true});
        
        try{
            if (payedUsers === null) {
                res.render('pages/admin',{users:users, number:number, reply:reply, inputedName:inputedName, package:package})
            } else {
            inputedName = payedUsers.name;
            console.log(payedUsers)
            res.render('pages/admin',{users:users, number:number, reply:reply, inputedName:inputedName, package:package})
            }
            
        } catch(err) {
            console.log(err)
        }
})

app.get('/sign_up', (req, res) => {
    
    res.render('pages/sign_up')
})

app.post('/sign_up', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    

    const inputs = new SignUp({
        name:name,
        date:currentDate,
        email:email,
        role:role,
        password:password
    })

const result = await SignUp.findOne({email:email})

try {
    if (!result) {
        inputs.save();
        notify = 'success';
        reply = 'sign'
        number++;
        res.redirect('/');

    } else {
        res.write('<h1>User Exist</h1>');
        res.end();
    }
} catch(err) {
    console.log(err);
}


    console.log(req.body)
})

app.post('/admin', (req, res) => {
    number--;
    res.redirect('/admin')
})

app.get('/success', (req,res) => {
   
    res.render('pages/success',{package:package})
})

app.get('/cancel', (req,res) => {
    res.render('pages/cancel', {package:package})
})

app.post('/payment', async (req, res) => {
    const price = req.body.price;
    const choice = req.body.choice;
    const Email = req.body.email
    console.log(req.body)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: choice,
            },
            unit_amount: price*100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://fine-teal-chicken-tie.cyclic.app/success',
      cancel_url: 'https://fine-teal-chicken-tie.cyclic.app/cancel',
      customer_email: Email
      
    });
    let url = session.url
    if (url === session.url) {
        console.log(url);
        reply = 'good';
        package = choice
        inputedEmail = Email;
        number++;

        res.redirect(session.url)
    } else {
        res.redirect('/cancel')
    }
    
})

app.post('/remove', async (req, res) => {
    const email = req.body.email;
    const clear = await SignUp.findOneAndDelete({email:email});
    res.redirect('/admin')
})

app.listen(process.env.PORT, () => {
    console.log(`Sever up and running on port ${process.env.PORT}`);
})