<template>
  <div>
    <form
      v-if="!confirmPassword"
      class="flex flex-col items-center"
      @submit.prevent="signUp"
    >
      <div class="flex flex-col user">
        <label class="block text-gray-700 text-sm font-bold-mb-2" for="username"
          >User Name
        </label>
        <input
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            leading-tight
          "
          type="text"
          v-model="username"
          id="username"
        />
      </div>
      <div class="flex flex-col user">
        <label class="block text-gray-700 text-sm font-bold-mb-2" for="password"
          >Password
        </label>
        <input
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            leading-tight
          "
          type="password"
          v-model="password"
          id="password"
        />
      </div>
      <div class="flex flex-col user">
        <label class="block text-gray-700 text-sm font-bold-mb-2" for="email"
          >Email
        </label>
        <input
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            leading-tight
          "
          type="email"
          v-model="email"
          id="email"
        />
      </div>
      <!-- eslint-disable -->
      <button class="btn-blue">Sign Up</button>
    </form>
    <div v-if="error" class="text-red-600">
      {{ error.message }}
    </div>
    <div v-if="confirmPassword" class="w-4/12 m-auto">
      <h3>Enter your code. Please check your email</h3>
      <div class="flex flex-col mt-2">
        <label class="block text-gray-700 text-sm font-bold" for="password">
          code
        </label>
        <input
          class="
            shadow
            appearance-none
            border
            rounded
            px-3
            py-2
            w-full
            text-gray-700
          "
          type="text"
          v-model="code"
        />
        <button class="btn-blue" @click="confirmSignUp">Confirm Code</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    username: "",
    password: "",
    email: "",
    error: "",
    confirmPassword: false,
    code: "",
  }),
  methods: {
    async signUp() {
      if (!this.email || !this.password) {
        return;
      }
      try {
        await this.$store.dispatch("auth/signUp", {
          username: this.username,
          password: this.password,
          email: this.email,
        });
        this.confirmPassword = true;
      } catch (error) {
        console.log(error);
        this.error = error;
      }
    },
    async confirmSignUp() {
      if (!this.username || !this.code) {
        return;
      }
      try {
        await this.$store.dispatch("auth/confirmSignUp", {
          username: this.username,
          code: this.code,
        });
        await this.$store.dispatch("auth/login", {
          username: this.username,
          password: this.password,
        });
        this.$router.push("/albums");
      } catch (error) {
        console.log(error);
        this.error = error;
      }
    },
  },
};
</script>
<style lang=""></style>
