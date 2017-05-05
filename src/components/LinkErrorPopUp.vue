<template>
    <div id="add-link-error" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header my-blue-bg">
                    <button type="button" class="close my-white-font" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title my-white-font" id="operation">Add Link - Error</h4>
                </div>

                <div class="modal-body">
                    <ul>
                        <li><h4>You cannot connect node (switch or host) to itself;</h4></li>
                        <li><h4>Hosts cannot connect to other hosts.</h4></li>
                    </ul>
                </div>

                <div class="modal-footer">
                    <button type="button" data-dismiss="modal" id="cancelButton" class="btn btn-default">
                        &nbsp;
                        &nbsp;
                        OK
                        &nbsp;
                        &nbsp;
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>