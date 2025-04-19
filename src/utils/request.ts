import axios from "axios";

let instance = axios.create({
  baseURL: "http://127.0.0.1:8080/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" }
});