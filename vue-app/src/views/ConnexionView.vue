<template>

    <main>
        <div id='logo'>
            <img src="../assets/images/groupomania.png" alt="Logo de groupomania" />
            <div id='logo_sentence'>Avec Groupomania, partagez et restez en contact avec vos collègues !</div>
        </div>
        <div id="signUp_signIn">
            <div id="signIn">
                <form @submit.prevent="handleSubmit">
                    <div v-if="successSignup" id='signIn_successSignUp'>Votre compte à bien été créer !</div>
                    <div id='signIn_title'>Connectez-vous</div>
                    <input id="email" type='email' v-model="email" placeholder='Adresse Mail'><br />
                    <input type='password' v-model='password' placeholder='Mot de passe'><br />
                    <p v-if='loginError' class='signIn_errorPassword'>Votre mot de passe et/ou votre email n'est pas
                        valide</p>
                    <p v-if='otherError' class='signIn_errorPassword'>Veuillez réessayer plus tard</p>
                    <input type='submit' value='Se connecter' id="signIn_button">
                </form>
            </div>
            <div id="signUp_signIn_or">
                <hr />
                <p>Vous n'avez pas de compte ? <router-link to="/inscription">Inscrivez-vous</router-link>
                </p>
            </div>
        </div>

    </main>
    <div id="background_photo"><img src="../assets/images/collegues.jpg"></div>

</template>


<script>

import axios from 'axios'

export default {
    name: 'ConnexionView',
    async created() {
        if (localStorage.getItem('token')) {
            this.$router.push("/accueil")
        }

        if (this.$route.params.newUser) {
            this.successSignup = true
        }

    },
    data() {
        return {
            email: '',
            password: '',
            loginError: false,
            otherError: false,
            successSignup: false,

        }
    },
    methods: {
        async handleSubmit(e) {
            e.preventDefault()

            this.loginError = false
            this.otherError = false


            await axios.post('auth/login ', {

                email: this.email,
                password: this.password,


            }).then((response) => {
                console.log(response);
                this.$router.push('/accueil')
                localStorage.setItem("token", response.data.token)
            })
                .catch((reason) => {

                    if (reason.response.status === 401) {
                        this.loginError = true
                    } else {
                        this.otherError = true
                    }
                    console.log(reason.message)
                });

        }
    },

    Error() {

    }
}


</script>

<style scoped>
@import '../assets/css/signIn.css';
</style>

