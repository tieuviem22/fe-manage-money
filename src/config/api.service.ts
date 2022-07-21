import axios from "axios";
import JwtService from "./jwt.service";

const ApiService = {
    init() {
        axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    },
    setHeader() {
        if (JwtService.getToken()) {
            axios.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${JwtService.getToken()}`;
        }
    },

    query(resource: string, params: object) {
        return axios.get(resource, {params: params}).catch((error: any) => {
            throw new Error(`[KT] ApiService ${error}`);
        });
    },
    get(resource: any, slug = "") {
        return axios.get(`${resource}/${slug}`).catch((error: any) => {
            throw new Error( error);
        });
    },

    post(resource: any, params: any) {
        return axios.post(`${resource}`, params);
    },
    getApi(url: string) {
        const token = JwtService.getToken();
        return axios.get(
            process.env.VUE_APP_BASE_URL + url,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
    },
    postApi(url: string, params: any) {
        const token = JwtService.getToken();
        return axios
        .post(
          process.env.VUE_APP_BASE_URL + url,
          params,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
    },
};

export default ApiService;
