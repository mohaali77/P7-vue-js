<template>
    <HeaderView />
    <div id="container">

        <div id='post'>
            <h1 id="post_title">Modifier votre publication</h1>
            <form @submit.prevent="sendEdit">
                <div id="post_content_image">
                    <textarea v-model='content' id="text"></textarea>
                    <div v-if="errorMsg" id="post_errorMsg">Vous devez insérer du texte et/ou une image !</div>
                    <img v-if="imageUrlDom" :src='post.imageUrl' alt="">
                </div>
                <div id="post_button">
                    <div id="post_button_cross">
                        <input type='file' id="file" accept="image/*" @change=" uploadImage($event)">
                        <label for="file"><i class="fa-solid fa-image"></i>
                            Changer/Ajouter image
                        </label>
                        <i v-if="image" id="crossDelete" @click='image = null' class="fa-solid fa-xmark"></i>
                    </div>
                    <input type="submit" value="Modifier ">

                    <input v-if="visibleCancelButton" @click="cancelButton" type="button" value="Annuler ">
                    <input @click.prevent="deleteImagePost" v-if="deleteImageButton" type='button'
                        value="Supprimer l'image ">
                </div>
            </form>
        </div>
    </div>
    <FooterView />
</template>

<script>
//on importe axios, ainsi que les composant que l'on va utiliser
import axios from 'axios'
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '@/components/FooterView.vue';

export default {
    name: "AllPostView",
    data() {
        return {
            post: {
                imageURL: ''
            },
            content: '',
            errorMsg: false,
            user: {
                userId: ''
            },
            id: null,
            image: null,
            imageUrlDom: false,
            visibleCancelButton: true
        };
    },
    components: { HeaderView, FooterView },

    async created() {

        //on initialise la variable id comme étant l'id du produit en modification qui est en paramètre de l'URL.
        this.id = this.$route.params.id

        //Avec cette requête, on récupère les informations de l'utilisateur
        await axios.get("auth/user", {
            headers: {
                token: localStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response);
            this.user = response.data
        })
            .catch((error) => {
                console.log(error);
            });


        //Avec cette requête, on récupère uniquement les informations du post en modification
        await axios.get('posts/' + this.id, {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then((response) => {
            console.log(response);
            this.post = response.data
        })
            .catch((error) => {
                console.log(error);
            });


        //Si il y a bien une image dans le post, on affiche l'image et un bouton qui permettra d'effacer l'image.
        //Si il n'y a pas d'image, on masque la balise d'image ainsi que le bouton.
        if (this.post.imageUrl) {
            this.deleteImageButton = true
            this.imageUrlDom = true
        } else {
            this.deleteImageButton = false
            this.imageUrlDom = false
        }

        //cette ligne permettra d'afficher le message du post directement dans l'input 
        this.content = this.post.content

        //si l'utilisateur se retrouve sur la page de modification d'un post qui ne lui appartient pas il sera 
        //redirigé vers la page d'accueil
        if (this.user.userId != this.post.userId && !this.user.isAdmin) {
            this.$router.push('/accueil')
        }

    },

    methods: {

        async deleteImagePost() {

            await axios.delete(`posts/image/${this.id}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }

            }).then((response) => {
                //en cas de succès, on masque du DOM les boutons 'supprimer image', 'annuler', ainsi que l'image
                this.imageUrlDom = false
                this.deleteImageButton = false
                this.visibleCancelButton = false
                console.log(response);

            })
                .catch((error) => {
                    console.log(error);
                });
        },

        //Cette fonction va permettre à l'utilisateur de modifier sa publication
        async sendEdit() {

            //on crée une variable date qui nous permettra d'afficher les éléments de la date souhaité,
            //mais aussi pour pouvoir afficher les posts du plus récents au plus anciens.
            const date = new Date()

            //Si un utilisateur n'inscrit rien dans le champs pour le texte, un message d'erreur d'affiche
            //Dans le cas contraire, la modification est bien effectué 
            if (!this.content) {
                this.errorMsg = true
            } else {
                this.errorMsg = false

                //on crée un objet post qui sera envoyé dans la requête "put"
                let post = {

                    'userId': this.user.userId,
                    'lastName': this.user.lastName,
                    'firstName': this.user.firstName,
                    'content': this.content,
                    'dateStr': date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes(),
                    'date': date,

                }

                //comme on joint une image dans notre requete, on doit utilisé la methode formdata qui permettra d'envoyer
                //l'image et l'objet post
                const formData = new FormData();
                formData.append("image", this.image);
                formData.append("post", JSON.stringify(post));

                await axios.put('posts/' + this.id, formData, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token'),

                    }
                }).then((response) => {
                    //on est ensuite directement redirigé vers la page d'accueil
                    console.log(response);
                    this.$router.push('/accueil')
                })
                    .catch((error) => {
                        console.log(error);
                    });

            }
        },

        //fonction qui permet lors du clic sur le bouton d'annulation d'être redirigé vers la page d'accueil
        cancelButton() {
            this.$router.push('/accueil')
        },

        //on recupere l'image qui a été téléchargé par l'input et on l'attribut à la variable image
        uploadImage(event) {
            this.image = event.target.files[0]
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/ModifierView.scss';
</style>