import { defineStore } from 'pinia';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: []

    }),
    actions: {
        async getOrders() {
            const { data } = await useFetch("http://127.0.0.1:3001/api/userOrders", {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
              });

            if (data.value) {
                this.orders = data.value
            }
        },
        async getAllOrders() {
            const { data } = await useFetch("http://127.0.0.1:3001/api/getAllOrders", {
                method: 'get',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
              });
              console.log(data.value)
            if (data.value) {
                this.orders = data.value
            }
        }
    }

})