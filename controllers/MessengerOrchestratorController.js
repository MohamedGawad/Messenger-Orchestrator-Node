// imports
const Utility = require("../utilities/Utility");
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const dotenv = require('dotenv');



// init 
dotenv.config();
var assistantAPIKey = process.env.ASSISTANT_IAM_API_KEY;
console.log("AsistantAPI_KEY => ", assistantAPIKey);
var assistantURL = process.env.ASSISTANT_IAM_URL;
var assistantVersion = process.env.VERSION;


console.log("assistantVersion = " + assistantVersion);
// Create the service wrapper
const assistant = new AssistantV1({
  version: assistantVersion,
  authenticator: new IamAuthenticator({
    apikey: assistantAPIKey,
  }),
  url: assistantURL,
});





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

  var isGetStartedPostBack = false;
  var isPostBack = false;
  var isInputMessage = false;
  console.log("=============== webhhok starts ===========================");
    //================== webhhok starts ========================================================================
    let body = req.body;
    let msngrInput = {};
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
      senderIdNum = sender_psid;
      console.log('Sender PSID: ' + sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      
      if (webhook_event.message) {
        //Utility.handleMessage(sender_psid, webhook_event.message);
        msngrInput = webhook_event.message;
        isInputMessage = true;
        console.log("********************webhook_event.message", webhook_event.message);
             
      }
      else if (webhook_event.postback) {
        //Utility.handlePostback(sender_psid, webhook_event.postback);
        msngrInput = webhook_event.postback;
        console.log("********************webhook_event.message", webhook_event.postback);
        isPostBack = true;

        if (webhook_event.postback.payload == 'GET_STARTED_PAYLOAD'){
          isGetStartedPostBack = true;
        }
      }  
    });
  
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } 
  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

    //=========================== webhook end =================================================================
    if (isInputMessage || (isPostBack && !isGetStartedPostBack)){
      console.log("let msngrInput ==> ", msngrInput);
    var workspace = Utility.getDestinationBot(req.body.context) || '<workspace-id>';
    console.log("workspace = " + workspace);
    if (!workspace || workspace === '<workspace-id>') {
      return res.json({
        'output': {
          'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
        }
      });
    }
    var payload = {
      workspaceId: workspace,
      context: req.body.context || msngrInput,
      input: req.body.input || msngrInput
    };
  
    // Send the input to the assistant service
    assistant.message(payload, function (err, data) {
      data = data.result
      console.log("Message: " + JSON.stringify(payload.input));
      if (err) {
        console.log("Error occurred: " + JSON.stringify(err.message))
        return res.status(err.code || 500).json(err);
      }
  
  
      if (Utility.isRedirect(data.context)) {
        // When there is a redirect, get the redirect bot workspace id
        payload.workspaceId = Utility.getDestinationBot(data.context);
        // When there is a redirect, update destination bot in context so it persists along with the conversation
        payload.context.destination_bot = data.context.destination_bot;
        // Where there is redirect, old conversation_id is not needed. Delete it
        delete payload.context.conversation_id;
        // For redirect, no user action is needed. Call the redirect bot automatically and send back that response to user
        assistant.message(payload, function (err, data) {
          data = data.result
          if (err) {
            return res.status(err.code || 500).json(err);
          }
          //Utility.updateMessage(payload, data);
          console.log("handleMessage normal call");
          Utility.handleMessage(senderIdNum, String(data.output.text));
        });
      } 
      else { // There is no redirect. So send back the response to user for further action
        //Utility.updateMessage(payload, data);
        console.log("handleMessage else call");
        Utility.handleMessage(senderIdNum, String(data.output.text));
      }
  
    });
    }
    else{
      console.log("Get Started post back <<<<<<");
    }
    
}


