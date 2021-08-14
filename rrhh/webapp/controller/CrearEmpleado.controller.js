//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Library} Library
     */
    function (Controller, Library) {
        "use strict";

        return Controller.extend("proyectofinal.rrhh.controller.CrearEmpleado", {
            onInit: function () {
                var oView = this.getView();

                this._wizard = this.byId("CrearEmpleadoWizard");

                var oJSONModelTipo = new sap.ui.model.json.JSONModel();
                oJSONModelTipo.loadData("./model/json/TiposEmpleado.json", false);
                oView.setModel(oJSONModelTipo, "tiposModel");

                //var oJSONModel = new sap.ui.model.json.JSONModel([]);
                //var oODataModel  = new sap.ui.model.odata.v2.ODataModel("ZEMPLOYEES_SRV");
                //var oODataModel = this.getOwnerComponent().getModel("empleadosModel");

                // oView.setModel(oJSONModel, "empleadosModel");
                // var incidenceModel = this.getView().getModel("empleadosModel");
                // var odata = incidenceModel.getData();
                // odata.push({index: 1});
                // incidenceModel.refresh();

                //this.getView().setModel("empleadosModel>Users");empleadosModel
            },

            wizardCancel: function () {

            },

            wizardGuardar: function () {
                this._oNavContainer = this.byId("navContainer");
                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },

            setTipoEmpleado: function () {


                //this._wizard.validateStep(this.byId("wizardPaso1"));
                this._wizard.nextStep();
            },

            changeFecha: function (oEvent) {
                //    this.getView().getModel("empleadosModel").getData();

                //oEvent.getSource().getBindingContext("empleadosModel").getModel().refresh();
            },

            handleLiveChange: function (oEvent) {
                var ValueState = Library.ValueState;
                var oTextArea = oEvent.getSource(),
                iValueLength = oTextArea.getValue().length,
                iMaxLength = oTextArea.getMaxLength(),
                sState = iValueLength > iMaxLength ? ValueState.Error : ValueState.None;

                oTextArea.setValueState(sState);
            },

        });
    });