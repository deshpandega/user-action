  module.exports = function addPayment (params){

  // const jwt = require('jsonwebtoken');  
  // const jwt_secret = params.jwt_secret;
 
  // console.log("headers===> "+params.__ow_headers);
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


 // Overright the properties sent from user to user object above
  const userParam = Object.assign(user, params.users);

  const paymentParam = params.payments;

  // References to use throughtout
  let database;
  let dbClient;


//add payment method to user collection
  const addPaymentMethod = (userParam, paymentParam) => {
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

          // Update event to database
          collection.update(
            { email : emailToUpdate },
            {
              $push:{
                payments: { cardHolderName : paymentParam.cardHolderName , cardNumber : paymentParam.cardNumber, cardMonth: paymentParam.cardMonth,cardYear: paymentParam.cardYear, cardCVV : paymentParam.cardCVV}
              }
            },
            (err, respond)=>{
              if(err){
                reject(`404:${err}`);
              }
              const op = respond.result.nModified;
              if(op==0){
                reject(`401:${paymentParam.cardHolderName} not added to event ${userParam.name}`);  
              }
              console.log("solved");
              resolve(op);
            });
        }
      });
    });
  };

  //return user details and 
  //catch error if any
  return addPaymentMethod(userParam, paymentParam)
  .then((data) => {
      dbClient.close();   // Close DB client 
      return ({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body : new Buffer(JSON.stringify(`${paymentParam.name} added to user ${userParam.name}`)).toString('base64')
      });
    })
  .catch((error)=>{
      dbClient.close();   // Close DB client 

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

  return payment;
};