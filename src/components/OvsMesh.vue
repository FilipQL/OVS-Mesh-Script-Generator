<template>
    <div class="row">
        <div class="col-md-12">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs bordered">
                <li class="active">
                    <a href="#bash" data-toggle="tab">
                        <i class="fa fa-cog"></i>
                        Bash Script
                    </a>
                </li>
                <li>
                    <a href="#tabular" data-toggle="tab">
                        <i class="fa fa-table"></i>
                        Tabular View
                    </a>
                </li>
                <li>
                    <a href="#ie" data-toggle="tab">
                        <i class="fa fa-exchange"></i>
                        Import/Export Project
                    </a>
                </li>
            </ul>
            <!-- / Nav tabs -->

            <!-- Tab panes -->
            <div class="tab-content">
                <!-- BASH SCRIPT -->
                <div class="tab-pane fade in active" id="bash">
                    <div class="row">
                        <div class="col-md-12">
                            <pre><code id="bash-script" style="white-space: pre;">{{ bash_script }}</code></pre>

                            <div id="bash-buttons" class="text-center">
                                <button class="btn btn-primary clipboard-btn" data-clipboard-target="#bash-script">
                                    <i class="fa fa-clipboard" aria-hidden="true"></i>
                                    Copy to clipboard
                                </button>

                                <button class="btn btn-success" @click="downloadBash">
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                    Download the script
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- / BASH SCRIPT -->

                <!-- TABULAR DISPLAY -->
                <div class="tab-pane fade" id="tabular">
                    <div class="table-responsive text-center">
                        <table class="table table-bordered" id="tabela">
                            <thead>
                                <tr>
                                    <th> </th>
                                    <th v-for="col_name in table_headings">{{ col_name }}</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(t_row, index) in table_data">
                                    <th scope="row" class="tr-head">{{ index }}</th>
                                    <td v-for="data in t_row">{{ data }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted text-center">Each value represents the number of links between the nodes.</p>
                    <p class="text-center">
                        <a id="csv-button" type="button" class="btn btn-info" @click="exportTableToCSV">
                            <i class="fa fa-fw fa-file-excel-o"></i>
                            Expot to CSV
                        </a>
                    </p>
                </div>
                <!-- http://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html -->
                <!-- / TABULAR DISPLAY -->

                <!-- IMPORT/EXPORT PROJECT -->
                <div class="tab-pane fade" id="ie">
                    <div class="row">
                        <div class="col-md-12">
                            <p class="text-center">
                                Projects are exported as JSON files.
                            </p>

                            <p class="text-center">
                                <button type="button" class="btn btn-danger" @click="exportProject">
                                    <i class="fa fa-fw fa-download"></i>
                                    Export Project
                                </button>

                                <label class="btn btn-warning">
                                    <i class="fa fa-fw fa-upload"></i>
                                    Import Project
                                    <input class="hidden" type="file" id="project-file" @change="importProject" accept=".json">
                                </label>
                            </p>
                        </div>
                    </div>
                </div>
                <!-- / IMPORT/EXPORT PROJECT -->
            </div>
            <!-- / Tab panes -->
        </div>
        <!-- / .col-md-12 -->
    </div>
    <!-- / .row -->
</template>

<script type="text/babel">
    import vis from 'vis'
    import { saveAs } from 'file-saver'
    import clipboard from 'clipboard'
    import bashMixin from './bash.js'

    export default {
        mixins: [bashMixin],
        data() {
            return {
                /**
                 * "Switch-to-Switch Matrix" - this multidimensional array contains information on the number of links
                 * between switches, and it is used for generating the bash script and tabular display. The initial data
                 * are consistent with the VIS INITIAL DATA/CONFIGURATION (see main.js).
                 * For more details please check: http://laraget.com/blog/ovs-mesh
                 *
                 */
                s2s_matrix: [
                    [],
                    [2],
                    [1, 1],
                    [1, 2, 1],
                    [2, 0, 1, 1]
                ],

                /**
                 * The default controller, listen and ofv.
                 * The initial data are consistent with the VIS INITIAL DATA/CONFIGURATION (see main.js), and when a user
                 * changes some of these (from DefaultConfiguration.vue) - it will be immediately updated.
                 */
                default_controller: 'tcp:127.0.0.1:6633',
                default_listen: 'ptcp:6634',
                default_ofv: 'OpenFlow13',

                /**
                 * These arrays contain information on the controllers, listens and  Open Flow versions for each switch, respectively.
                 * The initial data are consistent with the VIS INITIAL DATA/CONFIGURATION (see main.js).
                 */
                controllers: ['tcp:127.0.0.1:6633', 'tcp:127.0.0.1:6633', 'tcp:127.0.0.1:6633', 'tcp:127.0.0.1:6633', 'tcp:127.0.0.1:6633'],
                listens: ['ptcp:6634', 'ptcp:6634', 'ptcp:6634', 'ptcp:6634', 'ptcp:6634'],
                ofvs: ['OpenFlow13', 'OpenFlow13', 'OpenFlow13', 'OpenFlow13', 'OpenFlow13'],

                /**
                 * "Host-to-Switch Matrix" - this multidimensional array contains information on the number of links
                 * between hosts and switches, and it is used for generating the bash script and tabular display. The
                 * initial data are consistent with the VIS INITIAL DATA/CONFIGURATION (see main.js).
                 * For more details please check: http://laraget.com/blog/ovs-mesh
                 *
                 */
                h2s_matrix: [
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1]
                ]
            }
        },
        computed: {
            /**
             * This computed property is used for rendering table headings (in Tabular Display section/tab).
             */
            table_headings() {
                let result = [];

                this.s2s_matrix.forEach((currentValue, index) => {
                    result[index] = "sw" + ('0' + index).slice(-2);
                });

                this.h2s_matrix.forEach((currentValue, index) => {
                    result.push("Host-" + ('0' + index).slice(-2));
                });

                return result;
            },

            /**
             * This computed property is used for rendering table data (cells) (in Tabular Display section/tab).
             */
            table_data() {
                let result = {};

                this.s2s_matrix.forEach((currentValue, index) => {
                    let tr = _.concat(currentValue, ['']);

                    for (let i = index + 1; i < this.s2s_matrix.length; i++) {
                        tr[i] = this.s2s_matrix[i][index];
                    }

                    this.h2s_matrix.forEach((currentValue) => {
                        tr.push(currentValue[index]);
                    });

                    let key = "sw" + ('0' + index).slice(-2);

                    result[key] = tr;
                });

                this.h2s_matrix.forEach((currentValue, index) => {
                    let key = "Host-" + ('0' + index).slice(-2);

                    result[key] = currentValue;
                });

                return result;
            }
        },

        created() {
            eventHub.$on('change-default-controller', this.changeDefaultController); // DefaultConfiguration.vue
            eventHub.$on('change-default-listen', this.changeDefaultListen);         // DefaultConfiguration.vue
            eventHub.$on('change-default-ofv', this.changeDefaultOfv);               // DefaultConfiguration.vue

            eventHub.$on('add-switch', this.addSwitch);                              // main.js
            eventHub.$on('delete-node', this.deleteNode);                            // main.js

            eventHub.$on('add-host', this.addHost);                                  // main.js

            eventHub.$on('add-s2s-link', this.addS2SLink);                           // main.js
            eventHub.$on('add-h2s-link', this.addH2SLink);                           // main.js
            eventHub.$on('edit-link', this.editLink);                                // main.js
            eventHub.$on('delete-link', this.deleteLink);                            // main.js
        },

        beforeDestroy() {
            eventHub.$off('change-default-controller', this.changeDefaultController);
            eventHub.$off('change-default-listen', this.changeDefaultListen);
            eventHub.$off('change-default-ofv', this.changeDefaultOfv);

            eventHub.$off('add-switch', this.addSwitch);
            eventHub.$off('delete-node', this.deleteNode);

            eventHub.$off('add-host', this.addHost);

            eventHub.$off('add-s2s-link', this.addS2SLink);
            eventHub.$off('add-h2s-link', this.addH2SLink);
            eventHub.$off('edit-link', this.editLink);
            eventHub.$off('delete-link', this.deleteLink);
        },

        methods: {
            /**
             * When a user changes the value of the default controller, update all switches controllers that are
             * the same as the value of the previous default controller.
             */
            changeDefaultController(newDefaultController) {
                // When a user changes the default value of controller (DefaultConfiguration.vue), update it here.
                // We are doing this check because this method can be called when a user doesn't change the default
                // controller but only changes it for the specific node (see main.js - editNode(nodeData, callback).
                if (typeof newDefaultController != 'undefined') {
                    this.default_controller = newDefaultController;
                }

                let result = [];
                let switchIds = this.getSwitchNodes().getIds();

                switchIds.forEach(function(currentValue) {
                    result[_nodes.get(currentValue).index] = _nodes.get(currentValue).controller;
                });

                this.controllers = result;
            },

            /**
             * When a user changes the value of the default listen, update all switches listens that are
             * the same as the value of the previous default listen.
             */
            changeDefaultListen(newDefaultListen) {
                // When a user changes the default value of listen (DefaultConfiguration.vue), update it here.
                // We are doing this check because this method can be called when a user doesn't change the default
                // listen but only changes it for the specific node (see main.js - editNode(nodeData, callback).
                if (typeof newDefaultListen != 'undefined') {
                    this.default_listen = newDefaultListen;
                }

                let result = [];
                let switchIds = this.getSwitchNodes().getIds();

                switchIds.forEach(function(currentValue) {
                    result[_nodes.get(currentValue).index] = _nodes.get(currentValue).listen;
                });

                this.listens = result;
            },

            /**
             * When a user changes the value of the default ofv, update all switches ofvs that are
             * the same as the value of the previous default ofv.
             */
            changeDefaultOfv(newDefaultOfv) {
                // When a user changes the default value of ofv (DefaultConfiguration.vue), update it here.
                // We are doing this check because this method can be called when a user doesn't change the default
                // ofv but only changes it for the specific node (see main.js - editNode(nodeData, callback).
                if (typeof newDefaultOfv != 'undefined') {
                    this.default_ofv = newDefaultOfv;
                }

                let result = [];
                let switchIds = this.getSwitchNodes().getIds();

                switchIds.forEach(function(currentValue) {
                    result[_nodes.get(currentValue).index] = _nodes.get(currentValue).ofv;
                });

                this.ofvs = result;
            },

            /**
             * Add a new switch to the graph and update the script.
             * Actually, callback(nodeData) which adds a new switch to the Vis graph is executed in the main.js (see
             * addNode function in the Vis Network manipulation options).
             * Here, we are only setting some attributes (id, group, index, label) to the switch that is being added.
             */
            addSwitch(nodeData) {
                let length, last_id, switch_nodes, switch_nodes_length, last_index, host_nodes_length;

                // Prepare data for the new node
                length = _nodes.getIds().length;

                if (length == 0) {
                    last_id = -1;
                } else {
                    last_id = _nodes.get(_nodes.getIds()[length - 1]).id;
                }

                switch_nodes = this.getSwitchNodes();
                switch_nodes_length = switch_nodes.getIds().length;

                if (switch_nodes_length == 0) {
                    last_index = -1;
                } else {
                    last_index = switch_nodes.get(switch_nodes.getIds()[switch_nodes_length - 1]).index;
                }

                // Set the data for the newly added node
                nodeData.id = ++last_id;
                nodeData.group = "switch";
                nodeData.index = ++last_index;
                nodeData.label = "sw" + ('0' + nodeData.index).slice(-2);

                // Update the script's s2s matrix
                this.$set(this.s2s_matrix, switch_nodes_length, new Array(switch_nodes_length).fill(0));

                // Update the script's h2s matrix
                host_nodes_length = this.getHostNodes().getIds().length;

                for (let i = 0; i < host_nodes_length; i++) {
                    this.$set(this.h2s_matrix[i], switch_nodes_length, 0);
                }

                this.setupTableHoverEffect();
            },

            /**
             * Get all nodes that are switches (returns an array of node objects).
             */
            getSwitchNodes() {
                return new vis.DataView(_nodes, {
                    filter: function (item) {
                        return (item.group == "switch");
                    },
                    fields: ['id', 'index', 'label', 'controller', 'listen', 'ofv']
                });
            },

            /**
             * Add a new host to the graph and update the script.
             * Actually, callback(nodeData) which adds a new host to the Vis graph is executed in the main.js (see
             * addNode function in the Vis Network manipulation options).
             * Here, we are only setting some attributes (id, group, index, label) to the host that is being added.
             */
            addHost(nodeData) {
                let length, last_id, host_nodes, host_nodes_length, last_index, switch_nodes_length;

                length = _nodes.getIds().length;

                if (length == 0) {
                    last_id = -1;
                } else {
                    last_id = _nodes.get(_nodes.getIds()[length - 1]).id;
                }

                host_nodes = this.getHostNodes();
                host_nodes_length = host_nodes.getIds().length;

                if (host_nodes_length == 0) {
                    last_index = -1;
                } else {
                    last_index = host_nodes.get(host_nodes.getIds()[host_nodes_length - 1]).index;
                }

                nodeData.id = ++last_id;
                nodeData.group = "host";
                nodeData.index = ++last_index;
                nodeData.label = "Host-" + ('0' + nodeData.index).slice(-2);

                // Update the script's h2s matrix
                switch_nodes_length = this.getSwitchNodes().getIds().length;
                this.$set(this.h2s_matrix, host_nodes_length, new Array(switch_nodes_length).fill(0));

                this.setupTableHoverEffect();
            },

            /**
             * Get all nodes that are hosts (returns an array of node objects).
             */
            getHostNodes() {
                return new vis.DataView(_nodes, {
                    filter: function (item) {
                        return (item.group == "host");
                    },
                    fields: ['id', 'index', 'label']
                });
            },

            /**
             * Delete a selected node(s) form the script's matrix and graph.
             * Actually, callback(deleteData) which removes the selected node(s) from the Vis graph is executed in the
             * main.js (see deleteNode function in the Vis Network manipulation options).
             * Here, we are only updating some attributes (index & label) of the remaining nodes that are on the graph.
             */
            deleteNode(deleteData) {
                for (var n = 0; n < deleteData.nodes.length; n++) {
                    var nodeId = deleteData.nodes[n];
                    var currentNode = _nodes.get(nodeId);

                    if (currentNode.group == "switch") {
                        // Update the script's s2s matrix
                        this.s2s_matrix.splice(currentNode.index, 1);
                        for (var i = currentNode.index; i < this.s2s_matrix.length; i++) {
                            this.s2s_matrix[i].splice(currentNode.index, 1);
                        }

                        // Update the attributes of the remaining switch nodes with bigger IDs (indexes/labels)
                        let maxId = Math.max.apply(null, _nodes.getIds());
                        for (let j = nodeId + 1; j <= maxId; j++) {
                            if (_nodes.get(j) && _nodes.get(j).group == "switch") {
                                let nodeToUpdate = _nodes.get(j);

                                nodeToUpdate.index--;
                                nodeToUpdate.label = "sw" + ('0' + nodeToUpdate.index).slice(-2);

                                _nodes.update(nodeToUpdate);
                            }
                        }

                        // Update the script's h2s matrix
                        var host_nodes_length = this.h2s_matrix.length;
                        if (host_nodes_length > 0) {
                            for (let h = 0; h < host_nodes_length; h++) {
                                this.h2s_matrix[h].splice(currentNode.index, 1);
                            }
                        }
                    }

                    if (currentNode.group == "host") {
                        // Update the script's h2s matrix
                        this.h2s_matrix.splice(currentNode.index, 1);

                        // Update the attributes (indexes, labels) of the remaining host nodes with bigger IDs (indexes/labels)
                        let maxId = Math.max.apply(null, this.getHostNodes().getIds());
                        for (let j = nodeId + 1; j <= maxId; j++) {
                            if (_nodes.get(j) && _nodes.get(j).group == "host") {
                                let nodeToUpdate = _nodes.get(j);

                                nodeToUpdate.index--;
                                nodeToUpdate.label = "Host-" + ('0' + nodeToUpdate.index).slice(-2);

                                _nodes.update(nodeToUpdate);
                            }
                        }
                    }
                }

                this.deleteIndependentLinks(deleteData);
            },

            /**
             * Extract links that are not directly connected to the selected node(s)...
             * https://github.com/almende/vis/issues/2603
             * ... then format (create) the "independentDeleteData" that Vis understands
             * ... and pass it to the deleteLink method.
             */
            deleteIndependentLinks(deleteData) {
                let nodesEdges = []; // All of the edges that are directly connected to the selected node(s)

                for (let i = 0; i < deleteData.nodes.length; i++) {
                    let nodeId = deleteData.nodes[i];
                    let currentNode = _nodes.get(nodeId);

                    nodesEdges = _.concat(nodesEdges, _network.getConnectedEdges(nodeId));
                }

                let independentEdges = _.difference(deleteData.edges, nodesEdges);

                if (independentEdges.length > 0) {
                    let independentDeleteData = {
                        edges: independentEdges,
                        nodes: []
                    };
                    this.deleteLink(independentDeleteData);
                }
            },

            /**
             * Add a new switch-to-switch link
             */
            addS2SLink(edgeData) {
                let nodeOne = _nodes.get(edgeData.from);
                let nodeTwo = _nodes.get(edgeData.to);

                let ovs = Math.max(nodeOne.index, nodeTwo.index);
                let link = Math.min(nodeOne.index, nodeTwo.index);

                this.s2s_matrix[ovs][link]++;

                let val = this.s2s_matrix[ovs];
                this.$set(this.s2s_matrix, ovs, val);
            },

            /**
             * Add a new host-to-switch link
             */
            addH2SLink(edgeData) {
                let nodeOne = _nodes.get(edgeData.from);
                let nodeTwo = _nodes.get(edgeData.to);

                let host = _.find([nodeOne, nodeTwo], {'group': 'host'});
                let sw = _.find([nodeOne, nodeTwo], {'group': 'switch'});

                this.h2s_matrix[host.index][sw.index]++;

                let val = this.h2s_matrix[host.index];
                this.$set(this.h2s_matrix, host.index, val);
            },

            /**
             * Redirect link to another node.
             */
            editLink(edgeData) {
                let currentlyRelatedNodes, nodeOne, nodeTwo, nodeFrom, nodeTo, ovs, link, val;

                currentlyRelatedNodes = _network.getConnectedNodes(edgeData.id);

                // I'm doing this check because if one related node has id=0, then Vis
                // [_network.getConnectedNodes(edgeId)] returns only the id of the other node:
                if (currentlyRelatedNodes.length == 1) {
                    currentlyRelatedNodes.unshift(0);
                }

                // The nodes that were connected by the link that is being redirected:
                nodeOne = _nodes.get(currentlyRelatedNodes[0]);
                nodeTwo = _nodes.get(currentlyRelatedNodes[1]);

                // https://github.com/almende/vis/issues/2736#issuecomment-286292637
                nodeFrom = _nodes.get(_.intersection([edgeData.from, edgeData.to], currentlyRelatedNodes)[0]);

                // Check if a user redirects to where it already was connected:
                let difference = _.difference([edgeData.from, edgeData.to], currentlyRelatedNodes);
                if (_.isEmpty(difference)) {
                    return false;
                }
                nodeTo = _nodes.get(difference[0]);


                if (nodeOne.group == "switch" && nodeTwo.group == "switch") { // if we are redirecting a link that was connecting two switches
                    this.decreaseS2SLinks(nodeOne, nodeTwo);

                    if (nodeTo.group == "switch") { // if we are redirecting a link to another switch
                        this.increaseS2SLinks(nodeFrom, nodeTo);
                    } else { // if we are redirecting a link to host
                        this.increaseH2SLinks(nodeTo, nodeFrom);
                    }
                } else { // if we are redirecting a link that was connecting host and switch
                    let host = _.find([nodeOne, nodeTwo], {group: 'host'});
                    let sw = _.find([nodeOne, nodeTwo], {group: 'switch'});

                    if (nodeFrom.id == host.id) { // if we are redirecting link from host to another switch
                        this.decreaseH2SLinks(host, sw);
                        this.increaseH2SLinks(host, nodeTo);
                    } else { // if we are redirecting a link from switch...
                        if (nodeTo.group == "switch") { // ... to switch
                            this.decreaseH2SLinks(host, sw);
                            this.increaseS2SLinks(nodeFrom, nodeTo);
                        } else { // ... to host
                            this.decreaseH2SLinks(host, sw);
                            this.increaseH2SLinks(nodeTo, nodeFrom);
                        }
                    }
                }
            },

            /**
             * This helper function is used in editLink(edgeData) to update the switch-to-switch matrix in the bash
             * script: when a link was redirected to a new switch (nodeTo) - update (increase) the number of links
             * between these two switches (nodeFrom and nodeTo).
             */
            increaseS2SLinks(nodeFrom, nodeTo) {
                let ovs = Math.max(nodeFrom.index, nodeTo.index);
                let link = Math.min(nodeFrom.index, nodeTo.index);

                this.s2s_matrix[ovs][link]++;
                let val = this.s2s_matrix[ovs];
                this.$set(this.s2s_matrix, ovs, val);
            },

            /**
             * Update the switch-to-switch matrix in the bash script (decrease the # of links between switches nodeOne
             * and nodeTwo).
             */
            decreaseS2SLinks(nodeOne, nodeTwo) {
                let ovs = Math.max(nodeOne.index, nodeTwo.index);
                let link = Math.min(nodeOne.index, nodeTwo.index);

                this.s2s_matrix[ovs][link]--;
                let val = this.s2s_matrix[ovs];
                this.$set(this.s2s_matrix, ovs, val);
            },

            /**
             * Update the host-to-switch matrix in the bash script (increase the # of links between host and switch).
             */
            increaseH2SLinks(host, sw) {
                this.h2s_matrix[host.index][sw.index]++;
                let val = this.h2s_matrix[host.index];
                this.$set(this.h2s_matrix, host.index, val);
            },

            /**
             * Update the host-to-switch matrix in the bash script (decrease the # of links between host and switch).
             */
            decreaseH2SLinks(host, sw) {
                this.h2s_matrix[host.index][sw.index]--;
                let val = this.h2s_matrix[host.index];
                this.$set(this.h2s_matrix, host.index, val);
            },

            /**
             * Delete selected link(s).
             */
            deleteLink(deleteData) {
                // iterate through all edgeIds passed in the deleteData
                for (let i = 0; i < deleteData.edges.length; i++) {
                    let edgeId = deleteData.edges[i];
                    let relatedNodes = _network.getConnectedNodes(edgeId); // get the nodeIds connected to this link
                    let nodeOne, nodeTwo, ovs, link, val;

                    // I'm doing this check because if one related node has id=0, then Vis
                    // [_network.getConnectedNodes(edgeId)] returns only the id of the other node:
                    if (relatedNodes.length == 1) {
                        nodeOne = _nodes.get(0);
                        nodeTwo = _nodes.get(relatedNodes[0]);
                    } else {
                        nodeOne = _nodes.get(relatedNodes[0]);
                        nodeTwo = _nodes.get(relatedNodes[1]);
                    }

                    if (nodeOne.group == "switch" && nodeTwo.group == "switch") {
                        ovs = Math.max(nodeOne.index, nodeTwo.index);
                        link = Math.min(nodeOne.index, nodeTwo.index);

                        this.s2s_matrix[ovs][link]--;

                        val = this.s2s_matrix[ovs];
                        this.$set(this.s2s_matrix, ovs, val);
                    } else {
                        let host = _.find([nodeOne, nodeTwo], {group: 'host'});
                        let sw = _.find([nodeOne, nodeTwo], {group: 'switch'});

                        this.h2s_matrix[host.index][sw.index]--;

                        val = this.h2s_matrix[host.index];
                        this.$set(this.h2s_matrix, host.index, val);
                    }
                }
            },

            /**
             * Download generated bash script - save it as ovs-mesh.sh.
             */
            downloadBash() {
                saveAs(new Blob([document.getElementById('bash-script').innerHTML.replace("&gt;", ">")], {type: "text/html;charset=utf-8"}), "ovs-mesh.sh");
            },

            /**
             * Add table row & column highlighting on hover.
             */
            setupTableHoverEffect() {
                $(function () {
                    $('.table td').mouseover(function () {
                        $(this).siblings().css('background-color', '#ECF3F8');
                        var ind = $(this).index();
                        $('td:nth-child(' + (ind + 1) + ')').css('background-color', '#ECF3F8');
                        $('th:nth-child(' + (ind + 1) + ')').css('background-color', '#ECF3F8');
                    });
                    $('.table td').mouseleave(function () {
                        $(this).siblings().css('background-color', '');
                        var ind = $(this).index();
                        $('td:nth-child(' + (ind + 1) + ')').css('background-color', '');
                        $('th:nth-child(' + (ind + 1) + ')').css('background-color', '');
                    });
                })
            },

            /**
             * Export table (Tabular Display) to CSV.
             * Credit goes to Terry Young: http://stackoverflow.com/a/16203218/4437206
             */
            exportTableToCSV(e) {
                let args = [$('#tabela'), 'ovs-mesh.csv'];

                exportTableToCSV.apply(e.target, args);

                function exportTableToCSV($table, filename) {
                    let $rows = $table.find('tr:has(td),tr:has(th)'),

                    // Temporary delimiter characters unlikely to be typed by keyboard
                    // This is to avoid accidentally splitting the actual contents
                    tmpColDelim = String.fromCharCode(11), // vertical tab character
                    tmpRowDelim = String.fromCharCode(0), // null character

                    // actual delimiter characters for CSV format
                    colDelim = '","',
                    rowDelim = '"\r\n"',

                    // Grab text from table into CSV formatted string
                    csv = '"' + $rows.map(function(i, row) {
                        let $row = $(row), $cols = $row.find('td,th');

                        return $cols.map(function(j, col) {
                            let $col = $(col), text = $col.text();
                            return text.replace(/"/g, '""'); // escape double quotes
                        }).get().join(tmpColDelim);
                    }).get().join(tmpRowDelim)
                        .split(tmpRowDelim).join(rowDelim)
                        .split(tmpColDelim).join(colDelim) + '"';

                    // Deliberate 'false', see comment below
                    if (false && window.navigator.msSaveBlob) {
                        let blob = new Blob([decodeURIComponent(csv)], {
                            type: 'text/csv;charset=utf8'
                        });

                        // Crashes in IE 10, IE 11 and Microsoft Edge
                        // See MS Edge Issue #10396033
                        // Hence, the deliberate 'false'
                        // This is here just for completeness
                        // Remove the 'false' at your own risk
                        window.navigator.msSaveBlob(blob, filename);
                    } else if (window.Blob && window.URL) {
                        // HTML5 Blob
                        let blob = new Blob([csv], {
                            type: 'text/csv;charset=utf-8'
                        });
                        let csvUrl = URL.createObjectURL(blob);

                        $(this).attr({
                            'download': filename,
                            'href': csvUrl
                        });
                    } else {
                        // Data URI
                        let csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                        $(this).attr({
                            'download': filename,
                            'href': csvData,
                            'target': '_blank'
                        });
                    }
                }
            },

            /**
             * Export project to a JSON file.
             */
            exportProject() {
                let project = {};

                project['default_controller'] = this.default_controller;
                project['default_listen'] = this.default_listen;
                project['default_ofv'] = this.default_ofv;

                project['s2s_matrix'] = this.s2s_matrix;
                project['h2s_matrix'] = this.h2s_matrix;

                project['controllers'] = this.controllers;
                project['listens'] = this.listens;
                project['ofvs'] = this.ofvs;

                project['vis_defaultConfiguration'] = _defaultConfiguration;

                _network.storePositions();

                project['vis_nodes'] = _nodes.get();
                project['vis_edges'] = _edges.get();

                saveAs(new Blob([JSON.stringify(project)], {type: "text/plain;charset=utf-8"}), "ovs-mesh.json");
            },

            /**
             * Import (read) JSON project.
             */
            importProject(e) {
                var json_obj = null;
                let reader = new FileReader();

                if (e.target && e.target.files[0]) {
                    reader.onload = (evt) => {
                        try {
                            json_obj = JSON.parse(evt.target.result);
                            this.loadProject(json_obj);
                        } catch (ex) {
                            alert('Error: ' + ex);
                        }
                    };

                    reader.readAsText(e.target.files[0]);
                }
            },

            /**
             * Load (setup) imported JSON project.
             */
            loadProject(json_obj) {
                // Set the default controller, listen and ofv:
                this.default_controller = json_obj.default_controller;
                this.default_listen = json_obj.default_listen;
                this.default_ofv = json_obj.default_ofv;

                // Set s2s and h2s matrices (which are actually arrays):
                this.s2s_matrix = json_obj.s2s_matrix;
                this.h2s_matrix = json_obj.h2s_matrix;

                // Set the controllers, listens ofvs arrays:
                this.controllers = json_obj.controllers;
                this.listens = json_obj.listens;
                this.ofvs = json_obj.ofvs;

                // Set the _defaultConfiguration (see main.js) and emit the 'load-defaults' event to update the values...
                _defaultConfiguration = json_obj.vis_defaultConfiguration;
                eventHub.$emit('load-defaults'); // ... in inputs for the default configuration (see DefaultConfiguration.vue).

                // Set the _nodes and _edges (see main.js):
                _nodes.clear();
                _edges.clear();

                _nodes.add(json_obj.vis_nodes);
                _edges.add(json_obj.vis_edges);

                // Add table row & column highlighting on hover.
                this.setupTableHoverEffect();
            }
        }, // methods

        mounted() {
            // Setup clipboard.js
            new clipboard('.clipboard-btn');

            // Add table row & column highlighting on hover.
            this.setupTableHoverEffect();
        }
    }
</script>

<style>
    /* TABS */
    .tab-content {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 10px;
        background-color: #ffffff;
    }

    .nav-tabs {
        margin-bottom: 0;
        background-color: #ffffff;
    }

    .bordered {
        border: 1px solid #ddd;
    }

    .nav-tabs > li > a {
        border-radius: 0;
        color: #333;
    }

    .nav-tabs.bordered > :first-child a {
        border-left-width: 0 !important;
    }

    .nav-tabs > li.active > a {
        -webkit-box-shadow: 0 -2px 0 #57889c;
        -moz-box-shadow: 0 -2px 0 #57889c;
        box-shadow: 0 -2px 0 #57889c;
        border-top-width: 0 !important;
        margin-top: 1px !important;
        font-weight: 700;
    }


    /* BASH SCRIPT */
    code, pre {
        font-family: Consolas, Monaco, 'Andale Mono', 'Lucida Console', monospace;

        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
        -webkit-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
        color: #333;
    }

    pre {
        background: #FAFAFA;
        border-radius: 2px;
        border: 0;
        border-left: 4px solid #ddd;
        color: #333;
        /*text-shadow: 0 1px #fff;*/

        padding: 1em;
        margin: .5em 0;
        overflow: auto;

        font-size: 13px;

        height: 33em;

        resize: vertical;

        -ms-word-wrap: normal;
        word-wrap: normal;
        overflow-wrap: normal;
        white-space: pre;
    }

    #bash-buttons {
        margin-top: 30px;
        margin-bottom: 30px;
    }


    /* TABLE */
    .table {
        width: auto;
    }

    .table td:hover {
        font-weight: bold;
        color: #130C07;
        font-size: 14px;
    }

    .table:hover {
        cursor: pointer;
    }

    .table thead tr {
        background-color: #eee;
        background-image: -webkit-gradient(linear,0 0,0 100%,from(#f2f2f2),to(#fafafa));
        background-image: -webkit-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
        background-image: -moz-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
        background-image: -ms-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
        background-image: -o-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
    }

    .tr-head {
        background-color: #F9F9F9;
    }
</style>
