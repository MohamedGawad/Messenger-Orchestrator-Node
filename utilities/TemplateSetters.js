exports.setMultiButnsTmpl = (recipientId, inputTemplate) =>{
    var outputTemplate = require("../templates/TML-FB-MUL-BUT-OUTPUT.json");
    outputTemplate.recipient.id = recipientId;
    if(inputTemplate.template_data != null){
        if(inputTemplate.template_data.text !== null && inputTemplate.template_data.text !== ''){
            outputTemplate.message.attachment.payload.text = inputTemplate.template_data.text;
        }
        if(inputTemplate.template_data.buttons && inputTemplate.template_data.buttons.length > 0){
            for(var i=0; i< inputTemplate.template_data.buttons.length; i++){
                outputTemplate.message.attachment.payload.buttons[i] ={};
                outputTemplate.message.attachment.payload.buttons[i].type = inputTemplate.template_data.buttons[i].type;
                outputTemplate.message.attachment.payload.buttons[i].url = inputTemplate.template_data.buttons[i].url;
                outputTemplate.message.attachment.payload.buttons[i].title = inputTemplate.template_data.buttons[i].title;
            }
        }
    }
};

exports.setMultiColsTmpl = (recipientId, inputTemplate) => {
    var outputTemplate = require("../templates/TML-FB-MUL-COL-OUTPUT.json");   
    outputTemplate.recipient.id = recipientId;
    if(inputTemplate.template_data != null){
        if(inputTemplate.template_data.elements != null && inputTemplate.template_data.elements.length >0){
            for (var i=0; i<inputTemplate.template_data.elements.length; i++){
                outputTemplate.message.attachment.payload.elements[i] ={};
                outputTemplate.message.attachment.payload.elements[i].title = inputTemplate.template_data.elements[i].title;
                outputTemplate.message.attachment.payload.elements[i].image_url = inputTemplate.template_data.elements[i].image_url;
                outputTemplate.message.attachment.payload.elements[i].subtitle = inputTemplate.template_data.elements[i].subtitle;
                outputTemplate.message.attachment.payload.elements[i].default_action = {};
                outputTemplate.message.attachment.payload.elements[i].default_action.type = inputTemplate.template_data.elements[i].default_action.type;//"web_url";
                outputTemplate.message.attachment.payload.elements[i].default_action.url = inputTemplate.template_data.elements[i].default_action.url;
                outputTemplate.message.attachment.payload.elements[i].default_action.webview_height_ratio = inputTemplate.template_data.elements[i].default_action.webview_height_ratio;//"tall";
                for (var j=0; j<inputTemplate.template_data.elements[i].buttons.length; j++){
                    outputTemplate.message.attachment.payload.elements[i].buttons[j] = {};
                    outputTemplate.message.attachment.payload.elements[i].buttons[j].type = inputTemplate.template_data.elements[i].buttons[j].type;
                    outputTemplate.message.attachment.payload.elements[i].buttons[j].url = inputTemplate.template_data.elements[i].buttons[j].url;
                    outputTemplate.message.attachment.payload.elements[i].buttons[j].title = inputTemplate.template_data.elements[i].buttons[j].title;
                }
            }
        }
    }
};

