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

