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
                this._bus.subscribe("flexible", "eliminarEmpleado", this.elimimarEmpleado, this);
            },

            showEmpleadoDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmpleadosView");
                detailView.bindElement("empleadosModel>" + path);

                //icono 7 txt Tipo
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                
                switch (this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().Type) {
                    case "0":
                        detailView.byId("oHeader").setIcon("sap-icon://employee-pane");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("interno"));                        
                        break;
                    case "1":
                        detailView.byId("oHeader").setIcon("sap-icon://employee");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("autonomo"));
                        break;
                    case "2":
                        detailView.byId("oHeader").setIcon("sap-icon://leads");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("gerente"));
                        break;
                    default:
                        detailView.byId("oHeader").setIcon("sap-icon://add-employee");
                        break;
                };


                //var boxMensaje = detailView.getView().byId("boxMensaje");

                //this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                //var incidenceModel = new sap.ui.model.json.JSONModel([]);
                //detailView.setModel(incidenceModel, "incidenceModel");
                //detailView.byId("tableIncidence").removeAllContent();
                // var oHeader = this.getView().byId("oHeader");
                // oHeader.setIcon("sap-icon://employee-pane");
                this._detailEmpleadosView.byId("boxMensaje").setVisible(false);
                this._detailEmpleadosView.byId("datosEmpleado").setVisible(true);


                this.onReadODataEmpleado(this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().EmployeeId,
                this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().SapId);
            },

            onReadODataEmpleado: function (EmployeeId, SapId) {

                var detailView = this.getView().byId("detailEmpleadosView");

                this.getView().getModel("empleadosModel").read("/Users", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId.toString())
                    ],
                    success: function (data) {
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


                                        
                //SapId = data.results[0].SapId; //"matiasp@pro-tech.com.ar";
                //EmployeeId = data.results[0].EmployeeId; //"000";

                //Bind Files
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

                //Bind Salary
                this._detailEmpleadosView.byId("idTimeLine").bindAggregation("content", {
                    path: "empleadosModel>/Salaries",
                    filters: [
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId),
                        new sap.ui.model.Filter("SapId", "EQ", SapId),
                    ],
                    template: new sap.suite.ui.commons.TimelineItem({
                        dateTime: "{empleadosModel>CreationDate}",
                        text: "{empleadosModel>Comments}",
                        userName:"{empleadosModel>Ammount}"
                    })
                });

            },

            elimimarEmpleado: function(category, nameEvent, path){
                                
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();             
                
                this.getView().getModel("empleadosModel").remove("/Users(EmployeeId='" + path.EmployeeId +
                                                                        "',SapId='" + path.SapId + "')",
                {
                    success: function () {
                        //this.onReadODataEmpleado.bind(this)(path.EmployeeId, path.SapId);
                        sap.m.MessageToast.show(oResourceBundle.getText("empleadoDeleteOK"));

                        this._detailEmpleadosView.byId("boxMensaje").setVisible(true);
                        this._detailEmpleadosView.byId("datosEmpleado").setVisible(false);

                        this.getView().byId("masterEmpleadosView").byId("standardList").getBinding("items").refresh();                        

                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("empleadoDeleteKO"));
                    }.bind(this)
                });
            },

            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("empleadosModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }

		});
	});