<template>
    <div>popup</div>
</template>
<script>
    export default {
        data: () => ({}),
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            tab() {
                chrome.tabs.create({url: 'pages/app.html'});
            }
        }
    }
</script>
<style lang="scss">
    div {
        color: blue
    }
</style>