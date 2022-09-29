<template>

    <div id="container">
        <div id='post'>
            <div id="post_title">Créer une nouvelle publication</div>
            <form @submit.prevent="handleSubmit">
                <textarea v-model='content' id="text" placeholder="Quoi de neuf ?"></textarea>
                <div v-if="errorMsg" id="post_errorMsg">Vous devez insérer du texte et/ou une image !</div>
                <div id="post_button">
                    <input type='file' id="file" accept="image/*" @change=" uploadImage($event)">
                    <i v-if="image" @click='image = null' class="fa-solid fa-xmark"></i>
                    <input type="submit" value="Publier ">
                </div>
            </form>
        </div>
    </div>

</template>

<script>

import axios from "axios";
export default {
    name: 'PostView',
    data() {
        return {
            user: null,
            content: '',
            errorMsg: false,
            image: null
        }
    },
    async created() {
        const response = await axios.get('auth/user', {
            headers: {
                token: localStorage.getItem('token')
            }
        });

        this.user = response.data

    },



    methods: {

        async handleSubmit(e) {
            e.preventDefault()

            if (!this.content) {
                this.errorMsg = true
            } else {
                this.errorMsg = false
            }

            const date = new Date()

            if (!this.errorMsg) {

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

                const res = await axios.post('posts', formData, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token'),
                        "Content-Type": "multipart/form-data",
                    }
                });

                console.log(res);

                location.reload()

            }
        }, uploadImage(event) {
            this.image = event.target.files[0]
        }
    }
}




</script>

<style lang='scss' scoped>
#container {
    width: 100%;
    display: flex;
    justify-content: center;
    background: #FFD7D7;

    #post {
        background: #4E5166;
        border: transparent solid 1px;
        border-radius: 10px;
        margin-top: 30px;
        width: 40%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 5px;

        #post_title {
            font-size: 16px;
            font-weight: bold;
            color: #FFD7D7;
            margin: 10px;

        }

        form {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;

            #post_errorMsg {
                font-size: 12px;
                font-weight: bold;
                color: #ff3333;
                margin-bottom: 5px;
            }

            #post_button {
                display: flex;
                width: 100%;
                height: 33px;
                justify-content: space-around;
                margin: 5px;


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

                    &.imageAjoute {
                        color: green;
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
            width: 70%;
        }
    }
}
</style>