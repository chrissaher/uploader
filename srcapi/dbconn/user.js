
// include related entities
const User = require("../models/user.js")

exports.create = async (email, name) => {
    // create object to be inserted
    const userModel = new User({
        name: name,
        email: email
    });

    var createdUser = await userModel.save()
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("error here: ", err)
        })

    return createdUser;
}

exports.getByEmail = async (email) => {
    var userQuery = User.findOne({ email: email });

    return userQuery;
}
exports.getAll = async () => {
    return User.find();
}