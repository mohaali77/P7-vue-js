<template>
    <HeaderView />
    <div id="container">

        <div id='post'>
            <h1 id="post_title">Modifier votre publication</h1>
            <form @submit.prevent="handleSubmit(e)">
                <textarea v-model='content' id="text"></textarea>
                <div v-if="errorMsg" id="post_errorMsg">Vous devez insérer du texte et/ou une image !</div>
                <div id="post_button">
                    <input type='file' id="file" accept="image/*" @change=" uploadImage($event)">
                    <label for="file"><i class="fa-solid fa-image"></i>
                        Changer/Ajouter image
                    </label>
                    <input type="submit" value="Modifier ">
                    <input @click="cancelButton" type="button" value="Annuler ">
                </div>
            </form>
        </div>
    </div>
    <FooterView />
</template>

<script>
import axios from 'axios'
import HeaderView from '@/components/HeaderView.vue';
import FooterView from '@/components/FooterView.vue';

export default {
    name: "AllPostView",
    data() {
        return {
            post: null,
            content: '',
            errorMsg: false,
            user: null,
            id: null,
            image: null
        };
    },
    components: { HeaderView, FooterView },
    async created() {

        this.id = this.$route.params.id

        const response = await axios.get("auth/user", {
            headers: {
                token: localStorage.getItem("token")
            }
        });

        console.log(response);
        this.user = response.data

        const res = await axios.get('posts/' + this.id, {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        });

        console.log(res);
        this.post = res.data
        this.content = this.post.content

    },

    methods: {

        async handleSubmit() {
            const date = new Date()
            //e.preventDefault();

            if (!this.content) {
                this.errorMsg = true
            } else {
                this.errorMsg = false
            }

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

                const res = await axios.put('posts/' + this.id, formData, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token'),
                        "Content-Type": "multipart/form-data",
                    }
                });


                console.log(res);

                this.$router.push('/accueil')

            }
        },

        cancelButton() {
            this.$router.push('/accueil')
        },
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