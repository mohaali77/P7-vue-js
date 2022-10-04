<template>

    <div id="container2">
        <div id="allPost">
            <p>Fil d'actualité</p>
            <div v-if='noPostMsg' id="noUserPost">Il n'y a aucune actualité pour le moment.</div>
            <div v-if='noPost'>
                <div id='userPost' v-for="post in posts" :key='post._id'>
                    <div id='userPost_name_date'>
                        <div id='userPost_name'>
                            {{post.lastName}} {{post.firstName}}
                        </div>
                        <div id='userPost_date'>
                            {{post.dateStr}}
                        </div>
                    </div>
                    <div id='userPost_content'>
                        {{post.content}}
                    </div>
                    <div id="divImage">
                        <img :src='post.imageUrl' alt="" />
                    </div>
                    <hr />
                    <div id="userPost_like_usersLike_delete_edit">
                        <div id="userPost_like_userLike">
                            <div @click="likePost(post._id)" id="userPost_like"><i :class="{'coeurRouge' : post.usersLiked
                            .includes(user.userId)}" class="fa-solid fa-heart"></i>
                            </div>
                            <div id=" userPost_usersLike">{{post.likes}}</div>
                        </div>
                        <div id="userPost_delete_edit">
                            <div v-if="canDeleteCanEdit(post.userId)" @click="deletePost(post._id)"
                                id="userPost_delete">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                            <div v-if="canDeleteCanEdit(post.userId)" id="userPost_edit">
                                <!-- lien qui mène à la page de modification avec l'id du post comme paramètre -->
                                <router-link :to="`/edit/${post._id}`"><i class="fa-solid fa-pen-to-square">
                                    </i></router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//on importe axios 
import axios from 'axios'
export default {

    name: 'AllPostView',
    data() {
        return {
            user: null,
            posts: null,
            noPostMsg: true,
            noPost: false,
        }
    },

    async created() {

        //Avec cette requête, on récupère les informations de l'utilisateur
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
            });

        //Avec cette requête, on récupère les informations des posts qui ont été ajouté pour pouvoir ensuite
        //les affichés dans le DOM
        await axios.get('posts', {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res);
            this.posts = res.data
        })
            .catch((error) => {
                console.log(error);
            });

        //gestion du message lorsqu'il n'y a pas de post; 
        //s'il y a aucun post le message s'affiche 
        if (this.posts.length > 0) {
            this.noPostMsg = false
            this.noPost = true
        }

    }, methods: {

        //SUPPRIMER un post

        //la variable id correspond à l'id des posts. La requête axios va donc supprimer uniquement le post avec l'id 
        //sur lequel l'utilisateur aura cliqué.
        async deletePost(id) {

            await axios.delete(`posts/${id}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }

            }).then((response) => {
                location.reload()
                console.log(response);

            })
                .catch((error) => {
                    console.log(error);
                });
        },

        //AJOUTER un like à un post
        async likePost(id) {

            await axios.post(`posts/${id}/like`, {
                userId: this.user.userId,
                like: 1
            }, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then((response) => {

                //on parcours chacun des posts pour récupérer
                this.posts.forEach(element => {
                    console.log(response.data);
                    console.log(response.data.like);
                    //on verifie que le post sur lequel on passe est le bon
                    if (element._id == id) {
                        //on verifie si il y a une reponse, si la reponse est true on ajoute +1 sinon -1
                        response.data.like ? element.likes++ : element.likes--;
                        //si la reponse est 'false' on va supprimer dans le tableau des likes, le usersid de l'utilisateur connecté
                        if (!response.data.like) {
                            element.usersLiked.splice(element.usersLiked.indexOf(this.user.userId), 1)
                        } else {
                            //sinon on l'ajoute
                            element.usersLiked.push(this.user.userId)
                        }
                    }

                });

            })
                .catch((error) => {
                    console.log(error);
                });

        },

        //fonction qui va permettre d'identifier si l'utilisateur connecté est bien celui qui a crée le post,
        //si c'est le cas les icones modifier et supprimer seront affiché pour qu'il puisse agir sur le post,
        canDeleteCanEdit(id) {

            //si le userid de l'utilisateur est le même que l'userid du post ou que l'utilisateur est l'admin, 
            //isValid retourne true et affiche donc les icones.
            let isValid = false

            if (id == this.user.userId || this.user.isAdmin) {
                isValid = true
            }

            return isValid
        }
    }
}

</script>


<style lang='scss' scoped>
@import '../assets/scss/AllPostView.scss';
</style>