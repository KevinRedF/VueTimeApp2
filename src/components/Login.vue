<template>
  <div class="container">
    <h1 class="title">Vue Time App</h1>
    <q-input rounded outlined bottom-slots v-model="userInput" label="Username" class="input">
      <template v-slot:prepend>
        <q-icon name="account_circle" />
      </template>
    </q-input>
    <button class="button" @click="signIn">Sign In</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return{
      userInput: ''
    }
  },
  methods: {
    signIn(){
      if(this.userInput.trim() !== ''){
        this.$router.push('/home/'+this.userInput)
      }
    }
  }
}
</script>

<style scoped>
  .container{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content:center;
  }
  .title{
    font-family: 'WTGothic-Bold';
    font-size: 36px;
    line-height: 40px;
    color: #212322;
    width: calc(100vw - 60px);
  }
  .input{
    width: calc(100vw - 60px);
    margin: 0 auto 0 auto;
  }
  .button{
    font-family: 'Roboto';
    font-size: 20px;
    width: calc(100vw - 60px);
    height: 56px;
    border: 1px solid #0A47ED;
    border-radius: 28px;
    background: #0A47ED;
    color: #FFF;
  }
</style>