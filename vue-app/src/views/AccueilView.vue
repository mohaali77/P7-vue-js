<template>
    <HeaderView />
    <PostView />
    <AllPostView />
    <FooterView />

</template>
  
<script>

import HeaderView from "../components/HeaderView.vue";
import PostView from "../components/PostView.vue"
import FooterView from "../components/FooterView.vue"
import AllPostView from "@/components/AllPostView.vue";

export default {
    name: 'AccueilView',
    components: { HeaderView, PostView, FooterView, AllPostView },

}


</script>
  
<style lang="scss" scoped >

</style>