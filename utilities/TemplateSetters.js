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


exports.setRegTxtTmpl = (recipientId, inputTemplate) => {
    var outputTemplate = require("../templates/TML-FB-REG-TXT-OUTPUT.json");   
    outputTemplate.recipient.id = recipientId;
    if(inputTemplate.template_data != null){
        if(inputTemplate.template_data.message != null){
            if(inputTemplate.template_data.message.text != null && inputTemplate.template_data.message.text != ''){
                outputTemplate.message = {};
                outputTemplate.message.text = inputTemplate.template_data.message.text;
            }
        }
    }
};


exports.setBWTmpl = (recipientId, inputTemplate) => {
    var outputTemplate = require("../templates/TML-FB-ONE-BW-OUTPUT.json");   
    outputTemplate.recipient.id = recipientId;
    if(inputTemplate.template_data != null){
        outputTemplate.message.attachment.payload.recipient_name = inputTemplate.template_data.recipient_name;
        outputTemplate.message.attachment.payload.order_number = inputTemplate.template_data.order_number;
        outputTemplate.message.attachment.payload.currency = inputTemplate.template_data.currency;
        outputTemplate.message.attachment.payload.payment_method = inputTemplate.template_data.payment_method;
        outputTemplate.message.attachment.payload.order_url = inputTemplate.template_data.order_url;
        outputTemplate.message.attachment.payload.timestamp = inputTemplate.template_data.timestamp;
        if(inputTemplate.template_data.address != null){
            outputTemplate.message.attachment.payload.address = {};
            outputTemplate.message.attachment.payload.address.street_1 = inputTemplate.template_data.address.street_1;
            outputTemplate.message.attachment.payload.address.street_2 = inputTemplate.template_data.address.street_2;
            outputTemplate.message.attachment.payload.address.city = inputTemplate.template_data.address.city;
            outputTemplate.message.attachment.payload.address.postal_code = inputTemplate.template_data.address.postal_code;
            outputTemplate.message.attachment.payload.address.state = inputTemplate.template_data.address.state;
            outputTemplate.message.attachment.payload.address.country = inputTemplate.template_data.address.country;
        }
        if(inputTemplate.template_data.summary != null){
            outputTemplate.message.attachment.payload.summary = {};
            outputTemplate.message.attachment.payload.summary.subtotal = inputTemplate.template_data.summary.subtotal;
            outputTemplate.message.attachment.payload.summary.shipping_cost = inputTemplate.template_data.summary.shipping_cost;
            outputTemplate.message.attachment.payload.summary.total_tax = inputTemplate.template_data.summary.total_tax;
            outputTemplate.message.attachment.payload.summary.total_cost = inputTemplate.template_data.summary.total_cost;
        }
        if(inputTemplate.template_data.adjustments != null && inputTemplate.template_data.adjustments.length >0){
            outputTemplate.message.attachment.payload.adjustments = [];
            for(var i=0; i< inputTemplate.template_data.adjustments.length; i++){
                outputTemplate.message.attachment.payload.adjustments[i] = {};
                outputTemplate.message.attachment.payload.adjustments[i].name = inputTemplate.template_data.adjustments[i].name;
                outputTemplate.message.attachment.payload.adjustments[i].amount = inputTemplate.template_data.adjustments[i].amount;
            }
        }
        if(inputTemplate.template_data.elements != null && inputTemplate.template_data.elements.length >0){
            outputTemplate.message.attachment.payload.elements = [];
            for(var i=0; i< inputTemplate.template_data.elements.length; i++){
                outputTemplate.message.attachment.payload.elements[i] = {};
                outputTemplate.message.attachment.payload.elements[i].title = inputTemplate.template_data.elements[i].title;
                outputTemplate.message.attachment.payload.elements[i].subtitle = inputTemplate.template_data.elements[i].subtitle;
                outputTemplate.message.attachment.payload.elements[i].quantity = inputTemplate.template_data.elements[i].quantity;
                outputTemplate.message.attachment.payload.elements[i].price = inputTemplate.template_data.elements[i].price;
                outputTemplate.message.attachment.payload.elements[i].currency = inputTemplate.template_data.elements[i].currency;
                outputTemplate.message.attachment.payload.elements[i].image_url = inputTemplate.template_data.elements[i].image_url;
            }
        }   
    }
};