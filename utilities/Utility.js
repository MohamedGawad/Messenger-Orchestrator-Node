// imports
const request = require('request');
const dotenv = require('dotenv');



// env var consts
dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL;
const MESSENGER_URL = process.env.MESSANGER_URL;
const MESSENGER_PROFILE_URL = process.env.MESSANGER_PROFILE_URL;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const USER_MNGMT_URL = process.env.USER_MNGMT_URL;
const APP_ID = process.env.APP_ID;



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


// Get Started Handling 
exports.sendGetStarted=()=> {
	// var messageData = {
	// 	setting_type: 'call_to_actions',
	// 	thread_state: 'new_thread',
	// 	call_to_actions: [{
	// 		payload: 'GET_STARTED_PAYLOAD'
	// 	}]
	// };

  var get_started_payload = require("../payloads/get_started_payload.json");
  getMessengerProfile(BACKEND_URL + '/GetStarted', 'GET', callFBSendAPI, 'addGetStarted', get_started_payload);
		
	
}


function getMessengerProfile(url, method, callback, methodName, messangerProfilepayload) {
  
  callback(messangerProfilepayload, MESSENGER_PROFILE_URL + PAGE_ACCESS_TOKEN, 'POST', methodName);
	// var req = request({
	// 	uri: url,
	// 	method: method,
	// 	json: true,
	// 	headers: {
	// 		"content-type": "application/json; charset=utf-8",
	// 	}
	// }, function (error, response, body) {
	// 	if (!error) {
	// 		if (body.entity) {
  //       callback(body.entity, MESSENGER_PROFILE_URL + pagesMap[pageID], 'POST', methodName);
	// 		}
	// 	} else {
	// 		console.error("Unable to sendPostRequest");
	// 		console.error(error);
	// 	}
	// });
}

function callFBSendAPI(messageData, url, method, methodName) {
	request({
		uri: url,
		method: method,
		json: messageData
	}, function (error, response, body) {
		if (!error) {
			console.log('Sucess Response', response.body);
		} else {
			console.error("Unable to " + methodName);
			console.error(error);
		}
	});
}




// Handle Presistant Menu 
function addPersistentMenu() {
	var deleted = {
		"fields": [
			"persistent_menu"
		]
	};
	
			// console.log(pageID + " -> " + pagesMap[pageID]);
			callFBSendAPIWithCallback(deleted, MESSENGER_PROFILE_URL + PAGE_ACCESS_TOKEN, 'DELETE', 'DeletePersistentMenu', getPersistentMenu);
	
}

exports.getPersistentMenu=()=> {
  var presistant_menu_payload = require("../payloads/presistant_menu_payload.json");
	getMessengerProfile(BACKEND_URL + '/Menu', 'GET', callFBSendAPI, 'addMenu', presistant_menu_payload);
}



exports.getUserProfile=(event)=> {
	sendTypingOn(event.sender.id);
	var userID = event.sender.id;
	console.log("senderId = " + userID);
	var http = require('https');
	var path = '/v2.6/' + userID + '?access_token=' + PAGE_ACCESS_TOKEN;
	var options = {
		host: 'graph.facebook.com',
		path: path
	};

	
	var req = http.get(options, function (res) {
		// console.log('STATUS: ' + res.statusCode);
		//	console.log('HEADERS: ' + JSON.stringify(res.headers));
		// Buffer the body entirely for processing as a whole.
		var bodyChunks = [];
		res.on('data', function (chunk) {
			// You can process streamed parts here...
			bodyChunks.push(chunk);
		}).on('end', function () {
			var body = Buffer.concat(bodyChunks);
			var bodyObject = JSON.parse(body);
			console.log("*****bodyObject " + JSON.stringify(bodyObject));
			firstName = bodyObject.first_name;
			lastName = bodyObject.last_name;
			profilepic = bodyObject.profile_pic;
			locale = bodyObject.locale;
			timezone = bodyObject.timezone;
			gender = bodyObject.gender;
			if (!firstName)
				firstName = "undefined";
			if (!lastName)
				lastName = "undefined";
			saveUserReq = {};
			saveUserReq.id = userID;
			saveUserReq.firstName = firstName;
			saveUserReq.lastName = lastName;
			saveUserReq.profilePic = profilepic;
			saveUserReq.locale = locale;
			saveUserReq.timezone = timezone;
			saveUserReq.gender = gender;
      saveUserReq.appId = APP_ID;
      saveUserReq.userUniqueId = userID;
      saveUserReq.channelId = "MSGR";
      console.log("*********saveUserReq " + JSON.stringify(saveUserReq));
      //saveUser();
      saveUser(saveUserReq);
		})
	});
	req.on('error', function (e) {
		console.log('ERROR: ' + e.message);
	});
}



function saveUser(userData) {
	console.error("userData to " + JSON.stringify(userData));
	var req = request({
		uri: USER_MNGMT_URL+"/addUserProfile",
		method: "POST",
		json: true,
		body: userData
	}, function (error, response, body) {
		console.error("response to " + JSON.stringify(response));
		if (!error) {
			if (body && body.entity && body.entity.length > 0) {
        console.log(">>>>>>>>>>Body.entity");
        // should call watson to return the get started reply
				//sendArrayOfMessage(body.entity, FB_SEND_API_URL + PAGE_ACCESS_TOKEN, 'POST', '', 0);
			}
			else if (body && body.length > 0) {
        console.log(">>>>>>>>>>Body");
        // should call watson to return the get started reply
				//sendArrayOfMessage(body, FB_SEND_API_URL + PAGE_ACCESS_TOKEN, 'POST', '', 0);
			}
		} else {
			console.error("Unable to sendPostRequest");
			console.error(error);
		}
	});
}


function sendArrayOfMessage(messageData, url, method, methodName, i) {
	console.error('messageData>>>>>', JSON.stringify(messageData));
	request({
		uri: url,
		method: method,
		json: messageData[i]
	}, function (error, response, body) {
		if (!error) {
			// console.log('!error' + JSON.stringify(messageData[i + 1]));
			if (messageData[i + 1]) {
				console.log('!error');
				sendArrayOfMessage(messageData, FB_SEND_API_URL + PAGE_ACCESS_TOKEN, 'POST', '', (i + 1));
			}
			else
				return;
			console.log('Sucess Response', response.body);
		} else {
			console.error("Unable to " + methodName);
			console.error(error);
		}
	});
}

function sendTypingOn(recipientId) {
	console.log("Turning typing indicator on");

	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_on"
	};

	callSendAPI(messageData);
}