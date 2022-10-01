<template>

    <main>
        <div id='logo'>
            <img src="../assets/images/groupomania.png" alt="Logo de groupomania" />
            <div id='logo_sentence'>Avec Groupomania, partagez et restez en contact avec vos collègues !</div>
        </div>
        <div id="signUp_signIn">
            <div id='signUp'>
                <div id='signUp_title'>Inscrivez-vous</div>
                <form @submit.prevent="handleSubmit">
                    <input type='text' v-model='lastName' placeholder='Nom'><br />
                    <p v-if="lastnameError" id='signUp_errorName'>Votre nom n'est pas valide</p>
                    <input type='text' v-model='firstName' placeholder='Prénom'><br />
                    <p v-if="firstnameError" id='signUp_errorFirstName'>Votre prénom n'est pas valide</p>
                    <input type='email' v-model='email' placeholder='Adresse Mail'><br />
                    <p v-if="emailError" id='signUp_errorMail'>Votre email n'est pas valide</p>
                    <input type='password' v-model='password' placeholder='Mot de passe'><br />
                    <p v-if="passwordError" id='signUp_errorPassword'>Votre mot de passe n'est pas valide</p>
                    <p id="signUp_passWordIndication">Un mot de passe doit contenir au moins : 1 chiffre, 1 majuscule, 1
                        minuscule, 8 caractères.</p>
                    <input type='submit' value="S'inscrire" id="signUp_button">
                </form>

                <div id="signUp_signIn_or">
                    <hr />
                    <p>Vous avez déjà un compte ? <router-link to="/">Connectez-vous</router-link>
                    </p>
                </div>
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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            lastnameError: false,
            firstnameError: false,
            emailError: false,
            passwordError: false

        }
    },

    //si un token valide est présent dans le localStorage on redirige automatiquement l'utilisateur vers l'accueil
    async created() {
        if (localStorage.getItem('token')) {
            this.$router.push("/accueil")
        }
    },

    methods: {
        async handleSubmit() {

            //Nom 
            //Le message d'erreur ne s'affiche pas par défaut
            this.lastnameError = false;
            //on définit ensuite une regex qui va définit les conditions
            let regexLastName = new RegExp(/^[a-zA-Z-\s]+$/);
            //si la valeur de l'input ne respecte pas les conditions de la regex, le message s'affiche
            if (regexLastName.test(this.lastName) == false) {
                this.lastnameError = true
            }

            //Prénom
            this.firstnameError = false;
            let regexfirstname = new RegExp(/^[a-zA-Z-\s]+$/);
            if (regexfirstname.test(this.firstName) == false) {
                this.firstnameError = true
            }

            //Email
            this.emailError = false;
            let regexemail = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
            if (regexemail.test(this.email) == false) {
                this.emailError = true
            }

            //Mot de passe
            this.passwordError = false;
            let regexpassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
            if (regexpassword.test(this.password) == false) {
                this.passwordError = true
            }

            //Si tout les message d'erreur sont inexistant, on envoie les valeurs des inputs avec une requête axios
            if (!this.lastnameError && !this.firstnameError && !this.emailError && !this.passwordError) {

                await axios.post('auth/signup ', {

                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password

                })
                    .then((response) => {
                        console.log(response);
                        //On envoie la variable 'newUser' à la page de connexion qui permettra d'avertir l'utilisateur
                        //que son compte à bien été créer.
                        this.$router.push({ name: 'login', params: { newUser: true } })
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            }
        }
    }
}

</script>

<style scoped>
@import '../assets/css/signUp.css';
</style>

