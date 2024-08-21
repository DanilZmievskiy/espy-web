<script lang="ts" setup>
import { useAuthStore } from "~/store/auth";

const { role } = useAuthStore();

</script>
<template>
    <div class="h-screen grid grid-cols-4">
        <aside class="bg-stone-300">
            <NuxtLink to="/" class="flex items-center justify-center mb-10">
              <NuxtImg src="logo.png" alt="logo image" class="max-w-44 aspect-auto" />
            </NuxtLink>
            <ul v-if="role == 'client'" class="flex flex-col items-center justify-center gap-5">
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/profile">
                        Профиль
                    </NuxtLink>
                </li>
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/user/orders">
                        Заказы
                    </NuxtLink>
                </li>
            </ul>
            <ul v-if="role == 'admin'" class="flex flex-col items-center justify-center gap-5">
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/profile">
                        Профиль
                    </NuxtLink>
                </li>
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/admin/orders">
                        Заказы
                    </NuxtLink>
                </li>
            </ul>
            <ul v-if="role == 'driver'" class="flex flex-col items-center justify-center gap-5">
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/profile">
                        Профиль
                    </NuxtLink>
                </li>
                <li class="text-white text-center p-2 w-44 border border-grey-400 rounded-xl bg-zinc-500">
                    <NuxtLink to="/driver/orders">
                        Заказы
                    </NuxtLink>
                </li>
            </ul>
        </aside>
        <section class="col-span-3 p-4 bg-gray-50">
            <slot />
        </section>
    </div>
</template>