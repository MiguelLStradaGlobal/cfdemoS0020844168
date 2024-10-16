sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
    
],
function (Controller, JSONModel, MessageToast,) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {

            //setting the reload
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("RouteMain").attachMatched(this.handleRouteMatched, this);

            var oSettingsModel = new JSONModel({ selectedItem: ""});
            
			this.getView().setModel(oSettingsModel, 'settings');
            this.getOwnerComponent().setModel(oSettingsModel, 'settings');
            //load all data table
            this.loadData();

        },
        handleRouteMatched : function (evt) {
            //You code here to run every time when your detail page is called.
            this.onInit();
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
        },

        loadData: function(){
            var self = this;
            var path = "/srv/sfodata?path=cust_CompanyShirts_S0023961268";
            $.ajax({
                url: path,
                type: "GET",
                //contentType: "text/plain",
                contentType: "application/json",
                success: function(data){
                    var model = new JSONModel();
                    data.companyShirts = data.d.results;
                    data.d ={};
                    model.setData(data);
                    self.getView().setModel(model);
                },
                error: function(){
                    self.MessageToast.show("webservice error!" + error);
                }
            });

        },

        onpressRow: function(oEvent){
            MessageToast.show("see item");


            
			var oContext = oEvent.getParameter("rowContext");
			var oModel = this.getView().getModel();
			var oSettingsModel = this.getView().getModel('settings');
			oSettingsModel.setProperty("/selectedItem", oModel.getProperty("externalCode", oContext));


            var oSettingsModel2 =this.getOwnerComponent().getModel("settings");
            oSettingsModel2.setProperty("/selectedItem", oModel.getProperty("externalCode", oContext));
            this.getOwnerComponent().getRouter().navTo("ItemView");
        },

        onAdd : function(){
            this.getOwnerComponent().getRouter().navTo("NewView");

        }



    });
});
