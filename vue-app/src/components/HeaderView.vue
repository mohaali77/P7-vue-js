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
  
<style scoped>
@import "../assets/css/header.css";

@media screen and (max-width: 700px) {

    header {
        height: 100px;
    }

    header #menu {
        justify-content: center;
    }

    header #menu img {
        width: 250px;
        margin-left: 0px;
    }

    header #menu #menu_deconnexion {
        font-size: 16px;
        margin-right: 0px;

    }

    header #menu {
        display: flex;
        list-style-type: none;
        align-items: center;
        padding: 0px;
        font-size: 17px;
        margin: 0px;
        height: 80px;
        flex-direction: column;
    }
}
</style>