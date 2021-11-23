<template>
  <div class="container">
    <h1 class="title">Vue Time App</h1>
    <!-- <q-input
      rounded
      outlined
      bottom-slots
      v-model="userInput"
      label="Username"
      class="input"
    >
      <template v-slot:prepend>
        <q-icon name="account_circle" />
      </template>
    </q-input> -->

    <div v-if="!$auth.loading.value">
      <button class="button" v-if="!$auth.isAuthenticated.value" @click="login">
        Log in
      </button>
      <button class="button" v-if="$auth.isAuthenticated.value" @click="logout">
        Log out
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userInput: "",
    };
  },
  methods: {
    signIn() {
      if (this.userInput.trim() !== "") {
        this.$router.push("/home/" + this.userInput);
      }
    },
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.title {
  font-family: "WTGothic-Bold";
  font-size: 36px;
  line-height: 40px;
  color: #212322;
  width: calc(100vw - 60px);
}
.input {
  width: calc(100vw - 60px);
  margin: 0 auto 0 auto;
}
.button {
  font-family: "Roboto";
  font-size: 20px;
  width: calc(100vw - 60px);
  height: 56px;
  border: 1px solid #0a47ed;
  border-radius: 28px;
  background: #0a47ed;
  color: #fff;
}
</style>
