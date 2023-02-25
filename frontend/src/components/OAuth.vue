<template>
  <div class="oauth">
    <h1>OAuth Success</h1>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {handleAxiosError, infoNotification, iT, setMenuOptionsFromAxiosResponse, successMsg} from "../utils/util";
import axios from "axios";

const route = useRoute()
const router = useRouter()

//get token from url ('/oauth?token=' + token + '&username=' + userResponse.data.login)
const token = route.query.token;
const username = route.query.username;


//save token to local storage
localStorage.setItem('gistKey', token as string)
localStorage.setItem('username', username as string)

//try to get gist data
//get gist data, add time_stamp to avoid cache
axios.get('/gists' + '?time_stamp=' + new Date().getTime())
    .then((res) => {
      successMsg(iT('login.success'))
      console.log(res)
      // process data (array) and push into store.menuOptions
      setMenuOptionsFromAxiosResponse(res)
      infoNotification('Login Success', 'Welcome ' + username)
    })
    .catch((err) => {
      handleAxiosError(err)
    })
    .finally(() => {
      //redirect to home page
      router.push('/')
    })
</script>

<style scoped>

</style>