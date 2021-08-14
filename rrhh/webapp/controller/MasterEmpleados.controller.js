//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/routing/History",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filer
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.ui.core.routing.History} History
     */
	function (Controller, Filter, FilterOperator, History) {
		"use strict";

		return Controller.extend("proyectofinal.rrhh.controller.MasterEmpleados", {
			onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },

            onBack: function(){
                var oHistory = History.getInstance();
                var sPreviosHash = oHistory.getPreviousHash();

                if (sPreviosHash !== undefined) {
                    window.history.go(-1);
                 } else {
                     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                     oRouter.navTo("RouteApp", true);
                 }
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