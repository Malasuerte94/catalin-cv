<template>
  <div class="col-span-2 space-y-4">
    <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Project Gallery (First image is cover)</label>
    
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div 
        v-for="(url, index) in modelValue" 
        :key="url"
        class="relative group aspect-square bg-[#1A1A23] border border-primary/20 rounded-xl overflow-hidden shadow-lg shadow-black/40"
      >
        <img :src="url" class="w-full h-full object-cover" />
        
        <!-- Controls -->
        <div class="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            @click="removeImage(index)"
            type="button"
            class="p-1.5 bg-error/20 hover:bg-error/40 text-error rounded-lg transition-all"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
          <button 
            v-if="index > 0"
            @click="setAsCover(index)"
            type="button"
            class="p-1.5 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg transition-all"
          >
            <span class="material-symbols-outlined text-sm">first_page</span>
          </button>
        </div>

        <!-- Cover Badge -->
        <div v-if="index === 0" class="absolute top-2 left-2 px-2 py-0.5 bg-primary/80 backdrop-blur-md rounded text-[8px] font-label font-bold uppercase tracking-widest text-on-primary">
          Cover
        </div>
      </div>

      <!-- Add Button -->
      <button 
        @click="$refs.fileInput.click()"
        type="button"
        class="aspect-square bg-[#1A1A23] border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center transition-all hover:border-primary/40 hover:bg-white/5"
      >
        <template v-if="uploading">
          <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </template>
        <template v-else>
          <span class="material-symbols-outlined text-primary/40 text-2xl mb-1">add_a_photo</span>
          <span class="text-[8px] font-label text-slate-500 uppercase tracking-widest">Add Image</span>
        </template>
      </button>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      class="hidden" 
      accept="image/*,image/svg+xml" 
      multiple
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits(['update:modelValue']);
const authStore = useAuthStore();
const uploading = ref(false);

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  uploading.value = true;
  try {
    const urls = [...props.modelValue];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        urls.push(data.url);
      }
    }
    emit('update:modelValue', urls);
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    uploading.value = false;
  }
};

const removeImage = (index: number) => {
  const urls = [...props.modelValue];
  urls.splice(index, 1);
  emit('update:modelValue', urls);
};

const setAsCover = (index: number) => {
  const urls = [...props.modelValue];
  const item = urls.splice(index, 1)[0];
  urls.unshift(item);
  emit('update:modelValue', urls);
};
</script>
