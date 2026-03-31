<template>
  <div class="space-y-2">
    <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{{ label }}</label>
    <div class="rich-text-wrapper bg-[#1A1A23] border border-primary/20 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
      <div ref="editorContainer" class="rich-text-editor"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps<{
  modelValue: string;
  label: string;
}>();

const emit = defineEmits(['update:modelValue']);
const editorContainer = ref<HTMLElement | null>(null);
let quill: Quill | null = null;

onMounted(() => {
  if (!editorContainer.value) return;

  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    }
  });

  quill.root.innerHTML = props.modelValue || '';

  quill.on('text-change', () => {
    const html = quill?.root.innerHTML || '';
    if (html === '<p><br></p>') {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', html);
    }
  });
});

watch(() => props.modelValue, (newVal) => {
  if (quill && newVal !== quill.root.innerHTML) {
    quill.root.innerHTML = newVal || '';
  }
});
</script>

<style>
.rich-text-wrapper .ql-toolbar.ql-snow {
  border: none !important;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(0, 232, 255, 0.1) !important;
  padding: 8px 12px;
}

.rich-text-wrapper .ql-container.ql-snow {
  border: none !important;
  font-family: inherit;
  font-size: 14px;
  min-height: 150px;
}

.rich-text-wrapper .ql-editor {
  color: white;
  min-height: 150px;
  padding: 12px 16px;
}

.rich-text-wrapper .ql-editor.ql-blank::before {
  color: rgba(255, 255, 255, 0.2);
  font-style: normal;
  left: 16px;
}

.rich-text-wrapper .ql-snow .ql-stroke {
  stroke: rgba(255, 255, 255, 0.6);
}

.rich-text-wrapper .ql-snow .ql-fill {
  fill: rgba(255, 255, 255, 0.6);
}

.rich-text-wrapper .ql-snow .ql-picker {
  color: rgba(255, 255, 255, 0.6);
}

.rich-text-wrapper .ql-snow .ql-picker-options {
  background-color: #1A1A23;
  border: 1px solid rgba(0, 232, 255, 0.2);
}
</style>
