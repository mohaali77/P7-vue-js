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

//on importe axios
import axios from 'axios'

export default {
    name: 'ConnexionView',

    data() {
        return {
            email: '',
            password: '',
            loginError: false,
            otherError: false,
            successSignup: false,

        }
    },

    //si un token valide est présent dans le localStorage on redirige l'utilisateur vers l'accueil
    async created() {
        if (localStorage.getItem('token')) {
            this.$router.push("/accueil")
        }

        //si la variable newUser a bien été envoyé depuis la page d'inscription, on affiche le message indiquant 
        //que le compte de l'utilisateur a bien été crée
        if (this.$route.params.newUser) {
            this.successSignup = true
        }

    },
    methods: {
        async handleSubmit() {

            this.loginError = false
            this.otherError = false

            //on envoie dans la requête post les valeurs des inputs email et mot de passe
            await axios.post('auth/login ', {

                email: this.email,
                password: this.password,

                //Si la requête est bonne, on redirige l'utilisateur vers l'accueil, et 
                //on définit le localStorage avec le token de l'utilisateur
            }).then((response) => {
                console.log(response);
                this.$router.push('/accueil')
                localStorage.setItem("token", response.data.token)
            })  //si la requête n'est pas bonne, on recupère l'erreur, et si le statuts de l'erreur
                //est 401 on afiche un message d'erreur concernant une erreur d'email ou mot de passe
                //sinon on affiche un message d'erreur général
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
}


</script>

<style scoped>
@import '../assets/css/signIn.css';
</style>

