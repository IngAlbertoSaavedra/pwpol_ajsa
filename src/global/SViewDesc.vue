<template>
    <div 
        id="module-menu-title" 
        class="mb-6"
        v-animate:fade="{type: 'in', direction:'left', duration: 700 , timeout: 500}"
    >
        <p
            class="text-h5 text-primary font-weight-bold"          
        >
           <strong>{{ viewDesc }} {{ subTitle && ' - ' + subTitle }}</strong>
        </p>
    </div>
</template>
<script setup>
import { inject } from 'vue';
    const props = defineProps({
        subTitle: {
            type: String,
            default: '',
            required: false
        }
    });
    const viewDesc = inject("viewDesc");
</script>
<style lang="scss">
 #module-menu-title{
    & > p{
        display: inline-block !important;
        border-top: 2px #E53935 solid;
        border-bottom: 2px #E53935 solid;
        padding: 1px 4px 2px 4px;
        background: #fafafa;
    }
 }
</style>