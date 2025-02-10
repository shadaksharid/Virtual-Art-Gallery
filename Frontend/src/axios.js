import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const uploadArtwork = (formData) => {
  return API.post("/artworks/upload", formData, {
    headers : {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default API;
