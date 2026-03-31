<template>
  <div class="space-y-2">
    <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{{ label }}</label>
    <div 
      @click="$refs.fileInput.click()"
      class="relative group cursor-pointer overflow-hidden bg-[#1A1A23] border-2 border-dashed border-primary/20 rounded-xl h-32 flex flex-col items-center justify-center transition-all hover:border-primary/40"
    >
      <template v-if="modelValue">
        <img :src="modelValue" class="absolute inset-0 w-full h-full object-contain p-2" />
        <div class="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="material-symbols-outlined text-white">upload</span>
        </div>
      </template>
      <template v-else>
        <span class="material-symbols-outlined text-primary/40 text-3xl mb-2">add_photo_alternate</span>
        <span class="text-[10px] font-label text-slate-500 uppercase tracking-widest">Upload Image</span>
      </template>
      
      <div v-if="uploading" class="absolute inset-0 bg-background/80 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    <input 
      type="file" 
      ref="fileInput" 
      class="hidden" 
      accept="image/*,image/svg+xml" 
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  modelValue: string;
  label: string;
}>();

const emit = defineEmits(['update:modelValue']);
const authStore = useAuthStore();
const uploading = ref(false);

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  uploading.value = true;
  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      emit('update:modelValue', data.url);
    }
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    uploading.value = false;
  }
};
</script>
