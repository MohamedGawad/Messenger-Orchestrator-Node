// imports
const request = require('request');

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
  }

  
exports.handleMessage = (sender_psid, received_message) =>{
  let response;
  // Check if the message contains text
  
    // Create the payload for a basic text message
    response = {
      "text": received_message
    }
  
  // Sends the response message
  callSendAPI(sender_psid, response);    
};


exports.handlePostback = (sender_psid, received_postback)=>{
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, send another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
};


// The function checks if the bot response says messages to be redirected
exports.isRedirect =(context) =>{
  if (context && context.redirect_to_another_bot) {
    var isRedirect = context.redirect_to_another_bot;
    if (isRedirect == true) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// The agent bot decides which bot the request should be redirected to and updates that in context variable.
// Get worspace_id for redirected bot details so messages can be sent to that bot
exports.getDestinationBot = (context) => {
  var destination_bot = null;
  if (context && context.destination_bot) {
    destination_bot = context.destination_bot.toUpperCase();
  }

  var wsId = process.env["WORKSPACE_ID_" + destination_bot];

  if (!wsId) {
    wsId = process.env["WORKSPACE_ID_AGENT"];
  }

  if (!destination_bot) {
    destination_bot = "AGENT";
  }

  console.log("Message being sent to: " + destination_bot + " bot");
  return wsId;
};


/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
exports.updateMessage = (input, response) => {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    console.log("==>Response message: " + JSON.stringify(response.output.text));
    console.log("==>responseText: ", String(response.output.text));
    console.log("==> JSON.stringify(response.output.text): ",JSON.stringify(response.output.text));
    exports.handleMessage(senderIdNum, String(response.output.text));
    
    //return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  
  //return response;
};
