//@ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
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

        function _readFiles(EmployeeId, SapId) {

            //Bind Files
            this.getView().byId("uploadCollection").bindAggregation("items", {
                path: "empleadosModel>/Attachments",
                filters: [
                    new Filter("EmployeeId", FilterOperator.EQ, EmployeeId),
                    new Filter("SapId", FilterOperator.EQ, SapId),
                ],
                template: new sap.m.UploadCollectionItem({
                    documentId: "{empleadosModel>AttId}",
                    fileName: "{empleadosModel>DocName}",
                    visibleEdit: false
                }).attachPress(this.downloadFile)
            });
        };  


		return Controller.extend("proyectofinal.rrhh.controller.DetailEmpleados", {
			onInit: function () {
                //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.getRoute("RouteDetalleEmpleado").attachPatternMatched(_onObjectMatched, this);                                
            },

            downloadFile: function(oEvent){
                const sPath = oEvent.getSource().getBindingContext("empleadosModel").getPath();
                alert(sPath);
                console.log(sPath);
                //window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }

		});
	});