const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PORT = process.env.PORT || 5000,
  express = require('express'),
  app = express();

app.get('/', (req, res) => res.send('This app is working!!!'));

app.listen(PORT, () => console.log('Example app listening on port 3000!'));

mongoose.Promies = global.Promise;
mongoose.connect('mongodb://barceolga:Puchatek152023@ds135061.mlab.com:35061/myfirstdatabase', {
      useMongoClient: true
});

//new user Schema
const userSchema = new Schema({
    name: String,
    username: { type: String, required:true, unique: true },
    password: { type: String, required: true},
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//Mongoose schema method

userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

//pre-save method

userSchema.pre('save', function(next) {
  //here we're getting the current time value
  const currentDate = new Date();

  //here we're putting the current time into the field
  this.updated_at = currentDate;

  if (!this.created_at) {
      this.created_at = currentDate;
  }

  //next() is a function that goes into the next hook in order to beeing executed, before or after the request
  next();
});
const User = mongoose.model('User', userSchema);
// the instancies of User's class
const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});

kenny.manify(function(err, name) {
    if (err) throw err;
    console.log('Your new name is: '+ name);
})

/*kenny.save(function(err) {
    if(err) throw err;
    console.log('User has been saved');
})*/

const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
})

benny.manify(function(err, name) {
    if(err) throw err;
    console.log('Your new name is: '+ name);
})

/*benny.save(function(err){
    if(err) throw err;
    console.log('User ' + benny.name + ' has been saved');
})*/

const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
})

mark.manify(function(err, name) {
    if(err) throw err;
    console.log('Your new name is: '+ name);
})

/*mark.save(function(err) {
    if(err) throw err;
    console.log('User ' + mark.name + ' has been saved')
})*/

//Finding all users usinng Promise
/*
const query = User.find({});
const promise = query.exec();
promise.then(function(records) {
    console.log('Actual database records are ' + records);
});
promise.catch(function(reason) {
    console.log('Something went wrong: ', reason);
});

// In order to find a user, we need to provide the parameter of the user to find
User.find({ username: 'Kenny_the_boy' }).exec(function(err, res) {
  if(err) throw err;
  console.log("The record you are looking for is " + res)
})*/


//In order to update a user, we need to provide the parameter of the user to update
/*User.find({ username: 'Kenny_the_boy' }, function(err, user) {
    if(err) throw err;
    console.log('Old password is ' + user[0].password);
    user[0].password = 'newPassword';
    console.log('New password is ' + user[0].password);

    user[0].save(function(err) {
      if (err) throw err;
      console.log('The user ' + user[0].name + " successfully updated");
    })
});*/

//In order to remove a user, we need to provide the parameter of the user to remove

/*User.find({ username: "Mark_the_boy" }, function(err, user) {
    if(err) throw err;
    user = user[0];
  user.remove(function(err) {
      if (err) throw err;
      console.log('User successfully deleted')
  });
});
//This method allows us to find and remove a user at once
User.findOneAndRemove({ username: "Benny_the_boy" }, function(err) {
    if(err) throw err;
    console.log('User deleted!')
})

*/

//Find all users
const findAllUsers = function() {
    return User.find({}, function(err, res) {
        if (err) throw err;
        console.log('Actual database records are '+ res);
    });
}

//Find specific record
const findSpecificRecord = function() {
    return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
        if(err) throw err;
        console.log('The record you are looking for is ' + res);
    })
}

//Update user's password
const updateUserPassword = function() {
    return User.findOne({ username: 'Kenny_the_boy' })
        .then(function(user) {
            console.log('Old password is ' + user.password);
            console.log('Name ' + user.name);
            user.password = 'newPassword';
            console.log('New password is ' + user.password);
            return user.save(function(err) {
                if (err) throw err;

                console.log('The user '+ user.name + ' has been successfully updated')
            });
        });
}

//Update user's name
const updateUserName = function() {
    return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
        if (err) throw err;

        console.log('The user name has been updated to '+ user.username);
    });
}

// Find specific user and delete
const findMarkAndDelete = function() {
    return User.findOne({ username: 'Mark_the_boy' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findKennyAndDelete = function() {
    return User.findOne({ username: 'Kenny_the_boy'})
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findBennyAndRemove = function() {
    return User.findOneAndRemove({ username: 'Benny_the_man'})
        .then(function(user) {
          return user.remove(function() {
              console.log('User successfully deleted');
          });
        });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updateUserPassword)
    .then(updateUserName)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))
