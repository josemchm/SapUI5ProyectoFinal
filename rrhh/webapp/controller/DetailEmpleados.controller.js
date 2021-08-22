//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/core/format/NumberFormat"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.core.format.NumberFormat} NumberFormat
     */
	function (Controller, MessageBox, NumberFormat) {
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
                
                this.oAscensoModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.oAscensoModel, "ascenderModel");
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
            },

            onAscender: function(oEvent){
                
                var oContext = oEvent.getSource().getBindingContext("empleadosModel");

                if(!this._oDialogAscender){
                    this._oDialogAscender = sap.ui.xmlfragment("AscenderFragment","proyectofinal.rrhh.fragment.AscenderEmpleado",this);
                    this.getView().addDependent(this._oDialogAscender);
                }

                this._oDialogAscender.bindElement("empleadosModel>" + oContext.getPath());
                this._tipoEmpleado = this.getView().byId("tipoEmpleado").getText();                            

                this._oDialogAscender.open(); 
            },

            ascenderAceptar: function(oEvent){

                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oODataModel = this.getOwnerComponent().getModel("empleadosModel");
                //var oOSalarioModel = this.getView().getModel("ascenderModel");

                 var oFormatOption = {
                    minIntegerDigits: 1,
                    maxIntegerDigits: 17,
                    minFractionDigits: 2,
                    maxFractionDigits: 2,
                    groupingEnabled: false,
                    decimalSeparator: "."
                    };
                
                 var oFloat = NumberFormat.getFloatInstance(oFormatOption); 
                
                var salario = oFloat.format(this.oAscensoModel.getProperty("/Amount"));
      

                var bodySalario = {
                    SapId: oEvent.getSource().getBindingContext("empleadosModel").getObject().SapId, 
                    EmployeeId: oEvent.getSource().getBindingContext("empleadosModel").getObject().EmployeeId, 
                    CreationDate: this.oAscensoModel.getProperty("/CreationDate"),
                    Ammount: salario,
                    Waers: "EUR",
                    Comments: this.oAscensoModel.getProperty("/Comments")  
                };
                console.log(bodySalario);
                
                oODataModel.create("/Salaries", bodySalario, {
                        success: function () {
                            sap.m.MessageToast.show(oResourceBundle.getText("empleadoAscenderOK"));
                            this.getView().byId("idTimeLine").getBinding("content").refresh();
                            this.ascenderCancelar();   
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show(oResourceBundle.getText("empleadoAscenderOK"));
                            this.ascenderCancelar();
                        }.bind(this)
                });   
            },

            ascenderCancelar: function(oEvent){              
                sap.ui.core.Fragment.byId("AscenderFragment","inputSalario").setValue("");
                sap.ui.core.Fragment.byId("AscenderFragment","inputFecha").setValue("");
                sap.ui.core.Fragment.byId("AscenderFragment","inputComentario").setValue("");
                this.oAscensoModel.destroy();
                this._oDialogAscender.close();
            },

            validarAscender: function(oEvent){
                
                var oSalario = sap.ui.core.Fragment.byId("AscenderFragment","inputSalario");
                var oFecha = sap.ui.core.Fragment.byId("AscenderFragment","inputFecha");
                var oBtnAceptar = sap.ui.core.Fragment.byId("AscenderFragment","btnAscAceptar");
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var error = false;
                var minimo = 0;
                var maximo = 0;
                

                switch (this._tipoEmpleado) {
                    case oResourceBundle.getText("interno"):
                        minimo = 12000;
                        maximo = 80000;    
                        break;
                    case oResourceBundle.getText("autonomo"):
                        minimo = 100;
                        maximo = 2000; 
                        break;
                    case oResourceBundle.getText("gerente"):                        
                        minimo = 50000;
                        maximo = 200000;
                        break;
                };
                
                if(oSalario.getValue() < minimo || oSalario.getValue() > maximo ){
                    oSalario.setValueState("Error");
                    //Rango de salario entre 0 - 1
                    oSalario.setValueStateText(oResourceBundle.getText("rango",[minimo,maximo]));                    
                    error = true;
                }
                else{
                    oSalario.setValueState("None");
                };
                  
                if(oFecha.isValidValue() && oFecha.getValue().length > 0){
                    oFecha.setValueState("None");
                }else{
                    oFecha.setValueState("Error");
                    error = true;
                };
                
                if(error === true){
                    oBtnAceptar.setEnabled(false);
                }else{
                    oBtnAceptar.setEnabled(true);
                };
            }


		});
	});