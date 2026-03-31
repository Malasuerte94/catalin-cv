<template>
  <div class="min-h-screen pt-12 px-6 lg:px-24 max-w-7xl mx-auto pb-24 text-on-background">
    <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      <h1 class="font-headline text-4xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
      <div class="flex gap-4">
        <router-link to="/" class="px-6 py-2 border border-white/10 rounded-xl font-label text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">visibility</span>
          View Site
        </router-link>
        <button @click="handleLogout" class="px-6 py-2 border border-error/20 rounded-xl font-label text-xs uppercase tracking-widest text-error hover:bg-error/5 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-white/10 mb-8 overflow-x-auto">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="currentTab = tab.id"
        :class="[
          'px-8 py-4 font-label text-xs uppercase tracking-widest transition-all whitespace-nowrap',
          currentTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-8">
      <!-- Projects Tab -->
      <div v-if="currentTab === 'projects'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="font-headline text-2xl font-bold uppercase tracking-tight">Project Management</h2>
          <button @click="openModal('project')" class="bg-primary px-6 py-2 rounded-xl text-on-primary font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(0,232,255,0.3)]">
            Add New Project
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="project in dataStore.projects" :key="project.id" class="glass-panel p-6 rounded-2xl flex justify-between items-start">
            <div class="flex gap-4 overflow-hidden">
              <div v-if="project.logoUrl || project.imageUrl" class="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                <img :src="serveImage(project.logoUrl || project.imageUrl, 100, 100)" class="w-full h-full object-contain" />
              </div>
              <div class="min-w-0">
                <h4 class="font-headline font-bold text-lg mb-1 truncate">{{ project.title }}</h4>
                <div class="text-on-surface-variant text-sm line-clamp-2 mb-4 rich-text-content opacity-60" v-html="project.description"></div>
                <div class="flex gap-2 flex-wrap">
                  <span v-for="tag in project.tags" :key="tag" class="text-[10px] font-label font-bold text-secondary-fixed border border-secondary/20 px-2 py-1 rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0 ml-4">
              <button @click="editItem('project', project)" class="text-primary p-2 hover:bg-primary/10 rounded-lg transition-all">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="deleteItem('projects', project.id)" class="text-error p-2 hover:bg-error/10 rounded-lg transition-all">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Tab -->
      <div v-if="currentTab === 'experience'" class="space-y-6">
        <div class="flex justify-between items-center">
          <div class="space-y-1">
            <h2 class="font-headline text-2xl font-bold uppercase tracking-tight">Experience Management</h2>
            <p class="text-[10px] text-slate-500 font-label uppercase tracking-widest">Drag items to reorder them on the main site</p>
          </div>
          <button @click="openModal('experience')" class="bg-primary px-6 py-2 rounded-xl text-on-primary font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(0,232,255,0.3)]">
            Add Experience
          </button>
        </div>

        <draggable 
          v-model="dataStore.experience" 
          item-key="id"
          class="space-y-4"
          handle=".drag-handle"
          @end="handleReorder"
        >
          <template #item="{ element: item }">
            <div class="glass-panel p-6 rounded-2xl flex justify-between items-center group">
              <div class="flex items-center gap-4">
                <div class="drag-handle cursor-grab active:cursor-grabbing text-slate-600 hover:text-primary transition-colors p-2">
                  <span class="material-symbols-outlined">drag_indicator</span>
                </div>
                <div v-if="item.companyLogo" class="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                  <img :src="serveImage(item.companyLogo, 80, 80)" class="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 class="font-headline font-bold text-lg">{{ item.role }}</h4>
                  <p class="text-secondary font-label text-xs uppercase tracking-widest font-bold">{{ item.company }} // {{ item.period }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="editItem('experience', item)" class="text-primary p-2 hover:bg-primary/10 rounded-lg transition-all">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="deleteItem('experience', item.id)" class="text-error p-2 hover:bg-error/10 rounded-lg transition-all">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Network Tab -->
      <div v-if="currentTab === 'contact'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="font-headline text-2xl font-bold uppercase tracking-tight">Contact Links</h2>
          <button @click="openModal('contact')" class="bg-primary px-6 py-2 rounded-xl text-on-primary font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(0,232,255,0.3)]">
            Add Link
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="link in dataStore.contactUrls" :key="link.id" class="glass-panel p-6 rounded-2xl flex justify-between items-center">
            <div class="flex items-center gap-4 overflow-hidden">
              <div v-if="link.iconUrl" class="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden border border-white/10 flex items-center justify-center p-1">
                <img :src="serveImage(link.iconUrl, 80, 80)" class="w-full h-full object-contain" />
              </div>
              <span v-else class="material-symbols-outlined text-primary flex-shrink-0">link</span>
              <div class="min-w-0">
                <h4 class="font-headline font-bold truncate">{{ link.platform }}</h4>
                <p class="text-on-surface-variant text-xs truncate">{{ link.value || link.url }}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="editItem('contact', link)" class="text-primary p-2 hover:bg-primary/10 rounded-lg transition-all">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="deleteItem('contact-urls', link.id)" class="text-error p-2 hover:bg-error/10 rounded-lg transition-all">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Config Tab -->
      <div v-if="currentTab === 'config3d'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="font-headline text-2xl font-bold uppercase tracking-tight">3D Keyboard Configurator</h2>
          <button @click="openModal('config3d')" class="bg-primary px-6 py-2 rounded-xl text-on-primary font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(0,232,255,0.3)]">
            Add Keyframe
          </button>
        </div>

        <div class="glass-panel overflow-hidden rounded-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white/5 font-label text-[10px] uppercase tracking-widest text-slate-400">
                <tr>
                  <th class="px-6 py-4">Section ID</th>
                  <th class="px-6 py-4">Position (X,Y,Z)</th>
                  <th class="px-6 py-4">Rotation (X,Y,Z)</th>
                  <th class="px-6 py-4">Scale</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="kf in sortedKeyframes" :key="kf.id" class="hover:bg-white/5 transition-colors">
                  <td class="px-6 py-4 font-headline font-bold text-primary capitalize">{{ kf.sectionId }}</td>
                  <td class="px-6 py-4 text-xs text-slate-300">{{ kf.posX }}, {{ kf.posY }}, {{ kf.posZ }}</td>
                  <td class="px-6 py-4 text-xs text-slate-300">{{ kf.rotX }}, {{ kf.rotY }}, {{ kf.rotZ }}</td>
                  <td class="px-6 py-4 text-xs text-slate-300">{{ kf.scale }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button @click="editItem('config3d', kf)" class="text-primary p-2 hover:bg-primary/10 rounded-lg transition-all">
                        <span class="material-symbols-outlined">edit</span>
                      </button>
                      <button @click="deleteItem('background-keyframes', kf.id)" class="text-error p-2 hover:bg-error/10 rounded-lg transition-all">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="modal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-md" @click="modal.show = false"></div>
      <div class="relative glass-panel w-full max-w-2xl p-8 rounded-3xl shadow-[0_0_80px_rgba(0,232,255,0.1)] overflow-y-auto max-h-[90vh]">
        <h3 class="font-headline text-2xl font-black uppercase tracking-tight mb-8">
          {{ modal.editingId ? 'Update Record' : 'Create New Entry' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-6">
          <!-- Project Form -->
          <template v-if="modal.type === 'project'">
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Title</label>
              <input v-model="form.project.title" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Technology Stack</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" v-model="form.project.techType" value="custom" class="hidden" />
                  <div class="w-5 h-5 rounded-full border-2 border-primary/20 flex items-center justify-center transition-all group-hover:border-primary/40" :class="{ 'border-primary bg-primary/20': form.project.techType === 'custom' }">
                    <div v-if="form.project.techType === 'custom'" class="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span class="font-label text-xs uppercase tracking-widest" :class="{ 'text-primary': form.project.techType === 'custom' }">Custom Code (&lt;/&gt;)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" v-model="form.project.techType" value="wordpress" class="hidden" />
                  <div class="w-5 h-5 rounded-full border-2 border-primary/20 flex items-center justify-center transition-all group-hover:border-primary/40" :class="{ 'border-primary bg-primary/20': form.project.techType === 'wordpress' }">
                    <div v-if="form.project.techType === 'wordpress'" class="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span class="font-label text-xs uppercase tracking-widest" :class="{ 'text-primary': form.project.techType === 'wordpress' }">WordPress (WP)</span>
                </label>
              </div>
            </div>

            <div class="col-span-2">
              <RichTextEditor v-model="form.project.description" label="Description" />
            </div>
            
            <ImageUpload v-model="form.project.logoUrl" label="Project Logo" />
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Project URL</label>
              <input v-model="form.project.projectUrl" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
            </div>

            <div class="col-span-2">
              <GalleryUpload v-model="form.project.gallery" />
            </div>

            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tags (comma separated)</label>
              <input v-model="form.tagsRaw" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
          </template>

          <!-- Experience Form -->
          <template v-if="modal.type === 'experience'">
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Role</label>
              <input v-model="form.experience.role" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Company</label>
              <input v-model="form.experience.company" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Period</label>
              <input v-model="form.experience.period" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="2024 - PRESENT" required />
            </div>

            <ImageUpload v-model="form.experience.companyLogo" label="Company Logo" />
            <div class="flex items-center gap-2 pt-8">
              <input v-model="form.experience.isCurrent" type="checkbox" id="isCurrent" class="accent-primary w-4 h-4" />
              <label for="isCurrent" class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Current Position</label>
            </div>

            <div class="col-span-2">
              <RichTextEditor v-model="form.experience.description" label="Description" />
            </div>

            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tags (comma separated)</label>
              <input v-model="form.tagsRaw" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
          </template>

          <!-- Contact Form -->
          <template v-if="modal.type === 'contact'">
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Platform / Title</label>
              <input v-model="form.contact.platform" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="e.g. Discord" required />
            </div>
            
            <ImageUpload v-model="form.contact.iconUrl" label="Custom Icon" class="col-span-2" />

            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Platform Value (e.g. Username / ID)</label>
              <input v-model="form.contact.value" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="e.g. User#0000" />
            </div>

            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">URL (Optional)</label>
              <input v-model="form.contact.url" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="https://..." />
            </div>
          </template>

          <!-- 3D Config Form -->
          <template v-if="modal.type === 'config3d'">
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Target Section</label>
              <select v-model="form.config3d.sectionId" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required>
                <option value="home">Home (Hero)</option>
                <option value="experience">Experience</option>
                <option value="portfolio">Projects</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Position X</label>
              <input v-model="form.config3d.posX" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Position Y</label>
              <input v-model="form.config3d.posY" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Position Z</label>
              <input v-model="form.config3d.posZ" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Rotation X (Degrees)</label>
              <input v-model="form.config3d.rotX" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Rotation Y (Degrees)</label>
              <input v-model="form.config3d.rotY" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Rotation Z (Degrees)</label>
              <input v-model="form.config3d.rotZ" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
            <div class="col-span-2 space-y-2">
              <label class="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Scale</label>
              <input v-model="form.config3d.scale" class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" required />
            </div>
          </template>

          <div class="col-span-2 flex justify-end gap-4 mt-6">
            <button type="button" @click="modal.show = false" class="px-6 py-3 font-label text-xs uppercase tracking-widest hover:text-white transition-all">Cancel</button>
            <button type="submit" class="bg-primary px-10 py-3 rounded-xl text-on-primary font-headline font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,232,255,0.3)]">
              Confirm Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDataStore } from '../stores/data';
import draggable from 'vuedraggable';
import ImageUpload from '../components/ImageUpload.vue';
import GalleryUpload from '../components/GalleryUpload.vue';
import RichTextEditor from '../components/RichTextEditor.vue';

const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();

const handleReorder = async () => {
  const ids = dataStore.experience.map(item => item.id);
  try {
    await fetch('/api/admin/experience/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ ids })
    });
  } catch (err) {
    console.error('Failed to save order:', err);
  }
};

const SECTION_ORDER = ['home', 'experience', 'portfolio', 'contact'];

const sortedKeyframes = computed(() => {
  return [...dataStore.backgroundKeyframes].sort((a, b) => {
    return SECTION_ORDER.indexOf(a.sectionId) - SECTION_ORDER.indexOf(b.sectionId);
  });
});

const currentTab = ref('projects');
const tabs = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Network' },
  { id: 'config3d', label: '3D Config' },
];

