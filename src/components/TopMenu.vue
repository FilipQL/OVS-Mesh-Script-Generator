<template>
    <div>
        <!-- Top menu -->
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="javascript:void(0)">OVS-Mesh Script Generator</a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <a href="https://laraget.com/blog/ovs-mesh-script-generator" class="item-help" target="_blank">
                                <i class="fa fa-question-circle fa-fw"></i>
                                Help (Guide)
                            </a>
                        </li>

                        <li>
                            <a href="" class="item-about" id="about" data-toggle="modal" data-target="#about-popup">
                                <i class="fa fa-info-circle fa-fw"></i>
                                About
                            </a>
                        </li>

                        <li>
                            <a href="#" class="item-github" target="_blank">
                                <i class="fa fa-github fa-fw"></i>
                                GitHub
                            </a>
                        </li>
                    </ul>
                </div><!--/.navbar-collapse -->
            </div>
        </nav>
        <!-- / Top menu -->


        <!-- About POPUP -->
        <div id="about-popup" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header my-blue-bg">
                        <button type="button" class="close my-white-font" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title my-white-font">About OVS-Mesh Script Generator</h4>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <p>
                                    OVS-Mesh Script Generator was developed using
                                    <a href="https://vuejs.org" target="_blank">Vue.js</a> framework and
                                    <a href="http://visjs.org" target="_blank">Vis.js</a> visualization library.
                                    More details can be found here:
                                    <a href="https://laraget.com/blog/ovs-mesh-script-generator" target="_blank">https://laraget.com/blog/ovs-mesh-script-generator</a>.
                                </p>

                                <div class="credits text-center ">
                                    <div>
                                        <h4>BASH SCRIPTING</h4>
                                        <a href="https://laraget.com/about-milos" target="_blank">
                                            Milos Zdravkovic
                                        </a>
                                    </div>

                                    <div>
                                        <h4>WEB DEVELOPMENT</h4>
                                        <a href="https://laraget.com/about-me" target="_blank">
                                            Filip Zdravkovic
                                        </a>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" data-dismiss="modal" id="cancelButton" class="btn btn-default">
                            &nbsp;
                            &nbsp;
                            CLOSE
                            &nbsp;
                            &nbsp;
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- / About POPUP -->
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
    .navbar-default {
        background-color: #2a2725;
        border-color: #2a2725;
    }
    .navbar-default .navbar-brand {
        color: #c8c9cb;
    }
    .navbar-default .navbar-brand:hover,
    .navbar-default .navbar-brand:focus {
        color: #ffffff;
    }
    .navbar-default .navbar-text {
        color: #c8c9cb;
    }
    .navbar-default .navbar-nav > li > a {
        color: #c8c9cb;
    }
    .navbar-default .navbar-nav > li > a:hover,
    .navbar-default .navbar-nav > li > a:focus {
        color: #ffffff;
    }

    .navbar-default .navbar-nav > li > a#about:hover,
    .navbar-default .navbar-nav > li > a#about:focus {
        outline: none;
    }

    .navbar-default .navbar-nav > li > .dropdown-menu {
        background-color: #2a2725;
    }
    .navbar-default .navbar-nav > li > .dropdown-menu > li > a {
        color: #c8c9cb;
    }
    .navbar-default .navbar-nav > li > .dropdown-menu > li > a:hover,
    .navbar-default .navbar-nav > li > .dropdown-menu > li > a:focus {
        color: #ffffff;
        background-color: #2a2725;
    }
    .navbar-default .navbar-nav > li > .dropdown-menu > li > .divider {
        background-color: #2a2725;
    }
    .navbar-default .navbar-nav .open .dropdown-menu > .active > a,
    .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,
    .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {
        color: #ffffff;
        background-color: #2a2725;
    }
    .navbar-default .navbar-nav > .active > a,
    .navbar-default .navbar-nav > .active > a:hover,
    .navbar-default .navbar-nav > .active > a:focus {
        color: #ffffff;
        background-color: #2a2725;
    }
    .navbar-default .navbar-nav > .open > a,
    .navbar-default .navbar-nav > .open > a:hover,
    .navbar-default .navbar-nav > .open > a:focus {
        color: #ffffff;
        background-color: #2a2725;
    }
    .navbar-default .navbar-toggle {
        border-color: #2a2725;
    }
    .navbar-default .navbar-toggle:hover,
    .navbar-default .navbar-toggle:focus {
        background-color: #2a2725;
    }
    .navbar-default .navbar-toggle .icon-bar {
        background-color: #c8c9cb;
    }
    .navbar-default .navbar-collapse,
    .navbar-default .navbar-form {
        border-color: #c8c9cb;
    }
    .navbar-default .navbar-link {
        color: #c8c9cb;
    }
    .navbar-default .navbar-link:hover {
        color: #ffffff;
    }

    @media (max-width: 767px) {
        .navbar-default .navbar-nav .open .dropdown-menu > li > a {
            color: #c8c9cb;
        }
        .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,
        .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {
            color: #ffffff;
        }
        .navbar-default .navbar-nav .open .dropdown-menu > .active > a,
        .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,
        .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {
            color: #ffffff;
            background-color: #2a2725;
        }
    }
    
    .credits {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .credits div {
        width: 183px;
    }
</style>