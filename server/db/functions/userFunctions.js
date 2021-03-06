const userModel = require('../models/user.js');
const xPorts = {};

xPorts.updateSession = function(user, hash) {
    return xPorts.findByUserName(user.username).then(function(userDB) {
            userDB.session = hash
            userDB.update()
            userDB.save()
            return userDB
        })
        .catch((err) => {
            console.error('ERROR IN USER FUNCTIONS UPDATE SESSION:', err);
        })
}

xPorts.secondSignupDisable = function(user) {
    return xPorts.findByUserName(user).then(function(userDB) {
            userDB.secondary_signup_needed = 'false'
            userDB.save()
        })
        .catch((err) => {
            console.error('ERROR IN USER FUNCTIONS SECOND SIGN UP:', err);
        })
}

xPorts.secondarySignupCheck = function(user) {
    return xPorts.findByUserName(user).then(function(userDB) {
            return userDB.secondary_signup_needed
        })
        .catch((err) => {
            console.error('ERROR IN USER FUNCTIONS SECONDARY SIGN UP:', err);
        })
}

xPorts.saveUserFn = function(user) {
    new userModel(user).save().then((data) => {
    }).catch((err) => {
        console.error('ERROR IN USER FUNCTIONS SAVING:', err);
    })
}

xPorts.updateInfoBatch = function(user, data) {
    return xPorts.addBio(user, data.Bio).then(function() {
        return xPorts.addLocation(user, [data.Country, data.State, data.zip]).then(function() {
            return xPorts.secondSignup(user)
        })
    })
}

xPorts.addBio = function(user, bio) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.bio = bio
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.updateName = function(user, reqBody) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.first_name = reqBody.firstName
        userDB.last_name = reqBody.lastName
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.addLocation = function(user, location) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.location.zip = location[2]
        userDB.location.state = location[1]
        userDB.location.country = location[0]
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.addPhotoUrl = function(user, result) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.user_image.public_url = result.url
        userDB.user_image.secure_url = result.secure_url
        userDB.user_image.public_id = result.public_id
        userDB.user_image.signature = result.signature
        userDB.update();
        userDB.save();
        return userDB
    })
}

xPorts.findOrCreateUser = function(userData) {
    return xPorts.findByUserName(userData.username).then(function(data) {
        if (!data) { //no data, user isnt in the db
            xPorts.saveUserFn({
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                bio: userData.bio,
                session: 'null',
                username: userData.username,
                picture: 'null',
                password: userData.password,
                secondary_signup_needed: 'True'
            })
            return false
        } else if (data) { //got data
            return true
        }
    })
}

xPorts.updatePassword = function(user, passHash) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.password = passHash
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.updateUsername = function(user, newName) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.username = newName
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.updateEmail = function(user, email) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.email = email
        userDB.update()
        userDB.save()
        return userDB
    })
}

xPorts.updateBio = function(user, bio) {
    return xPorts.findByUserName(user).then(function(userDB) {
        userDB.bio = bio
        userDB.update()
        userDB.save()
        return userDB
    })
}

//returns a user object based on a username
xPorts.findByUserName = function(username) {
    return userModel.findOne({username: username})
}

//returns the recipes created by specific user
xPorts.findUserRecipes = function(username) {
    xPorts.findByUserName(username).then((user) => {
        return user.my_recipes
    })
}

//Adds a recipe id reference to the user's my_recipe object
xPorts.addRecipeToMyRecipes = function(userId, recipeId) {
    return userModel.findOneAndUpdate({_id: userId}, {$addToSet: {'my_recipes': recipeId}}, {new: true})
}

//Adds a recipe id reference to the user's saved recipe object
xPorts.addRecipeToSavedRecipes = function(userId, recipeId) {
    return userModel.findOneAndUpdate({_id: userId}, {$addToSet: {'saved_recipes': recipeId} }, {new: true})
}

xPorts.RemoveRecipeFromSavedRecipes = function(userId, recipeId) {
    return userModel.findOneAndUpdate({_id: userId}, {$pull: {'saved_recipes': recipeId}}, {new: true})
}

module.exports = xPorts;
