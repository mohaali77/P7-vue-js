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
body {
    height: 100%;
}

#container {
    width: 100%;
    display: flex;
    justify-content: center;
    background: #FFD7D7;

    #post {
        background: #4E5166;
        border: transparent solid 1px;
        border-radius: 10px;
        margin: 116px 0px 115px 0px;
        width: 53%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 5px;

        #post_title {
            font-size: 16px;
            color: #FFD7D7;
            margin: 10px;
        }

        form {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;

            #post_content_image {

                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;

                #text {
                    width: 80%
                }

                img {
                    object-fit: contain;
                    height: 75px;
                    border-radius: 10px;

                    &.imgDisplayNone {
                        display: none;
                    }
                }

                #post_errorMsg {
                    font-size: 12px;
                    font-weight: bold;
                    color: #ff3333;
                    margin-bottom: 5px;
                }
            }



            #post_button {
                display: flex;
                width: 100%;
                flex-wrap: wrap;
                justify-content: space-around;
                margin: 5px;

                #post_button_cross {
                    display: flex;

                    #crossDelete {
                        color: #ff3333;
                        font-size: 100%;
                        vertical-align: middle;
                        margin-top: 7px;
                        margin-left: 3px;
                        font-size: 20px;

                        &:hover {
                            transform: scale(1.15);
                            cursor: pointer;
                        }
                    }
                }

                input[type="submit"] {

                    background: #FFD7D7;
                    color: #4E5166;
                    border: solid;
                    border-radius: 10px;
                    padding: 5px 20px 5px 20px;
                    font-size: 13px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;

                    &:hover {

                        transform: scale(1.05);
                        cursor: pointer;
                    }
                }

                input[type="button"] {

                    background: #df2828;
                    color: #fff;
                    border: solid #4E5166;
                    border-radius: 10px;
                    padding: 5px 20px 5px 20px;
                    font-size: 13px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;

                    &:hover {

                        transform: scale(1.05);
                        cursor: pointer;
                    }
                }

                input[type="file"] {
                    display: none;
                }

                label {
                    background: #FFD7D7;
                    color: #4E5166;
                    border: solid;
                    border-radius: 10px;
                    padding: 5px;
                    font-size: 13px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;


                    i {
                        margin-right: 5px;
                    }

                    &:hover {
                        cursor: pointer;
                        transform: scale(1.05);
                    }
                }
            }

            #text {
                width: 95%;
                border: transparent solid 1px;
                border-radius: 10px;
                margin: 5px;
                padding: 3px 3px 0px 3px;
                resize: none;
                font-family: Lato;
                height: 70px;

                &::placeholder {
                    font-family: Lato;
                }
            }
        }
    }

    @media screen and (max-width: 700px) {
        #post {
            width: 90%;
            margin: 129px 0px 129px 0px;

            form {

                img {
                    padding: 0px;
                }

                #post_button {

                    label {
                        font-size: 12px;
                    }

                    input[type="submit"] {

                        padding: 5px 10px 5px 10px;
                        font-size: 12px;

                    }

                    input[type="button"] {

                        padding: 5px 10px 5px 10px;
                        font-size: 12px;
                    }
                }
            }
        }

    }
}
</style>