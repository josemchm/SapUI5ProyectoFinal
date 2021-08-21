//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     */
	function (Controller, MessageBox) {
		"use strict";

        // function _onObjectMatched(oEvent) {

        //     //this.onClearSignature();

        //     this.getView().bindElement({
        //         path: "/Users(" + oEvent.getParameter("arguments").OrderID + ")",
        //         model: "empleadosModel",
        //         events: {
        //             dataReceived: function (oData) {
        //                 _readFiles.bind(this)(oData.getParameter("data").EmployeeId,
        //                                       oData.getParameter("data").SapId);
        //             }.bind(this)
        //         }
        //     });

        //     const objContext = this.getView().getModel("empleadosModel").getContext("/Users("
        //         + oEvent.getParameter("arguments").OrderID + ")").getObject();

        //     if (objContext) {
        //         _readSignature.bind(this)(objContext.EmployeeId, objContext.SapId);
        //     }

        // };

        // function _readFiles(EmployeeId, SapId) {

        //     //Bind Files
        //     this.getView().byId("uploadCollection").bindAggregation("items", {
        //         path: "empleadosModel>/Attachments",
        //         filters: [
        //             new Filter("EmployeeId", FilterOperator.EQ, EmployeeId),
        //             new Filter("SapId", FilterOperator.EQ, SapId),
        //         ],
        //         template: new sap.m.UploadCollectionItem({
        //             documentId: "{empleadosModel>AttId}",
        //             fileName: "{empleadosModel>DocName}",
        //             visibleEdit: false
        //         }).attachPress(this.downloadFile)
        //     });
        // };  


		return Controller.extend("proyectofinal.rrhh.controller.DetailEmpleados", {
			onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
                //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.getRoute("RouteDetalleEmpleado").attachPatternMatched(_onObjectMatched, this);                                
            },

             onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();

                //Header Token CSRF
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("empleadosModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let objContext = oEvent.getSource().getBindingContext("empleadosModel").getObject();
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: objContext.SapId + ";"
                        + objContext.EmployeeId + ";" 
                        + fileName
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();                
            },

            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("empleadosModel").getPath();
                this.getView().getModel("empleadosModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh(); 
                    },
                    error: function () {
                    
                    },
                });
            },

            onDarDeBaja: function(oEvent){
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var contextObj = oEvent.getSource().getBindingContext("empleadosModel").getObject();
                
                MessageBox.confirm(oResourceBundle.getText("confirmDarBaja"),{

                    onClose: function(oAction){
                        if(oAction === MessageBox.Action.OK){
                            
                            this._bus.publish("flexible", "eliminarEmpleado", {
                                EmployeeId: contextObj.EmployeeId,
                                SapId: contextObj.SapId                                
                            });                            
                        }
                    }.bind(this)
                });
            }


		});
	});