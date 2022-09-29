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
                    <input type='submit' value="S'inscrire" id="signUp_button">
                </form>

                <div id="signUp_signIn_or">
                    <hr />
                    <p>Vous avez déjà un compte ? <router-link to="/login">Connectez-vous</router-link>
                    </p>
                </div>
            </div>
        </div>
    </main>
    <div id="background_photo"><img src="../assets/images/collegues.jpg"></div>

</template>


<script>

import axios from 'axios'


export default {

    name: 'ConnexionView', async created() {
        if (localStorage.getItem('token')) {
            this.$router.push("/accueil")
        }
    },

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
    methods: {
        async handleSubmit(e) {
            e.preventDefault()

            this.lastnameError = false;
            let regexLastName = new RegExp(/^[a-zA-Z-\s]+$/);
            if (regexLastName.test(this.lastName) == false) {
                this.lastnameError = true
            }

            this.firstnameError = false;
            let regexfirstname = new RegExp(/^[a-zA-Z-\s]+$/);
            if (regexfirstname.test(this.firstName) == false) {
                this.firstnameError = true
            }

            this.emailError = false;
            let regexemail = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
            if (regexemail.test(this.email) == false) {
                this.emailError = true
            }

            /*this.passwordError = false;
            let regexpassword = new RegExp(/^[a-zA-Z-\s]+$/);
            if (regexpassword.test(this.password) == false) {
                this.passwordError = true
            }*/

            if (!this.lastnameError && !this.firstnameError && !this.emailError && !this.passwordError) {

                const response = await axios.post('auth/signup ', {

                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password

                });

                console.log(response)
                this.$router.push({ name: 'login', params: { newUser: true } })
            }
        }
    }
}

</script>

<style scoped>
@import '../assets/css/signUp.css';
</style>

