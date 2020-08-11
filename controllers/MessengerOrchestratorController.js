// imports
const Utility = require("../utilities/Utility");

// Validate Webhook
exports.verifyWebhook = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
    console.log("=========--WebHook Verified--=========");
    console.log(req.query['hub.verify_token']);
    res.status(200).send(req.query['hub.challenge']);
  }
  else{
    console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
};

// Recieve Messanger Message
exports.recieveMessage = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        Utility.handleMessage(sender_psid, webhook_event.message);        
      }
      else if (webhook_event.postback) {
        Utility.handlePostback(sender_psid, webhook_event.postback);
      }  
    });
  
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } 
  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};