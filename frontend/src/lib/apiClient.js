import axios from "axios";

export const apiClient =axios.create({
    baseURL:"https://amplify-seven.vercel.app/",
});

