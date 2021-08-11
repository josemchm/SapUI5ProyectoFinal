//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        'sap/m/library'
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.library} Library
     */
	function (Controller, Library) {
		"use strict";

		return Controller.extend("proyectofinal.rrhh.controller.Main", {
			onInit: function () {

            },
            
            onCallCrearEmpleado: function(){
                alert("Creando...");
            },

            onCallVerEmpleados: function(){
                alert("Listando..");
            },

            onCallPedidos: function(oEvent){
                Library.URLHelper.redirect("http://11c314ddtrial-dev-logali-approuter.cfapps.us10.hana.ondemand.com",true);
                //window.open("http://11c314ddtrial-dev-logali-approuter.cfapps.us10.hana.ondemand.com","_blank");
            }
		});
	});