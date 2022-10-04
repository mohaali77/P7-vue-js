import axios from 'axios';

//ici on définit la base de l'url de chacune de nos requête pour éviter de l'écrire à chaque requête
axios.defaults.baseURL = 'http://localhost:3000/api/';