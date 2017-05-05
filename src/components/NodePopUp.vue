<template>
    <div id="network-popUp" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header my-blue-bg">
                    <button type="button" id="close-btn-top" class="close my-white-font" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title my-white-font" id="operation"></h4>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="node-type">Node Type:</label>
                        <select class="form-control" id="node-type" @change="selectNodeType">
                            <option value="switch" selected>Switch</option>
                            <option value="host">Host</option>
                        </select>
                    </div>

                    <div class="form-group" v-show="nodeTypeFlag">
                        <label for="node-controller">Controller:</label>
                        <input type="text" class="form-control" id="node-controller" placeholder="e.g. tcp:127.0.0.1:6633">
                    </div>

                    <div class="form-group" v-show="nodeTypeFlag">
                        <label for="node-listen">Listen:</label>
                        <input type="text" class="form-control" id="node-listen" placeholder="e.g. ptcp:6634">
                    </div>

                    <div class="form-group" v-show="nodeTypeFlag">
                        <label for="node-ofv">OFv:</label>
                        <input type="text" class="form-control" id="node-ofv" placeholder="e.g. OpenFlow13">
                    </div>
                </div>

                <div class="modal-footer">
                    <button id="cancel-button" type="button" data-dismiss="modal" class="btn btn-default">
                        Cancel
                    </button>

                    <button type="button" id="saveButton" class="btn btn-primary my-blue-button">
                        <i class="fa fa-fw fa-check"></i>
                        <span id="saveButton-text"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                nodeTypeFlag: true
            }
        },
        created() {
            eventHub.$on('edit-switch', this.showSwitchProperties);

        },
        beforeDestroy() {
            eventHub.$off('edit-switch', this.showSwitchProperties);
        },
        methods: {
            selectNodeType(event) {
                this.nodeTypeFlag = (event.target.value == "switch")
            },

            showSwitchProperties() {
                this.nodeTypeFlag =  true;
            }
        }
    }
</script>