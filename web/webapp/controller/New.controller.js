sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
    
],
function (Controller, JSONModel, MessageToast,) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.New", {
        onInit: function () {


                this.loadData();

        },

        loadData: function(){
            var data = {};
            var model = new JSONModel();
            data.selectedItem = {
                "externalCode" : "",
                "cust_Employee" : "",
                "cust_ShirtSize" : "",
                "cust_ShirtColor" : "",

            };
            data.d ={};
            model.setData(data);
            this.getView().setModel(model);
                

        },

        saveData: function() {
            var self = this;
            var oData = this.getView().getModel().getData().selectedItem;
            var path = "/srv/create?path=cust_CompanyShirts_S0023961268?$format=json"

            var onewData = 
            {
                "cust_ShirtSize": oData.cust_ShirtSize,
                "cust_ShirtColor": oData.cust_ShirtColor,
                "cust_Employee": oData.cust_Employee
            };
            self.getView().setBusy(true);
            $.ajax({
                url: path,
                type: "POST",
                //contentType: "text/plain",
                contentType: "application/json",
                data: JSON.stringify(onewData),
                success: function(data){
                    MessageToast.show(data);
                    self.getView().setBusy(false);
                    self.getOwnerComponent().getRouter().navTo("RouteMain");
                },
                error: function(error){
                    MessageToast.show("webservice error!" + error);
                    self.getView().setBusy(false);
                }
            });

        },

		handleCancelPress : function () {

			this.getOwnerComponent().getRouter().navTo("RouteMain");

		},

		handleSavePress : function () {
            this.saveData();
            
			

		}



    });
});
