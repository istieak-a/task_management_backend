const mongoose = require('mongoose');

module.exports = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI, connectionParams);
        console.log("Connected to Database Successfully");
    } catch (error) {
        console.log(error);
        console.log("Couldn't connect to the Database");
    }
};
