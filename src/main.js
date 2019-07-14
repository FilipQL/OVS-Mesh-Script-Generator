window._ = require('lodash');
import vis from 'vis'
import Vue from 'vue'
import App from './App.vue'

window.eventHub = new Vue();

/**
 * Controller, listen and Open Flow version that are used as default when adding new switches. A user can change these
 * values (see DefaultConfiguration.vue), and those changes will be also applied to all switches that currently have
 * the default controller, listen and/or ofv.
 *
 * @type {{controller: string, listen: string, ofv: string}}
 * @private
 */
window._defaultConfiguration = {
    controller: 'tcp:127.0.0.1:6653',
    listen: 'ptcp:6634',
    ofv: 'OpenFlow13'
};

/* ------------------------------ VIS INITIAL DATA/CONFIGURATION ------------------------------ */

/**
 * Vis nodes (switches and hosts).
 * http://visjs.org/docs/network
 *
 * @type {vis.DataSet}
 * @private
 */
window._nodes = new vis.DataSet([
    { id: 0, index: 0, group: 'switch', label: 'sw00', x: -147, y: -77, controller: 'tcp:127.0.0.1:6653', listen: 'ptcp:6634', ofv: 'OpenFlow13' },
    { id: 1, index: 1, group: 'switch', label: 'sw01', x: -186, y: 88, controller: 'tcp:127.0.0.1:6653', listen: 'ptcp:6634', ofv: 'OpenFlow13' },
    { id: 2, index: 2, group: 'switch', label: 'sw02', x: 8, y: 160, controller: 'tcp:127.0.0.1:6653', listen: 'ptcp:6634', ofv: 'OpenFlow13' },
    { id: 3, index: 3, group: 'switch', label: 'sw03', x: 159, y: 28, controller: 'tcp:127.0.0.1:6653', listen: 'ptcp:6634', ofv: 'OpenFlow13' },
    { id: 4, index: 4, group: 'switch', label: 'sw04', x: 45, y: -111, controller: 'tcp:127.0.0.1:6653', listen: 'ptcp:6634', ofv: 'OpenFlow13' },

    { id: 5, index: 0, group: 'host', label: 'Host-00', x: -257.5, y: -58.5 },
    { id: 6, index: 1, group: 'host', label: 'Host-01', x: 193.75, y: -68.55 }
]);

/**
 * Vis edges (links between switches/host and switches).
 * http://visjs.org/docs/network
 *
 * @type {vis.DataSet}
 * @private
 */
window._edges = new vis.DataSet([
    { from: 0, to: 1 },
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 0, to: 4 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },


    { from: 5, to: 1 },
    { from: 6, to: 4 }
]);

/**
 * Define locale: http://visjs.org/docs/network/#locales
 */
var locales = {
    ovs: {
        edit: 'Edit',
        del: 'Delete selected',
        back: 'Back',
        addNode: 'Add Node',
        addEdge: 'Add Link',
        editNode: 'Edit Switch',
        editEdge: 'Edit Link',
        addDescription: 'Click in an empty space to place a new node.',
        edgeDescription: 'Click on a node and drag the link to another node to connect them.',
        editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
        createEdgeError: 'Cannot link edges to a cluster.',
        deleteClusterError: 'Clusters cannot be deleted.',
        editClusterError: 'Clusters cannot be edited.'
    }
};

/**
 * Provide the data in the vis format.
 * http://visjs.org/docs/network
 *
 * @type {{nodes: (vis.DataSet|*), edges: (vis.DataSet|*)}}
 * @private
 */
window._data = {
    nodes: _nodes,
    edges: _edges
};

/**
 * Customize (configure) the network.
 * http://visjs.org/docs/network/#options
 */
