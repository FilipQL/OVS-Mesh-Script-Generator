<template>
    <footer class="footer">
        <p>Web development: <a href="https://laraget.com/about-me" class="laraget" target="_blank">Filip Zdravkovic</a> | Bash scripting: <a href="https://laraget.com/about-milos" class="laraget" target="_blank">Milos Zdravkovic</a></p>
        <p>
            <a href="https://laraget.com" class="laraget">Laraget.com</a>
        </p>
    </footer>
</template>

<script>
    export default {

    }
</script>

<style>
    .footer {
        padding: 40px 0;
        color: #c8c9cb;
        text-align: center;
        background-color: #2a2725;
        border-top: 1px solid #CECECE;

        position: absolute;
        bottom: 0;
        width: 100%;
        /* Set the fixed height of the footer here */
        height: 131px;
    }
    .footer p:last-child {
        margin-bottom: 0;
    }

    .laraget {
        color: #92a2a8;
    }

    .laraget:focus {
        color: #92a2a8;
        text-decoration: none;
    }

    .laraget:hover, .laraget:active {
        color: #ffffff;
        text-decoration: none;
    }
</style>