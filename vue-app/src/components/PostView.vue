<template>

    <div id="container">
        <div id='post'>
            <div id="post_title">Créer une nouvelle publication</div>
            <form @submit.prevent="sendPost">
                <textarea v-model='content' id="text"
                    :placeholder="'Quoi de neuf ' + [ user.firstName ] + ' ?'"></textarea>
                <div v-if="errorMsg" id="post_errorMsg">Vous devez insérer du texte !</div>
                <div id="post_button">
                    <div id="post_button_cross">
                        <label for="file"><i class="fa-solid fa-image"></i>
                            Ajouter une image
                        </label>
                        <input type='file' id="file" accept="image/*" @change=" uploadImage($event)">

                        <i v-if="image" id="crossDelete" @click='image = null' class="fa-solid fa-xmark"></i>
                    </div>
                    <input type="submit" value="Publier ">
                </div>
            </form>
        </div>
    </div>

</template>

<script>

//on importe axios
import axios from "axios";
export default {
    name: 'PostView',
    data() {
        return {
            user: {
                firstName: ''
            },
            content: '',
            errorMsg: false,
            image: null
        }
    },
    //Avec cette requête, on récupère les informations de l'utilisateur
    async created() {
        await axios.get('auth/user', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((response) => {
            console.log(response);
            this.user = response.data
        })
            .catch((error) => {
                console.log(error);
            })
    },

    methods: {

        //Cette fonction va permettre à l'utilisateur de créer une nouvelle publication

        async sendPost() {

            //on crée une variable date qui nous permettra d'afficher les éléments de la date souhaité,
            //mais aussi pour pouvoir afficher les posts du plus récents au plus anciens.
            const date = new Date()

            //Si un utilisateur n'inscrit rien dans le champs pour le texte, un message d'erreur d'affiche
            //Dans le cas contraire, la publication est bien envoyé 
            if (!this.content) {
                this.errorMsg = true
            } else {
                this.errorMsg = false

                //on crée un objet post qui sera envoyé dans la requête "post"
                let post = {

                    'userId': this.user.userId,
                    'lastName': this.user.lastName,
                    'firstName': this.user.firstName,
                    'content': this.content,
                    'dateStr': date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes(),
                    'date': date,
                }

                const formData = new FormData();
                formData.append("image", this.image);
                formData.append("post", JSON.stringify(post));

                await axios.post('posts', formData, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token'),
                        //"Content-Type": "multipart/form-data",
                    }
                }).then((response) => {
                    console.log(response);
                    location.reload()
                })
                    .catch((error) => {
                        console.log(error);
                    });

            }
        },

        uploadImage(event) {
            this.image = event.target.files[0]
        }
    }
}
</script>



<style lang='scss' scoped>
@import '../assets/scss/PostView.scss';
</style>