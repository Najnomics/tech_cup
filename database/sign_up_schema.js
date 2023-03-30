const notifier = require('node-notifier');
const path = require('path');
const mongoose  = require("mongoose");

const signUpSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },

    date:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true,
        unique:true,
        match:/^\S+@\S+\.\S+$/
    },

    password:{
        type:String,
        require:true
    },

    role:{
        type:String,
        require:true
    },

    payments:{
        type:String,
        default:'not paid'
    },

}
)

const SignUp = mongoose.model('SignUp', signUpSchema);
SignUp.on('save', (doc) => {
    notifier.notify({
        title: 'Success',
        message: 'Sign Up was Successful!',
        icon: path.join(__dirname, 'success.png'),
        wait:true
      });
})

module.exports  = SignUp;