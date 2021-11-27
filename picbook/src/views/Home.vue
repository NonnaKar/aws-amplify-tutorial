<template>
  <div class="home">
    <Login />
  </div>
</template>

<script>
import Login from "@/components/Login";
// @ is an alias to /src

export default {
  name: "Home",
  authState: "signedin",
  components: { Login },
};
</script>
