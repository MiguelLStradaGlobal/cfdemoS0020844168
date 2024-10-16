sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
    
],
function (Controller, JSONModel, MessageToast,) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Item", {
        onInit: function () {

            //load details for that element
            //var oItem= this.getView().getModel("settings")
            var oItem = this.getOwnerComponent().getModel("settings");

            if(oItem == undefined){
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }
            else{
                this.loadData(oItem);
            }
            


        },

        loadData: function(oItem){
            var sExternalCode = oItem.getData().selectedItem
            var self = this;
            var path = "/srv/sfodata?path=cust_CompanyShirts_S0023961268?$filter=externalCode eq '" + sExternalCode + "'";
            $.ajax({
                url: path,
                type: "GET",
                //contentType: "text/plain",
                contentType: "application/json",
                success: function(data){
                    var model = new JSONModel();
                    data.selectedItem = data.d.results[0];
                    data.d ={};
                    model.setData(data);
                    self.getView().setModel(model);
                },
                error: function(){
                    MessageToast.show("webservice error!" + error);
                }
            });

        },

        saveData: function() {
            var self = this;
            var oData = this.getView().getModel().getData().selectedItem;
            var path = "/srv/edit?path=upsert"

            var onewData = 
            {
                "__metadata": {
                    "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0023961268("+oData.externalCode+"L)",
                    "type": "SFOData.cust_CompanyShirts_S0023961268"
                },
                //"externalCode": "529518",
                "cust_ShirtSize": oData.cust_ShirtSize,
                "cust_ShirtColor": oData.cust_ShirtColor
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
                },
                error: function(){
                    MessageToast.show("webservice error!" + error);
                    self.getView().setBusy(false);
                }
            });

        },

        handleEditPress : function () {

			//Clone the data
            //this._oSupplier = Object.assign({}, this.getView().getModel().getData().selectedItem);

            var oModel = new JSONModel();
            var aDataCopy = JSON.parse(JSON.stringify(this.getView().getModel().getData().selectedItem));
            oModel.setData(aDataCopy);
            this.getView().setModel(oModel,"savedModel");
			
			this._toggleButtonsAndView(true);
            

		},

		handleCancelPress : function () {

			//Restore the data
			var oModel = new JSONModel();
            var data = {};
            data.selectedItem = this.getView().getModel("savedModel").getData();
            oModel.setData(data);
			this.getView().setModel(oModel);
			this._toggleButtonsAndView(false);

		},

		handleSavePress : function () {
            this.saveData();
			this._toggleButtonsAndView(false);

		},

        handleDeletePress : function (){
            var self = this;
            var oData = this.getView().getModel().getData().selectedItem;
            var path = "/srv/delete?path=cust_CompanyShirts_S0023961268("+oData.externalCode+"L)";
            self.getView().setBusy(true);
            $.ajax({
                url: path,
                type: "DELETE",
                //contentType: "text/plain",
                contentType: "application/json",
                //data: JSON.stringify(onewData),
                success: function(data){
                    MessageToast.show(data);
                    self.getView().setBusy(false);
                    self.getOwnerComponent().getRouter().navTo("RouteMain");
                },
                error: function(){
                    MessageToast.show("webservice error!" + error);
                    self.getView().setBusy(false);
                }
            });

        },
        _toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
            oView.byId("delete").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			//this._showFormFragment(bEdit ? "Change" : "Display");
            this.changeEdition(bEdit);
		},

        changeEdition : function(bEdit){
            var oView = this.getView();
            //oView.byId("nameText").setEditable(bEdit);
            //oView.byId("employeeText").setEditable(bEdit);
			oView.byId("sizeText").setEditable(bEdit);
			oView.byId("colorText").setEditable(bEdit);
        }



    });
});
