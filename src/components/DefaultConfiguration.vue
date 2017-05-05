<template>
    <div class="row">
        <div class="col-md-4">
            <div class="input-group">
                <span class="input-group-addon">Default Controller</span>
                <input type="text" class="form-control" name="default_controller" id="default_controller" placeholder="e.g. tcp:127.0.0.1:6633"
                       :value="default_controller" @change="changeDefaultController"
                       data-container="body" data-toggle="popover" data-placement="bottom" data-trigger="focus"
                       data-content="In order for new value to take effect, change the focus or press Enter."
                >
            </div>
        </div>

        <div class="col-md-4">
            <div class="input-group">
                <span class="input-group-addon">Default Listen</span>
                <input type="text" class="form-control" name="default_listen" id="default_listen" placeholder="e.g. ptcp:6634"
                       :value="default_listen" @change="changeDefaultListen"
                       data-container="body" data-toggle="popover" data-placement="bottom" data-trigger="focus"
                       data-content="In order for new value to take effect, change the focus or press Enter."
                >
            </div>
        </div>

        <div class="col-md-4">
            <div class="input-group">
                <span class="input-group-addon">Default OFv</span>
                <input type="text" class="form-control" name="default_ofv" id="default_ofv" placeholder="e.g. OpenFlow13"
                       :value="default_ofv" @change="changeDefaultOfv"
                       data-container="body" data-toggle="popover" data-placement="bottom" data-trigger="focus"
                       data-content="In order for new value to take effect, change the focus or press Enter."
                >
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                default_controller: 'tcp:127.0.0.1:6633',
                default_listen: 'ptcp:6634',
                default_ofv: 'OpenFlow13'
            }
        },

        created() {
            eventHub.$on('load-defaults', this.loadDefaults); // this will happen when a project is imported...
        },

        beforeDestroy() {
            eventHub.$off('load-defaults', this.loadDefaults);
        },

        methods: {
            /**
             * Change the controller for all _nodes that have are using the default one.
             * The default controller is specified in the input, so when a user changes it - this method will apply the
             * newly entered value to all nodes that have the same controller as _defaultConfiguration.controller (see
             * main.js) - which means that it will apply the new default controller to only those nodes that already
             * use (have) the default controller.
             * After that, update _defaultConfiguration.controller to that new value, and finally emit the event in
             * order to update the controllers array in OvsMesh.vue.
             *
             * @param e
             */
            changeDefaultController(e) {
                var newDefaultController = e.target.value.trim();
                var nodeIds = _nodes.getIds();

                nodeIds.forEach(function(currentValue) {
                    if (_nodes.get(currentValue).controller == _defaultConfiguration.controller) {
                        var nodeToUpdate = _nodes.get(currentValue);
                        nodeToUpdate.controller = newDefaultController;
                        _nodes.update(nodeToUpdate);
                    }
                });

                _defaultConfiguration.controller = newDefaultController;

                eventHub.$emit('change-default-controller', newDefaultController);
            },

            /**
             * See the comments (description) for the changeDefaultController(e) method. The same logic applies here.
             *
             * @param e
             */
            changeDefaultListen(e) {
                var newDefaultListen = e.target.value.trim();
                var nodeIds = _nodes.getIds();

                nodeIds.forEach(function(currentValue) {
                    if (_nodes.get(currentValue).listen == _defaultConfiguration.listen) {
                        var nodeToUpdate = _nodes.get(currentValue);
                        nodeToUpdate.listen = newDefaultListen;
                        _nodes.update(nodeToUpdate);
                    }
                });

                _defaultConfiguration.listen = newDefaultListen;

                eventHub.$emit('change-default-listen', newDefaultListen);
            },

            /**
             * See the comments (description) for the changeDefaultController(e) method. The same logic applies here.
             *
             * @param e
             */
            changeDefaultOfv(e) {
                var newDefaultOfv = e.target.value.trim();
                var nodeIds = _nodes.getIds();

                nodeIds.forEach(function(currentValue) {
                    if (_nodes.get(currentValue).ofv == _defaultConfiguration.ofv) {
                        var nodeToUpdate = _nodes.get(currentValue);
                        nodeToUpdate.ofv = newDefaultOfv;
                        _nodes.update(nodeToUpdate);
                    }
                });

                _defaultConfiguration.ofv = newDefaultOfv;

                eventHub.$emit('change-default-ofv', newDefaultOfv);
            },

            /**
             * When a JSON project is imported, set the values of input fields for Default controller, Listen and OFv.
             * See loadProject(json_obj) method in OvsMesh.vue.
             *
             */
            loadDefaults() {
                this.default_controller = _defaultConfiguration.controller;
                this.default_listen = _defaultConfiguration.listen;
                this.default_ofv = _defaultConfiguration.ofv;
            }
        },

        mounted() {
            // Apply Bootstrap Popovers to the input fields
            $(function () {
                $('[data-toggle="popover"]').popover()
            })
        }
    }
</script>