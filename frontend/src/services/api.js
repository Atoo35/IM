import axios from 'axios'
const api = axios.create({
    baseURL:'http://<YOUR_IP>:8000'
})

export default api
