Ext.require([
    "Ext.grid.*",
    "Ext.data.*",
    "Ext.util.*",
    "Ext.state.*",
    "Ext.form.*",
    "Ext.tree.*",
    "Ext.tip.*",
    "Ext.ux.form.*"
]);

Ext.onReady(function () {

    Ext.define("com.noppt.editor.AutoComplete", {
        extend: "Ext.form.field.Text",
        alias: "widget.autocomplete",
        initComponent: function () {
            this.callParent();
            this.on("blur", autocomplete, this);
        }
    });

    // Define variables.
    var components = [];
    var keyframes = [];
    var production = "";

    function initStructures() {
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
                        if (value != null) {
                            record.data.position.x = value;
                        }
                        return record.data.position.x;
                    }
                },
                {
                    name: "pos_y",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.position.y = value;
                        }
                        return record.data.position.y;
                    }
                },
                {
                    name: "pos_z",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.position.z = value;
                        }
                        return record.data.position.z;
                    }
                },
                {
                    name: "rot_x",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.rotation.x = value;
                        }
                        return record.data.rotation.x;
                    }
                },
                {
                    name: "rot_y",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.rotation.y = value;
                        }
                        return record.data.rotation.y;
                    }
                },
                {
                    name: "rot_z",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.rotation.z = value;
                        }
                        return record.data.rotation.z;
                    }
                }
            ]
        });
        Ext.define("com.noppt.editor.Camera", {
            extend: "Ext.data.Model",
            idProperty: null,
            fields: [
                {
                    name: "position",
                    reference: "com.noppt.editor.Position",
                    unique: true
                },
                {
                    name: "rotation",
                    reference: "com.noppt.editor.Rotation",
                    unique: true
                }
            ]
        });
        Ext.define("com.noppt.editor.Keyframe", {
            extend: "Ext.data.Model",
            idProperty: null,
            fields: [
                {
                    name: "id",
                    reference: "string"
                },
                {
                    name: "camera",
                    reference: "com.noppt.editor.Camera",
                    unique: true
                },
                {
                    name: "components",
                    reference: "com.noppt.editor.Component",
                    unique: false
                },
                {
                    name: "camera_pos_x",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.position.x = value;
                        }
                        return record.data.camera.position.x;
                    }
                },
                {
                    name: "camera_pos_y",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.position.y = value;
                        }
                        return record.data.camera.position.y;
                    }
                },
                {
                    name: "camera_pos_z",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.position.z = value;
                        }
                        return record.data.camera.position.z;
                    }
                },
                {
                    name: "camera_rot_x",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.rotation.x = value;
                        }
                        return record.data.camera.rotation.x;
                    }
                },
                {
                    name: "camera_rot_y",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.rotation.y = value;
                        }
                        return record.data.camera.rotation.y;
                    }
                },
                {
                    name: "camera_rot_z",
                    persist: false,
                    convert: function (value, record) {
                        if (value != null) {
                            record.data.camera.rotation.z = value;
                        }
                        return record.data.camera.rotation.z;
                    }
                }
            ]
        });
    }

    initStructures();

    // Init generic section.
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
                        var compJson = localStorage.getItem("components-" + production);
                        if (compJson && compJson.trim().length > 0) {
                            components = JSON.parse(compJson);
                            componentStore.loadData(components);
                        }

                        var kfJson = localStorage.getItem("keyframes-" + production);
                        if (kfJson && kfJson.trim().length > 0) {
                            keyframes = JSON.parse(kfJson);
                            keyframeStore.loadData(keyframes);
                        }

                        componentGridPanel.down("#addComponent").setDisabled(false);
                        componentGridPanel.down("#generateJson").setDisabled(false);
                        keyframeGridPanel.down("#addKeyframe").setDisabled(false);

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
                    keyframes = [];

                    componentStore.removeAll();
                    keyframeStore.removeAll();

                    componentGridPanel.down("#addComponent").setDisabled(true);
                    componentGridPanel.down("#generateJson").setDisabled(true);
                    keyframeGridPanel.down("#addKeyframe").setDisabled(true);

                    genericFormPanel.down("#productionName").setReadOnly(false);
                    genericFormPanel.down("#disconnectProduction").hide();
                    genericFormPanel.down("#connectProduction").show();
                }
            }
        ]
    });

    // Init component section.
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
                saveComponents();
            }
        }
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
                iconCls: "button-add",
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
                iconCls: "button-remove",
                disabled: true,
                handler: function () {
                    var sm = componentGridPanel.getSelectionModel();
                    componentRowEditing.cancelEdit();
                    componentStore.remove(sm.getSelection());
                    if (componentStore.getCount() > 0) {
                        sm.select(0);
                    }
                    saveComponents();
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

    var keyframeStore = Ext.create("Ext.data.Store", {
        autoLoad: true,
        autoSync: true,
        autoDestroy: true,
        model: "com.noppt.editor.Keyframe",
        proxy: {
            type: "memory"
        },
        listeners: {
            update: function () {
                saveKeyframes();
            }
        }
    });

    var keyframeRowEditing = Ext.create("Ext.grid.plugin.RowEditing", {
        clicksToMoveEditor: 1,
        autoCancel: false
    });

    var keyframeGridPanel = Ext.create("Ext.grid.Panel", {
        title: "Keyframe Builder",
        width: 560,
        height: 400,
        frame: true,
        collapsible: true,
        store: keyframeStore,
        allowDeselect: true,
        renderTo: "keyframePane",
        columns: [
            {
                header: "ID",
                dataIndex: "id",
                width: 80,
                editor: {
                    allowBlank: false
                }
            },
            {
                header: "CP X",
                dataIndex: "camera_pos_x",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "CP Y",
                dataIndex: "camera_pos_y",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "CP Z",
                dataIndex: "camera_pos_z",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "CR X",
                dataIndex: "camera_rot_x",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "CR Y",
                dataIndex: "camera_rot_y",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "CR Z",
                dataIndex: "camera_rot_z",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            }
        ],
        tbar: [
            {
                itemId: "addKeyframe",
                text: "Add Keyframe",
                iconCls: "button-add",
                disabled: true,
                handler: function () {
                    keyframeRowEditing.cancelEdit();

                    var position = Ext.create("com.noppt.editor.Position");
                    var rotation = Ext.create("com.noppt.editor.Rotation");
                    var camera = Ext.create("com.noppt.editor.Camera", {
                        position: position.data,
                        rotation: rotation.data
                    });
                    var keyframe = Ext.create("com.noppt.editor.Keyframe", {
                        id: "(ID)",
                        camera: camera.data
                    });
                    keyframeStore.insert(keyframes.length, keyframe);

                    keyframeRowEditing.startEdit(keyframes.length, 0);
                }
            },
            {
                itemId: "removeKeyframe",
                text: "Remove Keyframe",
                iconCls: "button-remove",
                disabled: true,
                handler: function () {
                    var sm = keyframeGridPanel.getSelectionModel();
                    keyframeRowEditing.cancelEdit();
                    keyframeStore.remove(sm.getSelection());
                    if (keyframeStore.getCount() > 0) {
                        sm.select(0);
                    }
                    saveKeyframes();
                }
            }
        ],
        plugins: [
            keyframeRowEditing
        ],
        listeners: {
            selectionchange: function (view, records) {
                keyframeGridPanel.down("#removeKeyframe").setDisabled(!records.length);
                changeGridPanel.down("#addChange").setDisabled(!records.length);
                changeGridPanel.down("#removeChange").setDisabled(!records.length);

                changeStore.removeAll();
                if (records.length === 1) {
                    var changes = records[0].data.components;
                    if (changes && changes.length > 0) {
                        changeStore.loadData(changes);
                    }
                    currentKeyframe = records[0].data;
                }
            }
        }
    });

    var currentKeyframe;

    var changeStore = Ext.create("Ext.data.Store", {
        autoLoad: true,
        autoSync: true,
        autoDestroy: true,
        model: "com.noppt.editor.Component",
        proxy: {
            type: "memory"
        },
        listeners: {
            update: function () {
                currentKeyframe.components = [];
                for (var i = 0; i < changeStore.data.items.length; i++) {
                    currentKeyframe.components.push(changeStore.data.items[i].data);
                }
                saveKeyframes();
            }
        }
    });

    var changeRowEditing = Ext.create("Ext.grid.plugin.RowEditing", {
        clicksToMoveEditor: 1,
        autoCancel: false
    });

    var changeGridPanel = Ext.create("Ext.grid.Panel", {
        title: "Change Builder",
        width: 640,
        height: 400,
        frame: true,
        collapsible: true,
        store: changeStore,
        allowDeselect: true,
        renderTo: "changePane",
        columns: [
            {
                header: "ID",
                dataIndex: "id",
                width: 80,
                editor: {
                    allowBlank: false,
                    xtype: "autocomplete"
                }
            },
            {
                header: "Opacity",
                dataIndex: "opacity",
                xtype: "numbercolumn",
                format: "0.00",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0.00",
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 1
                }
            },
            {
                header: "Pos X",
                dataIndex: "pos_x",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Pos Y",
                dataIndex: "pos_y",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Pos Z",
                dataIndex: "pos_z",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rot X",
                dataIndex: "rot_x",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rot Y",
                dataIndex: "rot_y",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            },
            {
                header: "Rot Z",
                dataIndex: "rot_z",
                xtype: "numbercolumn",
                format: "0",
                width: 80,
                editor: {
                    xtype: "numberfield",
                    format: "0",
                    allowBlank: false
                }
            }
        ],
        tbar: [
            {
                itemId: "addChange",
                text: "Add Change",
                iconCls: "button-add",
                disabled: true,
                handler: function () {
                    changeRowEditing.cancelEdit();

                    var position = Ext.create("com.noppt.editor.Position");
                    var rotation = Ext.create("com.noppt.editor.Rotation");
                    var change = Ext.create("com.noppt.editor.Component", {
                        id: "(ID)",
                        opacity: 1,
                        position: position.data,
                        rotation: rotation.data
                    });
                    changeStore.insert(0, change);

                    changeRowEditing.startEdit(0, 0);
                }
            },
            {
                itemId: "removeChange",
                text: "Remove Change",
                iconCls: "button-remove",
                disabled: true,
                handler: function () {
                    var sm = changeGridPanel.getSelectionModel();
                    changeRowEditing.cancelEdit();
                    changeStore.remove(sm.getSelection());
                    if (changeStore.getCount() > 0) {
                        sm.select(0);
                    }

                    currentKeyframe.components = [];
                    for (var i = 0; i < changeStore.data.items.length; i++) {
                        currentKeyframe.components.push(changeStore.data.items[i].data);
                    }
                    saveKeyframes();
                }
            }
        ],
        plugins: [
            changeRowEditing
        ],
        listeners: {
            selectionchange: function (view, records) {
                changeGridPanel.down("#removeChange").setDisabled(!records.length);
            }
        }
    });

    function autocomplete(comp) {
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.id === comp.lastValue) {
                var sm = changeGridPanel.getSelectionModel();
                sm.getSelection()[0].set("id", component.id);
                sm.getSelection()[0].set("opacity", component.opacity);
                sm.getSelection()[0].set("pos_x", component.position.x);
                sm.getSelection()[0].set("pos_y", component.position.y);
                sm.getSelection()[0].set("pos_z", component.position.z);
                sm.getSelection()[0].set("rot_x", component.rotation.x);
                sm.getSelection()[0].set("rot_y", component.rotation.y);
                sm.getSelection()[0].set("rot_z", component.rotation.z);
                changeRowEditing.cancelEdit();
                break;
            }
        }
    }

    function saveComponents() {
        components = [];
        for (var i = 0; i < componentStore.data.items.length; i++) {
            var current = componentStore.data.items[i].data;
            var component = {
                id: current.id,
                type: current.type,
                url: current.url,
                width: current.width,
                height: current.height,
                opacity: current.opacity,
                position: {
                    x: current.position.x,
                    y: current.position.y,
                    z: current.position.z
                },
                rotation: {
                    x: current.rotation.x,
                    y: current.rotation.y,
                    z: current.rotation.z
                }
            };
            components.push(component);
        }
        localStorage.setItem("components-" + production, JSON.stringify(components));
    }

    function saveKeyframes() {
        keyframes = [];
        for (var i = 0; i < keyframeStore.data.items.length; i++) {
            var current = keyframeStore.data.items[i].data;
            if (current) {
                var keyframe = {
                    id: current.id,
                    camera: {
                        position: {
                            x: current.camera.position.x,
                            y: current.camera.position.y,
                            z: current.camera.position.z
                        },
                        rotation: {
                            x: current.camera.rotation.x,
                            y: current.camera.rotation.y,
                            z: current.camera.rotation.z
                        }
                    },
                    components: []
                };
                if (current.components) {
                    for (var j = 0; j < current.components.length; j++) {
                        var comp = current.components[j];
                        var component = {
                            id: comp.id,
                            opacity: comp.opacity,
                            position: {
                                x: comp.position.x,
                                y: comp.position.y,
                                z: comp.position.z
                            },
                            rotation: {
                                x: comp.rotation.x,
                                y: comp.rotation.y,
                                z: comp.rotation.z
                            }
                        };
                        keyframe.components.push(component);
                    }
                }
                keyframes.push(keyframe);
            }
        }
        localStorage.setItem("keyframes-" + production, JSON.stringify(keyframes));
    }
});