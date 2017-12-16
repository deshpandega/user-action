module.exports =  function editUser (params) {
    //import statements to use multiple modules
    const mongoClient = require('mongodb').MongoClient;

    // Environment variable we are loading as params from config.json file
    const collectionName = params.collectionName;
    const databaseConnections =  params.mongoDB_connection;

    console.log("collection name -> "+collectionName);

    const user = {
        "name":"",
        "password" : "",
        "email" : "",
        "profileIcon": "",
        "dob" : "",
        "aboutme" : "",
        "hobbies" : [
            {
                "name" : ""
            }
        ],
        "registeredevents" : [
            {
                "name" : "",
                "venue" : ""
            }
        ],
        "hostedevents" : [
            {
                "name" : "",
                "venue" : ""
            }
        ],
        "payments" : [
            {
                "cardHolderName" : "",
                "cardNumber" : "",
                "cardMonth" : "",
                "cardYear" : "",
                "cardCVV" : ""
            }
        ]
    };

    // Overright the properties sent from user to event object above
    const userParam = Object.assign(user, params.user);

    // Overright the properties sent from user of attendee to blank attendee object above
    const hobbyParam = params.hobbies;

    // References to use throughtout
    let database;
    let dbClient;

    const editUser = (userParam)=>{
        return new Promise((resolve, reject)=>{
            mongoClient.connect(databaseConnections, (err, client)=>{
                if(err){
                    console.log("error in DB connection -> "+err);
                    reject(`404:${err}`);
                }
                else{
                    dbClient = client;
                    database = client.db('hobbylocale');

                    const emailToUpdate = userParam.email;
                    console.log("This is value---> "+emailToUpdate);

                    // Get collection name from database
                    const collection = database.collection(collectionName);

                    collection.updateOne(
                        {email:emailToUpdate},
                        {$set:{name:userParam.name, aboutme: userParam.aboutme, dob:userParam.dob, profileIcon:userParam.profileIcon}},
                        (err, resp)=>{
                            if(err){
                                reject(`404:${err}`);
                            }
                            const op = resp.result.nModified;
                            if(op==0){
                                reject(`401:Some hobbies not added to user`);
                            }
                            console.log("solved");
                            resolve(op);
                        }
                    )
                }
            });
        });
    }

    //add event to collection
    const addHobbies = (userParam, hobbyParam) => {
        return new Promise((resolve, reject)=>{
            console.log('Update user here');

            mongoClient.connect(databaseConnections, (err, client)=>{
                if(err){
                    console.log("error in DB connection -> "+err);
                    reject(`404:${err}`);
                }
                else{
                    dbClient = client;
                    database = client.db('hobbylocale');

                    const emailToUpdate = userParam.email;
                    console.log("This is value---> "+emailToUpdate);

                    // Get collection name from database
                    const collection = database.collection(collectionName);


                    console.log("--->> "+hobbyParam.name);
                    // Update event to database

                    collection.update(
                        { email : emailToUpdate },
                        { $push :
                            {hobbies: { name : hobbyParam.name} }
                        },
                        (err, respond)=>{
                        if(err){
                            reject(`404:${err}`);
                        }
                        const op = respond.result.nModified;
                        if(op==0){
                            reject(`401:Some hobbies not added to user`);
                        }
                        console.log("solved");
                        resolve(op);
                    });
                }
            });
        });
    };

    //return event details and
    //catch error if any
    if(params.task=="addHobby"){
        return addHobbies(userParam, hobbyParam)
            .then((data) => {
                dbClient.close();		// Close DB client
                return ({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 200,
                    body : new Buffer(JSON.stringify(`${data} hobbies added`)).toString('base64')
                });
            })
            .catch((error)=>{
                dbClient.close();		// Close DB client

                console.log("error is --->> "+error);
                const status = error.split(':')[0];
                const errorMessage = error.split(':')[1];
                console.log(errorMessage);
                return ({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: parseInt(status),
                    body: new Buffer(JSON.stringify(errorMessage)).toString('base64')
                });
            });
    }
    else{
        return editUser(userParam)
            .then((data) => {
                dbClient.close();		// Close DB client
                return ({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 200,
                    body : new Buffer(JSON.stringify(`${data} edited`)).toString('base64')
                });
            })
            .catch((error)=>{
                dbClient.close();		// Close DB client

                console.log("error is --->> "+error);
                const status = error.split(':')[0];
                const errorMessage = error.split(':')[1];
                console.log(errorMessage);
                return ({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: parseInt(status),
                    body: new Buffer(JSON.stringify(errorMessage)).toString('base64')
                });
            });
    }

}