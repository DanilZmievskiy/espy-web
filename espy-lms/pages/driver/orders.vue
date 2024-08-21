<script lang="ts" setup>
definePageMeta({
    layout: "userpage"
})
import { storeToRefs } from 'pinia';
import { useAuthStore } from "~/store/auth"
const { authenticated } = useAuthStore();


const driverOrders = ref();
async function getDriverOrders () {
    await $fetch("http://127.0.0.1:3001/api/getDriverOrders", {
                                method: 'get',
                                headers: { 'Content-type': 'application/json' },
                                credentials: 'include',
                            }).then((data) => {
                                console.log(data)
                                driverOrders.value = data
                            })

}
await getDriverOrders()

async function updateOrder(order_id: number, status: string) {
    await $fetch("http://127.0.0.1:3001/api/updateOrderStatus", {
                                method: 'post',
                                headers: { 'Content-type': 'application/json' },
                                credentials: 'include',
                                body: {
                                    id: order_id,
                                    status: status
                                }
                            }).then(async (data) => {
                                await getDriverOrders()
                            })
}
</script>
<template>
    <button @click.prevent="getDriverOrders()" type="button" class="w-44 py-3 px-4 my-3 mx-auto inline-flex items-center justify-center gap-x-2 text-sm text-center font-semibold rounded-lg border border-grey-400 bg-zinc-400 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
        Обновить
    </button>
    <div v-if="driverOrders" class="flex flex-col py-4 px-7 gap-4">
        <div v-for="(order, index) in driverOrders" :key="order.id" class="font-manrope w-full p-3 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
            <h4>Заказ №{{ order.number }}</h4>
            <p>{{ JSON.parse(order.path_hubs)[0] }} - {{ JSON.parse(order.path_hubs)[JSON.parse(order.path_hubs).length - 1] }}</p>
            <p>Статус: {{ order.status }}</p>
            
            <button v-if="order.status == 'approved' " @click.prevent="updateOrder(order.id, 'working')" type="button" class="w-44 py-3 px-4 mt-3 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-grey-400 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
            Взять в работу
            </button>
            <button v-if="order.status == 'working' " @click.prevent="updateOrder(order.id, 'completed')" type="button" class="w-44 py-3 px-4 mt-3 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-grey-400 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
            Завершить
            </button>
        </div>
    </div>
</template>