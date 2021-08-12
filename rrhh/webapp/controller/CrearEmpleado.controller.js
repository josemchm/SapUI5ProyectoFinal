//@ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("proyectofinal.rrhh.controller.CrearEmpleado", {
			onInit: function () {
                this._wizard = this.byId("CrearEmpleadoWizard");
            },
            
            wizardCancel: function(){

            },

            wizardGuardar: function(){

            },

            setTipoEmpleado: function(){
                this._wizard.validateStep(this.byId("wizardPaso1"));
            }

		});
	});