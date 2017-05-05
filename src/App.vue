<template>
    <div>
        <top-menu></top-menu>

        <div class="container">
            <default-configuration></default-configuration> <!-- DefaultConfiguration.vue -->

            <hr>

            <div id="mynetwork"></div> <!-- Vis Network -->


            <node-popup></node-popup> <!-- PopUp with form for adding a new node (switch or host) or editing a switch [see AddNode.vue & main.js] -->
            <link-error-popup></link-error-popup> <!-- PopUp with Error messages -->

            <hr>

            <ovs-mesh></ovs-mesh> <!-- OvsMesh.vue -->
        </div> <!--/.container -->

        <br><br><br><br>
        <foothill></foothill>
    </div>

</template>

<script>
    import vis from 'vis'

    // Components:
    import TopMenu from './components/TopMenu.vue'
    import DefaultConfiguration from './components/DefaultConfiguration.vue'
    import NodePopUp from './components/NodePopUp.vue'
    import LinkErrorPopUp from './components/LinkErrorPopUp.vue'
    import OvsMesh from './components/OvsMesh.vue'
    import Foothill from './components/Foothill.vue'

    export default {
        name: 'app',
        components: {
            'top-menu': TopMenu,
            'default-configuration': DefaultConfiguration,
            'node-popup': NodePopUp,
            'link-error-popup': LinkErrorPopUp,
            'ovs-mesh': OvsMesh,
            'foothill': Foothill
        },
        mounted() {
            var container = document.getElementById('mynetwork');
            _network = new vis.Network(container, _data, _options);

            $('#loading').remove();
        }
    }
</script>

<style>
    @import "../node_modules/vis/dist/vis.css";

    html {
        position: relative;
        min-height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: url(assets/mybg.png) #fff;
        direction: ltr;
        /* Margin bottom by footer height */
        margin-bottom: 131px;
    }

    /* Vis Network */
    #mynetwork {
        width: 100%;
        height: 450px;
        border: 1px solid lightgray;
        background-color: #ffffff;
    }

    .my-blue-bg {
        background-color: #38809e;
    }

    .my-blue-font {
        color: #38809e;
    }

    .my-white-font {
        color: #ffffff;
        opacity: 1;
    }

    .my-blue-button {
        background-color: #38809e;
        border-color: #38809e;
    }

    .my-blue-button:hover, .my-blue-button:focus, .my-blue-button:active {
        background-color: #20495a;
        border-color: #20495a;
        outline: none;
    }

    .my-blue-button:active:focus {
        background-color: #183743;
        border-color: #183743;
        outline: none;
    }

</style>