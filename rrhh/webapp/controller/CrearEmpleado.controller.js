//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Library} Library
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, Library, MessageBox) {
        "use strict";

        return Controller.extend("proyectofinal.rrhh.controller.CrearEmpleado", {
                       
            onInit: function () {
                var oView = this.getView();

                this._wizard = this.getView().byId("CrearEmpleadoWizard");
                this._oNavContainer = this.getView().byId("NavContainer");
			    this._oWizardContentPage = this.getView().byId("ContentPage");

                var oJSONModelTipo = new sap.ui.model.json.JSONModel();
                oJSONModelTipo.loadData("./model/json/TiposEmpleado.json", false);
                oView.setModel(oJSONModelTipo, "tiposModel");

                var oJSONModelNuevo = new sap.ui.model.json.JSONModel();
                oJSONModelNuevo.loadData("./model/json/Empleados.json", false);
                oView.setModel(oJSONModelNuevo, "nuevoEmpleadoModel");

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

            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

            backToWizardContent: function () {
			    this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },

            editPaso1: function () {
                this._handleNavigationToStep(0);
            },

            editPaso2: function () {
                this._handleNavigationToStep(1);
            },

            editPaso3: function () {
                this._handleNavigationToStep(2);
            },
        
            // discardProgress: function () {
            //     alert("hello");
                // this._wizard.discardProgress(this.byId("wizardPaso1"));

                // var clearContent = function (content) {
                //     for (var i = 0; i < content.length; i++) {
                //         if (content[i].setValue) {
                //             content[i].setValue("");
                //         }

                //         if (content[i].getContent) {
                //             clearContent(content[i].getContent());
                //         }
                //     }
                // };

                //this.model.setProperty("/productWeightState", "Error");
                //this.model.setProperty("/productNameState", "Error");
                //clearContent(this._wizard.getSteps());
            //},

            wizardCancel: function () {
                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("confirmWizardCancel"),
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
						    this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            // this._bus.publish("incidence", "onDeleteIncidence", {
                            //     IncidenceId: contextObj.IncidenceId,
                            //     SapId: contextObj.SapId,
                            //     EmployeeId: contextObj.EmployeeId
                            // });
                        }
                    }.bind(this)
                });
            },

            wizardComplete: function () {
                //this._oNavContainer = this.byId("navContainer");
                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },



            setTipoEmpleado: function () {
                //this._wizard.validateStep(this.byId("wizardPaso1"));
                this._wizard.nextStep();
                //this._handleNavigationToStep(1);

                var tipoEmpleado = this.getView().getModel("nuevoEmpleadoModel").getProperty("/Type");
                var oView = this.getView();

                switch (tipoEmpleado) {
                    case "1":
                        this._ocultarCampo(oView.byId("inputCIF"));
                        break;
                    case "2":
                       this._ocultarCampo(oView.byId("inputCIF"));
                        break;
                   case "3":
                       
                        break;
 
                    default:
                        break;
                }

            },

            _ocultarCampo: function(fieldName){
                fieldName.setVisible(false);
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