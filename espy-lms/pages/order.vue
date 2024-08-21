<script lang="ts" setup>
import { usePathStore } from '~/store/path';

const { hubs_from, hubs_to } = usePathStore();
const { getPaths } = usePathStore();
const nuxtApp = useNuxtApp();
await getPaths();

const router = useRouter();

const formStatus = ref({
    priceHidden: true
})

const order = ref({
    from: '',
    to: '',
    price: '1000'
})

const createOrder = async () => {
    await $fetch('http://127.0.0.1:3001/api/createOrder', {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        credentials: 'include',
        body: order.value
    }).then(() => {
        router.push('/')
    })
}
</script>
<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
            <form @submit.prevent="createOrder" class="max-w-lg mx-auto border border-gray-300">
                <label for="from" class="block mb-2 text-sm font-medium text-gray-900">Откуда</label>
                <select required v-model="order.from" id="from" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">

                    <option v-for="(hub, index) in hubs_from" :key="hub">
                        {{ hub }}
                    </option>
                </select>
                <label for="to" class="block mb-2 text-sm font-medium text-gray-900">Куда</label>
                <select required v-model="order.to" id="to" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">

                    <option v-for="hub in hubs_to">
                        {{ hub }}
                    </option>
                </select>
                <div>
                    <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900">Вес (кг)</label>
                    <input required @input="formStatus.priceHidden = false" type="number" id="small-input" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                <div v-if="!formStatus.priceHidden"
                    class="flex justify-between">
                    <h4>Итого:</h4>
                    <p>{{ order.price }}</p>
                </div>
                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Оформить
                </button>
            </div>
            </form>
        </div>
    </div>
</template>