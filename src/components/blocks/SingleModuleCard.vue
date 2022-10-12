<template lang="">
  <div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NButton, NInput, NCard } from 'naive-ui';
import { Icon } from '@vicons/utils'
import { DeleteForeverRound } from "@vicons/material";

import type { Module } from '@/interface/module.interface'

const props = defineProps({
  mid: { // module id
    type: Number,
    required: true
  }
})



</script>

<style lang="">
  
</style>