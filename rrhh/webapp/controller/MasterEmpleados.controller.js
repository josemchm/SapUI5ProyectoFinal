//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
	    "sap/ui/model/FilterOperator",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filer
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
	function (Controller, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("proyectofinal.rrhh.controller.MasterEmpleados", {
			onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },

            onSearch: function(oEvent){
                var oTableSearchState = [],
		        sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [new Filter("LastName", FilterOperator.Contains, sQuery)];
                }

                this.getView().byId("standardList").getBinding("items").filter(oTableSearchState);
            },

            showEmpleado: function(oEvent){
                var path = oEvent.getSource().getBindingContext("empleadosModel").getPath();
                this._bus.publish("flexible","showEmpleado", path);
            }

		});
	});