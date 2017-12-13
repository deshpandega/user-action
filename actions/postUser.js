module.exports =  function postUser (params) {

  //import statements to use multiple modules
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
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
		]
  };

  // Overright the properties sent from user to user object above
  const queryParam = Object.assign(user, params.user);

  // References to use throughtout
  let database;
  let dbClient;
  
  //check for user if he already exists in table
  const checkUserIfExists = () =>{
  	return new Promise((resolve, reject)=>{
  		mongoClient.connect(databaseConnections, (err, client)=>{
  			if(err){
  				console.log("error in DB connection -> "+err);
  				reject(err);
  			}
  			else{
  				dbClient = client;
  				database = client.db('hobbylocale');

  				// Get collection name from database
	  			const collection = database.collection(collectionName);

	  			// Find if the user is already present in database
	  			collection.findOne({email:queryParam.email}, (err, userData)=>{
	  				if(userData){
	  					reject(userData);
	  				}
	  				else{
	  					resolve(queryParam);
	  				}
	  			});
  			}
  		});
  	});
  };

  //add user to collection
  const addUserToCollection = (userData) => {
  	return new Promise((resolve, rejet)=>{
  		console.log('add user here');
      userData.password = bcrypt.hashSync(userData.password, 10);
  		const collection = database.collection(collectionName);
  		// Add user to database
  		collection.insertOne(userData, (err, respond) => {
  			const op = respond.ops[0];
  			console.log("resp > "+op);
  			if(err){
  				reject(err);
  			}
  			console.log('user '+op.name+' added');
  			resolve(op);
  		});
  	});
  };

  //return person details and 
  //catch error if any
  return checkUserIfExists()
  	.then((data) => {
  		addUserToCollection(data)
  	})
  	.then(()=>{
  		dbClient.close();		// Close DB client 

  		return ({
  			headers: {
        	'Content-Type': 'application/json'
      	},
      	statusCode: 200,
      	body : new Buffer(JSON.stringify(queryParam)).toString('base64')
  		});
  	})
  	.catch((error)=>{
  		dbClient.close();		// Close DB client 
  		console.log("------>"+error);
  		const errorMessage = "User with email "+error['email']+ " already exisits";		//  Error message
  		console.log(errorMessage);

  		return ({
         headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 400,
          body: new Buffer(JSON.stringify(errorMessage)).toString('base64')
      });
  	});
};