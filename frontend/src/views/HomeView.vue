<template>
  <div>
    <!-- Header Section -->
    <header class="fixed top-6 w-full z-50 px-6 flex justify-center">
        <nav class="glass-panel px-8 py-3 rounded-full flex gap-8 items-center border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <a class="text-primary font-headline uppercase tracking-widest text-xs transition-all duration-300 ease-out hover:text-white"
                href="#home">Home</a>
            <a class="text-slate-400 hover:text-white transition-colors font-headline uppercase tracking-widest text-xs transition-all duration-300 ease-out"
                href="#experience">Experience</a>
            <a class="text-slate-400 hover:text-white transition-colors font-headline uppercase tracking-widest text-xs transition-all duration-300 ease-out"
                href="#portfolio">Projects</a>
            <a class="text-slate-400 hover:text-white transition-colors font-headline uppercase tracking-widest text-xs transition-all duration-300 ease-out"
                href="#contact">Contact</a>
        </nav>
    </header>

    <main class="relative z-10 pt-32 px-6 lg:px-24 max-w-7xl mx-auto">
        <!-- Hero Section -->
        <section class="mb-32 min-h-[70vh] flex flex-col justify-center" id="home">
            <div class="flex flex-col items-start gap-6 max-w-3xl">
                <h1
                    class="font-headline text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-on-background">
                    TRANSFORMING RAW <span class="text-primary italic">DATA</span> INTO <span
                        class="text-secondary">REAL EXPERIENCES</span>.
                </h1>
                <p class="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed">
                    I bridge the gap between complex technical systems and elegant, high-fidelity
                    interfaces. My work is focused on building digital products that feel intuitive and powerful.
                </p>
                <div class="mt-4 flex gap-4">
                    <div class="h-12 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(135,239,255,0.6)]"></div>
                    <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant pt-2">Scroll to
                        explore projects</p>
                </div>
            </div>
        </section>

        <!-- Experience Section (Timeline) -->
        <section class="mb-48" id="experience">
            <div class="flex items-center gap-4 mb-16">
                <h2 class="font-headline text-3xl font-black uppercase tracking-tighter">Experience_Log</h2>
                <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
            </div>
            <div class="relative space-y-16">
                <!-- Power Rail -->
                <div
                    class="absolute left-6 md:left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent shadow-[0_0_10px_rgba(0,232,255,0.3)]">
                </div>
                
                <div v-for="item in dataStore.experience" :key="item.id" class="relative pl-16 md:pl-28 group">
                    <div
                        class="absolute left-1.5 md:left-[17px] top-0 w-11 h-11 rounded-full bg-surface-container-highest border border-white/10 z-20 overflow-hidden group-hover:scale-110 transition-transform flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,232,255,0.2)]">
                        <span class="material-symbols-outlined text-primary">work</span>
                    </div>
                    <div class="glass-panel p-8 rounded-xl shadow-2xl relative">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 class="text-2xl font-headline font-bold text-on-background">{{ item.role }}</h3>
                                <p class="text-secondary font-label text-xs uppercase tracking-widest font-bold mt-1">
                                    {{ item.company }} // {{ item.period }}</p>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <span v-for="tag in item.tags" :key="tag"
                                    class="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] text-secondary font-bold font-label uppercase">{{ tag }}</span>
                            </div>
                        </div>
                        <p class="text-on-surface-variant leading-relaxed mb-6 whitespace-pre-wrap">
                            {{ item.description }}
                        </p>
                        <div class="flex items-center gap-2 text-secondary/70 text-xs font-label uppercase">
                            <span class="material-symbols-outlined text-sm">settings_ethernet</span>
                            <span>System Status: {{ item.isCurrent ? 'Critical Operation Active' : 'Operation Archived' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section class="mb-48" id="portfolio">
            <div class="flex items-center gap-4 mb-16">
                <div class="h-[1px] w-24 bg-primary shadow-[0_0_10px_rgba(0,232,255,0.5)]"></div>
                <h2 class="font-headline text-3xl font-black uppercase tracking-tighter">Project_Files</h2>
                <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="project in dataStore.projects" :key="project.id"
                    class="group relative overflow-hidden rounded-2xl glass-panel shadow-[0_10px_40px_rgba(0,232,255,0.05)]">
                    <div v-if="project.imageUrl" class="aspect-video overflow-hidden">
                        <img :src="project.imageUrl" :alt="project.title"
                            class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-4">
                            <h4
                                class="text-xl font-headline font-bold text-on-background group-hover:text-primary transition-colors">
                                {{ project.title }}</h4>
                            <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank"
                                class="text-primary material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">north_east</a>
                        </div>
                        <p class="text-on-surface-variant text-sm font-light mb-6">{{ project.description }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="tag in project.tags" :key="tag"
                                class="text-[10px] font-label font-bold text-secondary-fixed border border-secondary/20 px-2 py-1 rounded">{{ tag }}</span>
                        </div>
                    </div>
                    <div
                        class="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all rounded-2xl pointer-events-none">
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="mb-48" id="contact">
            <div
                class="glass-panel p-8 md:p-16 rounded-[2rem] border-primary/10 shadow-[0_0_60px_rgba(0,232,255,0.05)]">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 class="font-headline text-4xl font-black mb-8 leading-tight">INITIALIZE_CONNECTION</h2>
                        <p class="text-on-surface-variant mb-12 text-lg">Ready to upgrade your system architecture?
                            Leave a packet below and my node will reach out to yours within 24 standard cycles.</p>
                        <div class="space-y-6">
                            <div v-for="link in dataStore.contactUrls" :key="link.id" class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                                    <span class="material-symbols-outlined">{{ link.icon || 'link' }}</span>
                                </div>
                                <a :href="link.url" target="_blank" class="font-headline text-lg tracking-tight hover:text-primary transition-colors">{{ link.platform }}</a>
                            </div>
                        </div>
                    </div>
                    <form @submit.prevent class="space-y-6">
                        <div class="space-y-2">
                            <label
                                class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1">Source_Identifier</label>
                            <input
                                class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Your Name" type="text" />
                        </div>
                        <div class="space-y-2">
                            <label
                                class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1">Network_Protocol</label>
                            <input
                                class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Email Address" type="email" />
                        </div>
                        <div class="space-y-2">
                            <label
                                class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1">Payload_Data</label>
                            <textarea
                                class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Brief project overview..." rows="4"></textarea>
                        </div>
                        <button
                            class="w-full bg-primary py-4 rounded-xl text-on-primary font-headline font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,232,255,0.3)] hover:brightness-110 active:scale-95 transition-all"
                            type="submit">ESTABLISH_LINK</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer Shell -->
    <footer class="w-full py-12">
        <div class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span class="font-headline text-[10px] tracking-[0.2em] text-[#7CF700] font-bold uppercase">KINETIC NEBULA
                SYSTEM</span>
            <span class="font-headline text-[10px] tracking-[0.2em] text-slate-600 uppercase">2026 KINETIC NEBULA SYSTEM
                // ALL RIGHTS RESERVED</span>
            <div class="flex gap-6">
                <router-link to="/admin/login" class="font-headline text-[10px] tracking-[0.2em] text-slate-600 hover:text-[#7CF700] transition-colors opacity-70 hover:opacity-100 uppercase">
                  ADMIN_ACCESS
                </router-link>
            </div>
        </div>
    </footer>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <div class="glass-panel flex justify-around items-center py-4 rounded-3xl border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
            <a class="flex flex-col items-center text-slate-500 hover:text-primary transition-all active:scale-90"
                href="#home">
                <span class="material-symbols-outlined">home</span>
            </a>
            <a class="flex flex-col items-center text-slate-500 hover:text-primary transition-all active:scale-90"
                href="#experience">
                <span class="material-symbols-outlined">layers</span>
            </a>
            <a class="flex flex-col items-center text-slate-500 hover:text-primary transition-all active:scale-90"
                href="#portfolio">
                <span class="material-symbols-outlined">rocket_launch</span>
            </a>
            <a class="flex flex-col items-center text-slate-500 hover:text-primary transition-all active:scale-90"
                href="#contact">
                <span class="material-symbols-outlined">alternate_email</span>
            </a>
        </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDataStore } from '../stores/data';

const dataStore = useDataStore();

onMounted(() => {
  dataStore.fetchAll();
});
</script>
