<script lang="ts" setup>
definePageMeta({
    layout: "userpage"
})
import { storeToRefs } from 'pinia';
import { useAuthStore } from "~/store/auth"
const { authenticated } = useAuthStore();


import { useOrdersStore } from "~/store/orders";
const { getAllOrders } = useOrdersStore();
const { orders } = storeToRefs(useOrdersStore());
await getAllOrders();

async function refresh() {
    await getAllOrders();
}

const drivers = ref();
await $fetch("http://127.0.0.1:3001/api/getAllDrivers", {
                                method: 'get',
                                headers: { 'Content-type': 'application/json' },
                                credentials: 'include',
                            }).then((data) => {
                                drivers.value = data
                            })
const aprovedOrder = reactive({
    order: '',
    driver: ''
})

async function approveOrder(order_id) {
    aprovedOrder.order = order_id
    await $fetch("http://127.0.0.1:3001/api/approveOrder", {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
        body: aprovedOrder
    }).then(async (result) => {
        if (result.message == "OK") {
            await getAllOrders();
        }
    })
}

</script>
<template>
    <button @click.prevent="refresh()" type="button" class="w-44 py-3 px-4 my-3 mx-auto inline-flex items-center justify-center gap-x-2 text-sm text-center font-semibold rounded-lg border border-grey-400 bg-zinc-400 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
        Обновить
    </button>
    <div v-if="orders" class="flex flex-col py-4 px-7 gap-4">
        <div v-for="(order, index) in orders" :key="order.id" class="font-manrope w-full p-3 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
            <h4>Заказ №{{ order.number }}</h4>
            <p>{{ JSON.parse(order.path_hubs)[0] }} - {{ JSON.parse(order.path_hubs)[JSON.parse(order.path_hubs).length - 1] }}</p>
            <p>Статус: {{ order.status }}</p>
            
            <div v-if="order.status == 'created'">
                <select v-model="aprovedOrder.driver" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-non">
                        <option disabled value="">Выберите водителя</option>
                        <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                            {{ driver.id }} {{ driver.username }}, {{ driver.phone }}
                        </option>
                    </select>
                    <button @click="approveOrder(order.id)" type="button" class="w-32 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-grey-400 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
                    Подтвердить
                    </button>
            </div>
        </div>
    </div>
</template>