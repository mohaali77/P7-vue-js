<template>
    <header>
        <div id="menu">
            <img src="../assets/images/groupomania-white.svg" id="logo">
            <div id="menu_deconnexion" @click='logOut'>Se déconnecter</div>
        </div>
    </header>
</template>
  
<script>

import axios from 'axios'

export default {
    name: 'HeaderView',
    async created() {

        //Si le token présent dans le localStorage n'existe plus, l'utilisateur est automatiquement 
        //redirigé vers la page de connexion
        if (localStorage.getItem('token') === null) {
            this.$router.push("/login")
        }

        //Avec cette requête, on récupère les informations de l'utilisateur
        const response = axios.get('auth/user', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((response) => {
            console.log(response);
        })
            .catch((error) => {
                console.log(error);
            });

        console.log(response)
    },

    methods: {

        //cette fonction va permettre à l'utlisateur de se déconnecter. 
        // Lors du clic sur le bouton "Se deconnecter" le contenu du localStorage sera supprimé, et donc 
        // l'utilisateur sera automatiquement redirigé vers la page de connexion

        logOut() {
            localStorage.clear();
            this.$router.push("/")
        }
    }
}
</script>
  
<style lang="scss" scoped>
@import "../assets/scss/HeaderView.scss";
</style>