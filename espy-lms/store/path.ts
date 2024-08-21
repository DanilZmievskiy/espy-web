import { defineStore } from 'pinia';

export const usePathStore = defineStore('path', {
    state: () => ({
        hubs_from: [],
        hubs_to: [],

    }),
    actions: {
        async getPaths() {
            const { data } = await useFetch('http://127.0.0.1:3001/api/getPaths', {
                method: 'GET',
                headers: { 'Content-type': 'application/json'},
                credentials: 'include',
              });
            if (data.value) {
                data?.value?.from.forEach((element: any )  => {
                    this.hubs_from.push(element.hub_from)
                });
                data.value.to.forEach((element: any)  => {
                    this.hubs_to.push(element.hub_to)
                });

            }
        }
    }

})