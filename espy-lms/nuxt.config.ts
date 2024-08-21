// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image"],
  plugins: ["~/plugins/preline.client.ts"],
  image: {
    dir: 'assets/img',
},
})