window._options = {
    locale: 'ovs',
    locales: locales,
    interaction: {
        hover: true,
        keyboard: {
            enabled: true,
            speed: {x: 3, y: 3, zoom: 0.02},
            bindToWindow: false
        },
        multiselect: true,
        navigationButtons: true
    },

    manipulation: {
        enabled: true,
        initiallyActive: true,

        /**
         * Add a new switch or host.
         * If a node is going to be added by a user, this function will be called first.
         * http://visjs.org/docs/network/manipulation.html
         *
         * @param nodeData
         * @param callback
         */
        addNode(nodeData, callback) {
            // Set Modal's Title and Default Input Values
            document.getElementById('operation').innerHTML = "Add Node";
            document.getElementById('saveButton-text').innerHTML = " Add Node";
            document.getElementById('node-controller').value = _defaultConfiguration.controller;
            document.getElementById('node-listen').value = _defaultConfiguration.listen;
            document.getElementById('node-ofv').value = _defaultConfiguration.ofv;
            $('#node-type').prop('disabled', false);

            // Save Button Click
            document.getElementById('saveButton').onclick = function() {

                let nodeTypeSelectElement = document.getElementById("node-type");
                let nodeType = nodeTypeSelectElement.options[nodeTypeSelectElement.selectedIndex].value;

                if (nodeType == "switch") {
                    assignValues(nodeData);
                    eventHub.$emit('add-switch', nodeData);
                    callback(nodeData);

                    // Emit these events just to update the listed values of controllers, listens & ofvs of nodes
                    eventHub.$emit('change-default-controller');
                    eventHub.$emit('change-default-listen');
                    eventHub.$emit('change-default-ofv');

                    $('#network-popUp').modal('hide');
                }

                if (nodeType == "host") {
                    eventHub.$emit('add-host', nodeData);
                    callback(nodeData);

                    $('#network-popUp').modal('hide');
                }

            };

            $('#network-popUp').modal();
        },

        /**
         * Change the value of controller, listen and/or ofv for a selected switch.
         * If a node is going to be edited by a user, this function will be called first.
         * http://visjs.org/docs/network/manipulation.html
         *
         * @param nodeData
         * @param callback
         */
        editNode(nodeData, callback) {
            if (nodeData.group == "switch") {
                // Set Modal's Title and Input Values
                document.getElementById("node-type").selectedIndex = 0;
                document.getElementById('operation').innerHTML = "Edit Switch " + nodeData.label;
                document.getElementById('saveButton-text').innerHTML = " Save Changes";
                document.getElementById('node-controller').value = nodeData.controller;
                document.getElementById('node-listen').value = nodeData.listen;
                document.getElementById('node-ofv').value = nodeData.ofv;

                $('#node-type').prop('disabled', 'disabled');

                // Save Button Click
                document.getElementById('saveButton').onclick = function() {
                    assignValues(nodeData);
                    callback(nodeData);

                    // Emit these events just to update the listed values of controllers, listens & ofvs of nodes
                    eventHub.$emit('change-default-controller');
                    eventHub.$emit('change-default-listen');
                    eventHub.$emit('change-default-ofv');

                    $('#network-popUp').modal('hide');
                };

                // If a user cancels editing- Vis excepts: callback(null);
                $('#network-popUp').on('hide.bs.modal', function (e) {
                    callback(null);
                });

                // Display Popup with Form
                eventHub.$emit('edit-switch');
                $('#network-popUp').modal();

            } else {
                callback(null);
            }
        },

        /**
         * Delete selected switch(es) and/or host(s).
         * If a node is going to be deleted by a user, this function will be called first.
         * http://visjs.org/docs/network/manipulation.html
         *
         * @param deleteData
         * @param callback
         */
        deleteNode(deleteData, callback) {
            eventHub.$emit('delete-node', deleteData);
            callback(deleteData);

            // Emit these events just to update the listed values of controllers, listens & ofvs of nodes
            eventHub.$emit('change-default-controller');
            eventHub.$emit('change-default-listen');
            eventHub.$emit('change-default-ofv');
        },

        /**
         * Add a new link between two nodes (switches/host and switch).
         * If an edge (link) is going to be added by a user, this function will be called first.
         * http://visjs.org/docs/network/manipulation.html
         *
         * @param edgeData
         * @param callback
         */
        addEdge(edgeData, callback) {
            var nodeOne = _nodes.get(edgeData.from);
            var nodeTwo = _nodes.get(edgeData.to);

            if (edgeData.from === edgeData.to) {
                $('#add-link-error').modal(); // You cannot connect node (switch or host) to itself;
                callback(null);
            } else if (nodeOne.group === "host" && nodeTwo.group === "host") {
                $('#add-link-error').modal(); // Hosts cannot connect to other hosts.
                callback(null);
            } else if (nodeOne.group === "switch" && nodeTwo.group === "switch") {
                eventHub.$emit('add-s2s-link', edgeData);
                callback(edgeData);
            } else if (nodeOne.group !=  nodeTwo.group) {
                eventHub.$emit('add-h2s-link', edgeData);
                callback(edgeData)
            }
        },

        /**
         * Redirect the selected link which connects two switches or switch and host.
         * If an edge (link) is going to be edited by a user, this function will be called first.
         *
         * @param edgeData
         * @param callback
         */
        editEdge(edgeData, callback) {
            if (edgeData.from === edgeData.to) {
                $('#add-link-error').modal(); // You cannot connect node (switch or host) to itself;
                callback(null);
            } else if (_nodes.get(edgeData.from).group == 'host' && _nodes.get(edgeData.to).group == 'host') {
                $('#add-link-error').modal(); // Hosts cannot connect to other hosts.
                callback(null);
            } else {
                eventHub.$emit('edit-link', edgeData);
                callback(edgeData)
            }
        },

        /**
         * Delete the selected link.
         * If an edge (link) is going to be deleted by a user, this function will be called first.
         *
         * @param deleteData
         * @param callback
         */
        deleteEdge(deleteData, callback) {
            eventHub.$emit('delete-link', deleteData);
            callback(deleteData)
        }
    }, // manipulation

    nodes: {
        physics: false,
        shape: 'box',
        size: 16
    },

    edges: {
        color: '#666666'
    },

    groups: {
        host: {
            color: '#FF9900',
            shape: 'triangle'
        }
    }
}; // _options

/**
 * _network will contain the Vis instance when the "app" Vue application is mounted (see App.vue).
 *
 * @type {{}}
 * @private
 */
window._network = {};

/**
 * Assign new properties (controller, listen and ofv) to te nodeData object (to the newly added switch) with values
 * entered in the popup form.
 *
 * @param nodeData
 */
function assignValues(nodeData) {
    nodeData.controller = document.getElementById('node-controller').value.trim();
    nodeData.listen = document.getElementById('node-listen').value.trim();
    nodeData.ofv = document.getElementById('node-ofv').value.trim();
}

/* ------------------------------ / VIS INITIAL DATA/CONFIGURATION ------------------------------ */

new Vue({
    el: '#app',
    render: h => h(App)
});
