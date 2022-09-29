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
                    <img :src='post.imageUrl' alt="" />
                    <hr />
                    <div id="userPost_like_usersLike_delete_edit">
                        <div id="userPost_like_userLike">
                            <div @click="likePost(post._id)" id="userPost_like"><i :class="{'coeurRouge' : post.likes}"
                                    class="fa-solid fa-heart"></i>
                            </div>
                            <div @click="likePost(post._id)" id="userPost_usersLike">{{post.likes}}</div>
                        </div>
                        <div id="userPost_delete_edit">
                            <div v-if="noDeleteNoEdit(post.userId)" @click="deletePost(post._id)" id="userPost_delete">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                            <div v-if="noDeleteNoEdit(post.userId)" id="userPost_edit">
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

    //RECUPERER le user et AFFICHER tout les posts
    async created() {
        const response = await axios.get('auth/user', {
            headers: {
                token: localStorage.getItem('token')
            }
        });

        const res = await axios.get('posts', {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        });

        this.user = response.data
        this.posts = res.data

        //gestion message noPost
        if (this.posts.length > 0) {
            this.noPostMsg = false
            this.noPost = true
        }

    }, methods: {

        //SUPPRIMER un post
        async deletePost(id) {

            const res = await axios.delete(`posts/${id}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }

            }).then((response) => {

                console.log(response);

            })
                .catch((error) => {
                    console.log(error);
                });

            location.reload()

            console.log(res);

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

                this.posts.forEach(element => {
                    if (element._id == id) {
                        response.like ? element.likes++ : element.likes--;
                    }
                });

            })
                .catch((error) => {
                    console.log(error);
                });
        },
        goToModify() {
            this.$router.push("/edit")

        },

        noDeleteNoEdit(id) {

            let isValid = false

            if (id == this.user.userId) {
                isValid = true
            }

            return isValid

        }
    }
}

</script>


<style lang='scss' scoped>
#container2 {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: #FFD7D7;

    #allPost {
        background: #4E5166;
        border: transparent solid 1px;
        border-radius: 10px;
        margin-top: 30px;
        width: 70%;
        display: flex;
        flex-direction: column;
        padding: 5px;
        margin-bottom: 27px;

        #noUserPost {
            color: #FFD7D7;
            font-size: 19px;
            text-align: center;
            margin: 20px 0px 50px 0px;
        }

        #userPost {
            margin-left: 10px;
            margin-right: 10px;
            border: solid;
            padding: 10px;
            background: #FFD7D7;
            color: #4E5166;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        #userPost_name_date {
            display: flex;
            margin-bottom: 10px;
            align-items: center;

            #userPost_name {
                margin-right: 5px;
            }

            #userPost_date {
                font-size: 12px;
                margin-top: 3px;

            }
        }

        #userPost_like_usersLike_delete_edit {
            display: flex;
            justify-content: space-between;

            #userPost_like_userLike {
                display: flex;

                #userPost_like {
                    i {
                        margin-right: 5px;

                        &.coeurRouge {
                            transform: scale(1.15);
                            color: #ff3333;
                            cursor: pointer;
                            transition: 0.5;
                        }
                    }
                }
            }

            #userPost_delete_edit {
                display: flex;

                #userPost_delete {
                    i {
                        margin-right: 5px;

                        &:hover {

                            transform: scale(1.15);
                            cursor: pointer;
                        }
                    }
                }

                #userPost_edit {

                    a {
                        text-decoration: none;
                        color: #4E5166;
                    }

                    i {
                        &:hover {

                            transform: scale(1.15);
                            cursor: pointer;
                        }
                    }
                }

            }

        }
    }

    p {
        font-size: 19px;
        color: #FFD7D7;
        width: 100%;
        text-align: center;
    }

    @media screen and (max-width: 700px) {
        #allPost {
            width: 95%;
        }
    }



}
</style>