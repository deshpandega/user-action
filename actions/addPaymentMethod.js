  module.exports = function addPayment (params){

  // const jwt = require('jsonwebtoken');  
  // const jwt_secret = params.jwt_secret;
 
  // console.log("headers===> "+params.__ow_headers);
  
  const card = {
    cardHolderName: params.card.cardHolderName,
    cardNumber: params.card.cardNumber,
	  cardMonth: params.card.cardMonth,
	  cardYear: params.card.cardYear,
	  cardCVV: params.card.cardCVV,
    createdDate: new Date()
  };


  const addPaymentMethod = () => {
    //const token = card.token || params.__ow_headers.token;
    if(card.cardHolderName === "" || card.cardNumber ==="" || card.cardMonth === "" || card.cardYear ==="" || card.cardCVV === ""){
      return new Promise((resolve, reject) => {
        reject({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Please enter all the mandatory details!")).toString('base64')
        });
      });
    }
    else if(card.cardHolderName !== "" && card.cardNumber !== "" && card.cardMonth !== "" && card.cardYear !== "" && card.cardCVV !== ""){
      return new Promise((resolve, reject) => {
        resolve({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 200,
          body : card
        });
      });
    }
    else{
      console.log('Something is wrong!!! Please try later');
      return new Promise((resolve, reject) => {
        reject({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Error!")).toString('base64')
        });
      });
    }
  };

  
  const payment = addPaymentMethod()
    .then((data)=>{
        return data;
      })
    .catch((error)=>{
      console.log('error during adding new payment method-->  '+error.statusCode);
      return ({
         headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 401,
          body: new Buffer(JSON.stringify("Please login to perform this action!")).toString('base64')
      });
    });

  return payment;
};