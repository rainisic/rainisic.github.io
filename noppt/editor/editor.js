Ext.require([
    "Ext.grid.*",
    "Ext.data.*",
    "Ext.util.*",
    "Ext.state.*",
    "Ext.form.*",
    "Ext.tree.*",
    "Ext.tip.*"
]);

Ext.onReady(function () {

    // Define variables.
    var components = [];
    var production = "";

    components = [];

    // Define structures.
    Ext.define("com.noppt.editor.Position", {
        extend: "Ext.data.Model",
        idProperty: null,
        fields: [
            {
                name: "x",
                type: "number",
                defaultValue: 0
            },
            {
                name: "y",
                type: "number",
                defaultValue: 0
            },
            {
                name: "z",
                type: "number",
                defaultValue: 0
            }
        ]
    });
    Ext.define("com.noppt.editor.Rotation", {
        extend: "Ext.data.Model",
        idProperty: null,
        fields: [
            {
                name: "x",
                type: "number",
                defaultValue: 0
            },
            {
                name: "y",
                type: "number",
                defaultValue: 0
            },
            {
                name: "z",
                type: "number",
                defaultValue: 0
            }
        ]
    });
    Ext.define("com.noppt.editor.Component", {
        extend: "Ext.data.Model",
        idProperty: null,
        fields: [
            {
                name: "id",
                type: "string"
            },
            {
                name: "type",
                type: "string",
                defaultValue: "image"
            },
            {
                name: "url",
                type: "string"
            },
            {
                name: "width",
                type: "number",
                defaultValue: 0
            },
            {
                name: "height",
                type: "number",
                defaultValue: 0
            },
            {
                name: "opacity",
                type: "number",
                defaultValue: 1
            },
            {
                name: "position",
                reference: "com.noppt.editor.Position",
                unique: true
            },
            {
                name: "rotation",
                reference: "com.noppt.editor.Rotation",
                unique: true
            },
            {
                name: "pos_x",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.position.x = value;
                    }
                    return record.data.position.x;
                }
            },
            {
                name: "pos_y",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.position.y = value;
                    }
                    return record.data.position.y;
                }
            },
            {
                name: "pos_z",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.position.z = value;
                    }
                    return record.data.position.z;
                }
            },
            {
                name: "rot_x",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.rotation.x = value;
                    }
                    return record.data.rotation.x;
                }
            },
            {
                name: "rot_y",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.rotation.y = value;
                    }
                    return record.data.rotation.y;
                }
            },
            {
                name: "rot_z",
                persist: false,
                convert: function (value, record) {
                    if (value) {
                        record.data.rotation.z = value;
                    }
                    return record.data.rotation.z;
                }
            }
        ]
    });

    var componentStore = Ext.create("Ext.data.Store", {
        autoLoad: true,
        autoSync: true,
        autoDestroy: true,
        model: "com.noppt.editor.Component",
        data: components,
        proxy: {
            id: "component",
            type: "memory"
        },
        listeners: {
            update: function () {
                components = [];
                for (var i = 0; i < componentStore.data.items.length; i++) {
                    components.push(componentStore.data.items[i].data);
                }
                localStorage.setItem("components-" + production, JSON.stringify(components));
            }
        }
    });

    var genericFormPanel = Ext.create("Ext.form.Panel", {
        title: "Generic Info",
        width: 1200,
        height: 90,
        padding: 10,
        layout: "column",
        frame: true,
        renderTo: "genericSection",
        items: [
            {
                itemId: "productionName",
                xtype: "textfield",
                fieldLabel: "Production",
                margin: "0 10"
            },
            {
                itemId: "connectProduction",
                xtype: "button",
                text: "Connect",
                handler: function () {
                    production = genericFormPanel.down("#productionName").value;
                    if (production && production.trim().length > 0) {
                        components = JSON.parse(localStorage.getItem("components-" + production));
                        componentStore.loadData(components);
                        componentGridPanel.down("#addComponent").setDisabled(false);
                        componentGridPanel.down("#generateJson").setDisabled(false);
                        genericFormPanel.down("#productionName").setReadOnly(true);
                        genericFormPanel.down("#connectProduction").hide();
                        genericFormPanel.down("#disconnectProduction").show();
                    }
                }
            },
            {
                itemId: "disconnectProduction",
                xtype: "button",
                text: "Disconnect",
                hidden: true,
                handler: function () {
                    production = "";
                    components = [];

                    componentStore.removeAll();

                    componentGridPanel.down("#addComponent").setDisabled(true);
                    componentGridPanel.down("#generateJson").setDisabled(true);

                    genericFormPanel.down("#productionName").setReadOnly(false);
                    genericFormPanel.down("#disconnectProduction").hide();
                    genericFormPanel.down("#connectProduction").show();
                }
            }
        ]
    });


    var componentRowEditing = Ext.create("Ext.grid.plugin.RowEditing", {
        clicksToMoveEditor: 1,
        autoCancel: false
    });

    var componentGridPanel = Ext.create("Ext.grid.Panel", {
        title: "Component Builder",
        width: 1200,
        height: 400,
        frame: true,
        collapsible: true,
        store: componentStore,
        allowDeselect: true,
        renderTo: "componentSection",
        columns: [
            {
                header: "ID",
                dataIndex: "id",
                editor: {
                    allowBlank: false
                }
            },
            {
                header: "Type",
                dataIndex: "type",
                editor: {
                    allowBlank: false
                }
            },
            {
                header: "URL",
                dataIndex: "url",
                editor: {
                    allowBlank: false
                }
            },
            {
                header: "Width",
                dataIndex: "width",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false,
                    minValue: 0
                }
            },
            {
                header: "Height",
                dataIndex: "height",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false,
                    minValue: 0
                }
            },
            {
                header: "Opacity",
                dataIndex: "opacity",
                xtype: "numbercolumn",
                format: "0.00",
                editor: {
                    xtype: "numberfield",
                    format: "0.00",
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 1
                }
            },
            {
                header: "Position X",
                dataIndex: "pos_x",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Position Y",
                dataIndex: "pos_y",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Position Z",
                dataIndex: "pos_z",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rotation X",
                dataIndex: "rot_x",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rotation Y",
                dataIndex: "rot_y",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rotation Z",
                dataIndex: "rot_z",
                xtype: "numbercolumn",
                format: "0",
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            }
        ],
        tbar: [
            {
                itemId: "addComponent",
                text: "Add Component",
                iconCls: "component-add",
                disabled: true,
                handler: function () {
                    componentRowEditing.cancelEdit();

                    var position = Ext.create("com.noppt.editor.Position");
                    var rotation = Ext.create("com.noppt.editor.Rotation");
                    var component = Ext.create("com.noppt.editor.Component", {
                        id: "(ID)",
                        type: "image",
                        url: "",
                        width: 0,
                        height: 0,
                        opacity: 1,
                        position: position.data,
                        rotation: rotation.data
                    });
                    componentStore.insert(0, component);

                    componentRowEditing.startEdit(0, 0);
                }
            },
            {
                itemId: "removeComponent",
                text: "Remove Component",
                iconCls: "component-remove",
                disabled: true,
                handler: function () {
                    var sm = componentGridPanel.getSelectionModel();
                    componentRowEditing.cancelEdit();
                    componentStore.remove(sm.getSelection());
                    if (componentStore.getCount() > 0) {
                        sm.select(0);
                    }
                }
            },
            {
                itemId: "generateJson",
                text: "Generate JSON",
                iconCls: "generate",
                disabled: true,
                handler: function () {
                    var text;
                    try {
                        text = JSON.stringify(components);
                    } catch (err) {
                        text = "Cannot serialize to JSON."
                    }
                    jsonDialog.down("#jsonTextarea").setValue(text);
                    jsonDialog.show();
                }
            }
        ],
        plugins: [
            componentRowEditing
        ],
        listeners: {
            selectionchange: function (view, records) {
                componentGridPanel.down("#removeComponent").setDisabled(!records.length);
            }
        }
    });

    var jsonDialog = Ext.create("widget.window", {
        title: "Generated JSON",
        header: {
            titlePosition: 2,
            titleAlign: "center"
        },
        width: 640,
        height: 480,
        closable: true,
        closeAction: "hide",
        maximizable: false,
        animateTarget: "generateJson",
        items: [
            {
                itemId: "jsonTextarea",
                xtype: "textarea",
                width: "100%",
                height: "100%",
                editable: false
            }
        ]
    });

});
