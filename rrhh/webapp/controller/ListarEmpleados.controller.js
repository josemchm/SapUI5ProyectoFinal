//@ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("proyectofinal.rrhh.controller.ListarEmpleados", {
            onBeforeRendering: function () {
                this._detailEmpleadosView = this.getView().byId("detailEmpleadosView");
            },
            
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmpleado", this.showEmpleadoDetails, this);    
            },
        
            showEmpleadoDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmpleadosView");
                detailView.bindElement("empleadosModel>" + path);

                //var boxMensaje = detailView.getView().byId("boxMensaje");
                
                //this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                //var incidenceModel = new sap.ui.model.json.JSONModel([]);
                //detailView.setModel(incidenceModel, "incidenceModel");
                //detailView.byId("tableIncidence").removeAllContent();
                
                this._detailEmpleadosView.byId("boxMensaje").setVisible(false);
                this._detailEmpleadosView.byId("datosEmpleado").setVisible(true);
                

                this.onReadODataEmpleado(this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().EmployeeId,
                                         this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().SapId);
            },

            onReadODataEmpleado: function(EmployeeId, SapId){
                this.getView().getModel("empleadosModel").read("/Users",{
                    filters: [
                        new sap.ui.model.Filter("SapId","EQ",SapId),
                        new sap.ui.model.Filter("EmployeeId","EQ",EmployeeId.toString())
                    ],
                    success: function (data) {

                        //Bind Files
                        SapId = "matiasp@pro-tech.com.ar";
                        EmployeeId = "000";
                        this._detailEmpleadosView.byId("uploadCollection").bindAggregation("items", {
                            path: "empleadosModel>/Attachments",
                            filters: [
                                new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId),
                                new sap.ui.model.Filter("SapId", "EQ", SapId),
                            ],
                            template: new sap.m.UploadCollectionItem({
                                documentId: "{empleadosModel>AttId}",
                                fileName: "{empleadosModel>DocName}",
                                visibleEdit: false
                            }).attachPress(this.downloadFile)
                        });

                        // var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        // incidenceModel.setData(data.results);
                        // var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        // tableIncidence.removeAllContent();
                        
                        // for(var incidence in data.results){

                        //     data.results[incidence]._validateDate = true;
                        //     data.results[incidence].EnabledSave = false;

                        //     var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",this._detailEmployeeView.getController());
                        //     this._detailEmployeeView.addDependent(newIncidence);
                        //     newIncidence.bindElement("incidenceModel>/"+incidence);
                        //     tableIncidence.addContent(newIncidence);
                        // };
                    }.bind(this),
                    error: function (e) {                        
                    }.bind(this)
                });
            },

            downloadFile: function(oEvent){
                const sPath = oEvent.getSource().getBindingContext("empleadosModel").getPath();
                //alert(sPath);
                //console.log(sPath);
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }

		});
	});