const modal = reactive({
  show: false,
  type: 'project',
  editingId: null as number | null,
});

const form = reactive({
  tagsRaw: '',
  project: { title: '', description: '', imageUrl: '', logoUrl: '', projectUrl: '', techType: 'custom' as 'custom' | 'wordpress', gallery: [] as string[] },
  experience: { role: '', company: '', companyLogo: '', period: '', description: '', isCurrent: false },
  contact: { platform: '', url: '', value: '', iconUrl: '' },
  config3d: { sectionId: 'home', posX: '0', posY: '0', posZ: '0', rotX: '0', rotY: '0', rotZ: '0', scale: '1' },
});

onMounted(() => {
  dataStore.fetchAll();
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' });
};

const openModal = (type: string) => {
  modal.type = type;
  modal.editingId = null;
  modal.show = true;
  resetForm();
};

const resetForm = () => {
  form.tagsRaw = '';
  form.project = { title: '', description: '', imageUrl: '', logoUrl: '', projectUrl: '', techType: 'custom', gallery: [] };
  form.experience = { role: '', company: '', companyLogo: '', period: '', description: '', isCurrent: false };
  form.contact = { platform: '', url: '', value: '', iconUrl: '' };
  form.config3d = { sectionId: 'home', posX: '0', posY: '0', posZ: '0', rotX: '0', rotY: '0', rotZ: '0', scale: '1' };
};

const editItem = (type: string, item: any) => {
  modal.type = type;
  modal.editingId = item.id;
  modal.show = true;
  
  if (type === 'project') {
    form.project = { 
      title: item.title, 
      description: item.description, 
      imageUrl: item.imageUrl, 
      logoUrl: item.logoUrl || '', 
      projectUrl: item.projectUrl || '', 
      techType: item.techType || 'custom',
      gallery: item.gallery || [] 
    };
    form.tagsRaw = (item.tags || []).join(', ');
  } else if (type === 'experience') {
    form.experience = { 
      role: item.role, 
      company: item.company, 
      companyLogo: item.companyLogo || '', 
      period: item.period, 
      description: item.description, 
      isCurrent: item.isCurrent 
    };
    form.tagsRaw = (item.tags || []).join(', ');
  } else if (type === 'contact') {
    form.contact = { 
      platform: item.platform, 
      url: item.url || '', 
      value: item.value || '', 
      iconUrl: item.iconUrl || '' 
    };
  } else if (type === 'config3d') {
    form.config3d = { ...item };
  }
};

const deleteItem = async (endpoint: string, id: number) => {
  if (!confirm('Proceed with deletion?')) return;
  
  try {
    const res = await fetch(`/api/admin/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (res.ok) dataStore.fetchAll();
  } catch (err) {
    console.error(err);
  }
};

const handleSubmit = async () => {
  let endpoint = '';
  let payload = {};
  
  if (modal.type === 'project') {
    endpoint = 'projects';
    if (form.project.gallery.length > 0) {
      form.project.imageUrl = form.project.gallery[0];
    }
    payload = { ...form.project, tags: form.tagsRaw.split(',').map(t => t.trim()).filter(t => t) };
  } else if (modal.type === 'experience') {
    endpoint = 'experience';
    payload = { ...form.experience, tags: form.tagsRaw.split(',').map(t => t.trim()).filter(t => t) };
  } else if (modal.type === 'contact') {
    endpoint = 'contact-urls';
    payload = { ...form.contact };
  } else if (modal.type === 'config3d') {
    endpoint = 'background-keyframes';
    payload = { ...form.config3d };
  }

  const url = modal.editingId ? `/api/admin/${endpoint}/${modal.editingId}` : `/api/admin/${endpoint}`;
  const method = modal.editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      modal.show = false;
      dataStore.fetchAll();
    }
  } catch (err) {
    console.error(err);
  }
};

const serveImage = (path: string, width = 400, height = 300) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};
</script>
