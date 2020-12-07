<template>
    <div id="nav">
        <router-link to="/">Index</router-link> |
        <router-link to="/a">A</router-link> |
        <router-link to="/b">B</router-link> |
        <router-link to="/match">Match</router-link>
    </div>
    <router-view/>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
#app {
    color: #2c3e50;
    text-align: center;
}

#nav a {
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
