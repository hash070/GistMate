<template>
  <div class="oauth">
    <h1>OAuth Success</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {infoNotification} from "../utils/util";
const route = useRoute()
const router = useRouter()

//get token from url ('/oauth?token=' + token + '&username=' + userResponse.data.login)
const token = route.query.token;
const username = route.query.username;

//save token to local storage
localStorage.setItem('gistKey', token as string)
localStorage.setItem('username', username as string)

infoNotification('Login Success', 'Welcome ' + username)
//redirect to home page
router.push('/')
</script>

<style scoped>

</style>