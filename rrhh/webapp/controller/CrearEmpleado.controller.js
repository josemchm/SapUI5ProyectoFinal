//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Library} Library
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.core.routing.History} History
     */
    function (Controller, Library, MessageBox, History) {
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

                this.oJSONModelNuevo = new sap.ui.model.json.JSONModel();
                this.oJSONModelNuevo.loadData("./model/json/Empleados.json", false);
                oView.setModel(this.oJSONModelNuevo, "nuevoEmpleadoModel");

                //var oJSONModel = new sap.ui.model.json.JSONModel([]);
                //oView.setModel(oJSONModel, "empleadosModel");
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

            discardProgressCustom: function () {
                //alert("hello");
                this._wizard.discardProgress(this.byId("wizardPaso1"));

                var clearContent = function (content) {
                    for (var i = 0; i < content.length; i++) {
                        if (content[i].setValue) {
                            content[i].setValue("");
                        }

                        if (content[i].getContent) {
                            clearContent(content[i].getContent());
                        }
                    }
                };

                //this.model.setProperty("/productWeightState", "Error");
                //this.model.setProperty("/productNameState", "Error");
                clearContent(this._wizard.getSteps());
                // var tipoEmpleado = this.oJSONModelNuevo.getProperty("/Type");

                // console.log("EMPLEADO->" + tipoEmpleado);
                this.oJSONModelNuevo.setProperty("/Type","");
                this.getView().byId("tipoButton").setSelectedItem();
                this.getView().byId("tipoButton").setSelectedKey();
                //this.getView().byId("tipoButton").destroyItems();
                // var tipoEmpleado2 = this.oJSONModelNuevo.getProperty("/Type");
                // console.log("EMPLEADO2->" + tipoEmpleado2);

                this._wizard.invalidateStep(this.getView().byId("wizardPaso1"));


            },

            wizardCancel: function () {
                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("confirmWizardCancel"),
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this.discardProgressCustom();
                            //this._wizard.discardProgress(this._wizard.getSteps()[0]);

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



            setTipoEmpleado: function (oEvent) {
                //this._wizard.validateStep(this.byId("wizardPaso1"));
                //this._wizard.nextStep();
                //this._handleNavigationToStep(1);

                var tipoEmpleado = this.getView().getModel("nuevoEmpleadoModel").getProperty("/Type");
                var oView = this.getView();

                var oDNITxt = oView.byId("inputDNITxt");
                var oSalario = oView.byId("inputSalario");
                var oSalarioTxt = oView.byId("inputSalarioTxt");
                var oSalarioReviewTxt = oView.byId("salarioReviewTxt");
                var oDniReview = oView.byId("dniReviewTxt");

                var textoSalario = this.getView().getModel("i18n").getResourceBundle().getText("salario");
                var textoPrecio = this.getView().getModel("i18n").getResourceBundle().getText("precio");
                var textoDNI = this.getView().getModel("i18n").getResourceBundle().getText("dni");
                var textoCIF = this.getView().getModel("i18n").getResourceBundle().getText("cif");

                switch (tipoEmpleado) {
                    case "0": //Interno
                        oDNITxt.setText(textoDNI);
                        oDniReview.setText(textoDNI);

                        oSalarioTxt.setText(textoSalario);
                        oSalarioReviewTxt.setText(textoSalario);


                        //this._ocultarCampo(oView.byId("inputCIF"));
                        //this._mostrarCampo(oView.byId("inputDNI"));

                        //defecto 24000 rango 12000 y 80000
                        oSalario.setMin(12000);
                        oSalario.setMax(80000);
                        oSalario.setStep(1000);
                        oSalario.setValue(24000);
                        //oSalario.change();
                        break;

                    case "1": //Autónomo
                        oDNITxt.setText(textoCIF);
                        oDniReview.setText(textoCIF);

                        oSalarioTxt.setText(textoPrecio);
                        oSalarioReviewTxt.setText(textoPrecio);


                        //this._ocultarCampo(oView.byId("inputDNI"));
                        //this._mostrarCampo(oView.byId("inputCIF"));

                        //defecto 24000 rango 12000 y 80000
                        oSalario.setMin(100);
                        oSalario.setMax(2000);
                        oSalario.setStep(100);
                        oSalario.setValue(400);
                        //oSalario.change();
                        break;

                   case "2": //Gerente
                        oDNITxt.setText(textoDNI);
                        oDniReview.setText(textoDNI);

                        oSalarioTxt.setText(textoSalario);
                        oSalarioReviewTxt.setText(textoSalario);


                        //this._ocultarCampo(oView.byId("inputCIF"));
                        //this._mostrarCampo(oView.byId("inputDNI"));

                        //defecto 70000 rango 50000 y 200000
                        oSalario.setMin(50000);
                        oSalario.setMax(200000);
                        oSalario.setStep(10000);
                        oSalario.setValue(70000);
                        //oSalario.change();
                        break;

                    default:
                        break;
                }

                var tipoEmpleadoTxt = oEvent.getParameters().item.getText();
                this.oJSONModelNuevo.setProperty("/TypeTxt", tipoEmpleadoTxt);
                this._wizard.validateStep(this.byId("wizardPaso1"));

            },

            // _ocultarCampo: function(fieldName){
            //     if( fieldName.getVisible()){
            //         fieldName.setVisible(false);
            //     };
            // },

            // _mostrarCampo: function(fieldName){
            //     if( !fieldName.getVisible()){
            //         fieldName.setVisible(true);
            //     };
            // },

            ValidarPaso2: function () {
                //    this.getView().getModel("empleadosModel").getData();
                //oEvent.getSource().getBindingContext("empleadosModel").getModel().refresh();
                var oView = this.getView();
                var tipoEmpleado = oView.getModel("nuevoEmpleadoModel").getProperty("/Type");
                var oNombre = oView.byId("inputNombre");
                var oApellidos = oView.byId("inputApellidos");
                var oDNI = oView.byId("inputDNI");
                var oFecha = oView.byId("inputFecha");

                var error = false;


                //Validando Campos
                //Nombre
                if(oNombre.getValue().length > 0 ){
                    oNombre.setValueState("None");
                }else{
                    oNombre.setValueState("Error");
                    error = true;
                };

                //Apellidos
                if(oApellidos.getValue().length > 0 ){
                    oApellidos.setValueState("None");
                }else{
                    oApellidos.setValueState("Error");
                    error = true;
                };

                //DNI - CIF
                if(tipoEmpleado === "1"){
                    //Autónomo
                    if(oDNI.getValue().length > 0 ){
                        oDNI.setValueState("None");
                    }else{
                        oDNI.setValueState("Error");
                        error = true;
                    };
                }else{
                    //Interno y Gerente
                    if(this._validarDNI(oDNI)){
                        oDNI.setValueState("None");
                    }else{
                        oDNI.setValueState("Error");
                        error = true;
                    }
                }

                //Fecha
                if(oFecha.isValidValue() && oFecha.getValue().length > 0){
                    oFecha.setValueState("None");
                }else{
                    oFecha.setValueState("Error");
                    error = true;
                };

                if(error === false){
                    this._wizard.validateStep(this.getView().byId("wizardPaso2"));
                }else{
                    this._wizard.invalidateStep(this.getView().byId("wizardPaso2"));
                };
            },

            handleLiveChange: function (oEvent) {
                var ValueState = Library.ValueState;
                var oTextArea = oEvent.getSource(),
                iValueLength = oTextArea.getValue().length,
                iMaxLength = oTextArea.getMaxLength(),
                sState = iValueLength > iMaxLength ? ValueState.Error : ValueState.None;

                oTextArea.setValueState(sState);
            },

            _validarDNI: function(oEvent){

                //var dni = oEvent.getParameter("value");
                var dni = oEvent.getValue();
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                //Se comprueba que el formato es válido
                if(regularExp.test (dni) === true){
                    //Número
                    number = dni.substr(0,dni.length-1);
                    //Letra
                    letter = dni.substr(dni.length-1,1);
                    number = number % 23;
                    letterList="TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList=letterList.substring(number,number+1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        return false;
                    }else{
                        //Correcto
                        return true;
                    }
                }
                else{
                    //Error
                    return false;
                }
            },

            crearCancel: function(){
                // const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("CrearEmpleado");
                //this.wizardCancel();
                var oHistory = History.getInstance();
                var sPreviosHash = oHistory.getPreviousHash();

                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("confirmWizardCancel"),
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this.discardProgressCustom();
                            //this._wizard.discardProgress2(this._wizard.getSteps()[0]);


                            if (sPreviosHash !== undefined) {
                                window.history.go(-1);
                            } else {
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteApp", true);
                            }

                            // this._bus.publish("incidence", "onDeleteIncidence", {
                            //     IncidenceId: contextObj.IncidenceId,
                            //     SapId: contextObj.SapId,
                            //     EmployeeId: contextObj.EmployeeId
                            // });
                        }
                    }.bind(this)
                });
            },

            wizardGuardar: function(){
                //this.getOwnerComponent().SapId,
                //oODataModel = new sap.ui.model.odata.v2.ODataModel("ZEMPLOYEES_SRV");
                var oODataModel = this.getOwnerComponent().getModel("empleadosModel");
                //var oODataModel2 = this.getView().getModel("empleadosModel").getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                //var creationDate = new Date(); //sap.ui.model.odata.type.DateTime; 
                //creationDate = this.oJSONModelNuevo.getProperty("/CreationDate");
                //var oDataUtils = new sap.ui.model.odata.ODataUtils.formatValue(creationDate,"Edm.DateTime");
                //sap.ui.model.odata.type.date
                //oDataUtils.formatValue(datetime,"Edm.DateTime");
                //creationDate, //
                var body = {
                    //EmployeeId: "",
                    SapId: this.getOwnerComponent().SapId,
                    Type: this.oJSONModelNuevo.getProperty("/Type").toString(),
                    FirstName: "NOMBRE", //this.oJSONModelNuevo.getProperty("/FirstName").toString(),
                    LastName: "APELLIDO", //this.oJSONModelNuevo.getProperty("/LastName").toString(),
                    Dni: "12097081R",//this.oJSONModelNuevo.getProperty("/Dni").toString(),
                    CreationDate: this.oJSONModelNuevo.getProperty("/CreationDate"),
                    Comments: this.oJSONModelNuevo.getProperty("/Comments").toString()   
                };
                console.log(body);

                oODataModel.create("/Users", body, {
                        success: function () {
                            console.log(data);
                            MessageBox.success(oResourceBundle.getText("saveOK"));
                            //this.onReadODataIncidence.bind(this)(employeeId);
                            //sap.m.MessageToast.show(oResouceBundle.getText("odataSaveOK"));
                            //MessageBox.success(oResouceBundle.getText("saveNoOK")); 
                        }.bind(this),
                        error: function (e) {
                            console.log(e);
                            MessageBox.error(oResourceBundle.getText("saveNoOK"));
                            //sap.m.MessageToast.show(oResouceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    });
            }

        });
    });