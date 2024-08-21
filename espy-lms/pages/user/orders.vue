<script lang="ts" setup>
definePageMeta({
    layout: "userpage"
})
import { storeToRefs } from 'pinia';
import { useAuthStore } from "~/store/auth"
const { authenticated } = useAuthStore();

import { useOrdersStore } from "~/store/orders";
const { getOrders } = useOrdersStore();
const { orders } = storeToRefs(useOrdersStore());
await getOrders();

</script>
<template>
    <button @click.prevent="getOrders()" type="button" class="w-44 py-3 px-4 my-3 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-grey-400 bg-zinc-400 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-basic-modal">
        Обновить
    </button>
    <div v-if="orders" class="flex flex-col py-4 px-7">
        <div v-for="order in orders" :key="order.id" class="w-full flex flex-col">
            <h4>Заказ №{{ order.number }}</h4>
            <p>{{ JSON.parse(order.path_hubs)[0] }} - {{ JSON.parse(order.path_hubs)[JSON.parse(order.path_hubs).length - 1] }}</p>
            <p>Status: {{ order.status }}</p>
        </div>
    </div>
</template>