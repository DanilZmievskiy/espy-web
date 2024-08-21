import { defineStore } from 'pinia';


interface UserPayloadInterface {
  username: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
    role: null
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      const { data, pending, error }: any = await useFetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        credentials: 'include',
        body: {
          username,
          password,
        }
      });
      this.loading = pending;
    //   console.log(error.value)
      console.log(data.value.role)
      if (data.value) {
        const token = useCookie('jwt', { 
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true
        }); // useCookie new hook in nuxt 3
        sessionStorage.setItem('jwt', data?.value?.token)
        token.value = data?.value?.token; // set token to cookie
        // console.log(token.value)
        this.authenticated = true; // set authenticated  state value to true
        this.role = data?.value?.role
      }
    },
    logUserOut() {
      const token = useCookie('jwt'); // useCookie new hook in nuxt 3
      console.log(token.value)
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});