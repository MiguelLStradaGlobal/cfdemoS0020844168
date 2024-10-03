sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {

        },

        onCallSRV: function(){
            var self = this;
            var path = this.getView().byId("idInput").getValue();
            $.ajax({
                url: path,
                type: "GET",
                //contentType: "text/plain",
                contentType: "application/json",
                success: function(data){
                    self.setResponse(JSON.stringify(data));
                },
                error: function(){
                    self.MessageToast.show("webservice error!" + error);
                }
            });

        },
        
        setResponse: function(data){
            var textArea = this.getView().byId("idTextArea");
            textArea.setValue(data);
        }



    });
});
