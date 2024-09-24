import axios from "axios";

export const apiClient =axios.create({
    baseURL:"https://amplify-4.onrender.com",
     withCredentials: true,
});

