<template>
  <div>
    <!-- Header Section (Top on Desktop, Bottom on Mobile) -->
    <header class="fixed bottom-6 md:bottom-auto top-auto md:top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
        <nav class="glass-panel px-8 py-3 md:px-12 md:py-6 rounded-full flex gap-8 md:gap-16 items-center border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] pointer-events-auto">
            <a v-for="link in navLinks" :key="link.href" 
                @click.prevent="scrollTo(link.href)" 
                class="relative group font-headline uppercase tracking-[0.2em] text-[10px] md:text-xl transition-all duration-500 ease-out cursor-pointer"
                :class="currentSection === link.href.slice(1) ? 'text-primary' : 'text-slate-400 hover:text-primary'"
                :href="link.href"
            >
                {{ link.text }}
            </a>
        </nav>
    </header>

    <main class="relative z-10 pt-32">
        <!-- Hero Section (Full Width) -->
        <section class="mb-12 md:mb-32 min-h-[70vh] flex flex-col justify-center px-6 md:px-[10vw]" id="home">
            <div class="flex flex-col items-start gap-6 max-w-3xl w-full text-left reveal-on-scroll" :ref="revealRef">
                <h1
                    class="font-headline text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-on-background">
                    TRANSFORMING RAW <span class="text-primary animate-pulse-glow rounded-lg px-2">IDEA</span> INTO <span
                        class="text-secondary">REAL EXPERIENCES</span>.
                </h1>
                <p class="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed stagger-item" style="transition-delay: 200ms">
                    I bridge the gap between complex technical systems and elegant, high-fidelity
                    interfaces. My work is focused on building digital products that feel intuitive and powerful.
                </p>
                <div class="mt-4 flex gap-4 stagger-item" style="transition-delay: 400ms">
                    <div class="h-12 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(135,239,255,0.6)] animate-bounce"></div>
                    <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant pt-2">Scroll to
                        explore projects</p>
                </div>
            </div>
        </section>

        <!-- Content Container (1200px) -->
        <div class="max-w-[1200px] mx-auto px-0">
            <!-- Experience Section (Timeline) -->
            <section class="mb-12 md:mb-48" id="experience">
                <div class="flex items-center gap-4 mb-6 md:mb-16 px-6 reveal-on-scroll" :ref="revealRef">
                    <h2 class="font-headline text-3xl font-black uppercase tracking-tighter glitch-text" data-text="Experience_Log">Experience_Log</h2>
                    <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
                </div>
                <div class="relative space-y-6 md:space-y-16">
                    <!-- Power Rail (Desktop Only) -->
                    <div
                        class="absolute hidden md:block md:left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent shadow-[0_0_10px_rgba(0,232,255,0.3)]">
                    </div>
                    
                    <div v-for="(item, index) in dataStore.experience" :key="item.id" 
                        class="relative md:pl-28 group mb-6 md:mb-24 px-6 md:px-0 reveal-on-scroll" 
                        :ref="revealRef"
                        :data-reveal-delay="index * 100"
                    >
                        <!-- Desktop Logo (Vertical rotated strip) -->
                        <div
                            class="absolute left-[-134px] md:left-[-101px] top-12 w-[280px] h-[80px] rounded-[20px] bg-background/90 backdrop-blur-[12px] border-2 border-primary/40 z-20 flex items-center justify-center p-4 shadow-[0_8px_32px_rgba(0,232,255,0.2)] transition-all duration-300 -rotate-90 origin-center group-hover:border-primary/80 group-hover:shadow-[0_8px_32px_rgba(0,232,255,0.4)] hidden md:flex"
                        >
                            <img v-if="item.companyLogo" :src="serveImage(item.companyLogo, 560, 160)" class="w-full h-full object-contain brightness-[1.1] grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <span v-else class="material-symbols-outlined text-primary text-4xl">work</span>
                        </div>
                        
                        <!-- Mobile Header (Logo + Line) -->
                        <div class="md:hidden flex items-center gap-3 mb-3">
                            <div class="w-28 h-14 rounded-2xl bg-surface-container-highest border border-white/10 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,232,255,0.15)] flex-shrink-0">
                                <img v-if="item.companyLogo" :src="serveImage(item.companyLogo, 200, 100)" class="w-full h-full object-contain" />
                                <span v-else class="material-symbols-outlined text-primary">work</span>
                            </div>
                            <div class="h-[1px] flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
                        </div>

                        <div class="glass-panel bg-background/80 p-6 md:p-8 rounded-xl shadow-2xl relative border-white/20 hover:border-primary/30 transition-colors duration-500">
                            <div class="flex flex-col gap-3 md:gap-4 mb-6">
                                <div>
                                    <h3 class="text-2xl font-headline font-bold text-on-background group-hover:text-primary transition-colors">{{ item.role }}</h3>
                                    <p class="text-secondary font-label text-xs uppercase tracking-widest font-bold mt-1">
                                        {{ item.company }} // {{ item.period }}</p>
                                </div>
                                <div v-if="item.tags && item.tags.length" class="flex gap-3 flex-wrap pt-3">
                                    <span v-for="tag in item.tags" :key="tag"
                                        class="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] text-secondary font-bold font-label uppercase border border-secondary/20 hover:scale-105 transition-transform">{{ tag }}</span>
                                </div>
                            </div>
                            <div class="text-on-surface leading-relaxed mb-6 rich-text-content opacity-95" v-html="item.description"></div>
                            <div class="flex items-center gap-2 text-secondary font-label text-xs uppercase">
                                <span class="material-symbols-outlined text-sm animate-spin-slow">settings_ethernet</span>
                                <span>Job Status: {{ item.isCurrent ? 'Active' : 'Past' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Portfolio Section -->
            <section class="mb-12 md:mb-48 px-6 md:px-0" id="portfolio">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-16 reveal-on-scroll" :ref="revealRef">
                    <div class="flex items-center gap-4 flex-grow">
                        <div class="h-[1px] w-24 bg-primary shadow-[0_0_10px_rgba(0,232,255,0.5)]"></div>
                        <h2 class="font-headline text-3xl font-black uppercase tracking-tighter glitch-text" data-text="Project_Files">Project_Files</h2>
                        <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
                    </div>
                    
                    <!-- Tech Filter Icons -->
                    <div class="flex gap-4 items-center bg-background/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
                        <button 
                            @click="projectFilter = 'all'"
                            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5"
                            :class="projectFilter === 'all' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,232,255,0.4)] border-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'"
                            title="All Projects"
                        >
                            <span class="material-symbols-outlined">grid_view</span>
                        </button>
                        <div class="w-[1px] h-6 bg-white/10"></div>
                        <button 
                            @click="projectFilter = 'custom'"
                            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5"
                            :class="projectFilter === 'custom' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,232,255,0.4)] border-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'"
                            title="Custom Code"
                        >
                            <span class="material-symbols-outlined">code</span>
                        </button>
                        <button 
                            @click="projectFilter = 'wordpress'"
                            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5"
                            :class="projectFilter === 'wordpress' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,232,255,0.4)] border-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'"
                            title="WordPress"
                        >
                            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.181 2.986-.51-.11-.186-.21-.363-.293-.53l-2.535-7.165zm3.91-3.796c.621 0 1.09.53 1.09 1.134 0 .528-.27 1.05-.594 1.55l-2.991 8.072c2.095-1.34 3.483-3.655 3.483-6.289 0-1.144-.258-2.228-.718-3.197l-.27.73c0 .01.01.01.01.01zm-11.734.417c-.441.979-.688 2.063-.688 3.203 0 2.825 1.565 5.282 3.882 6.574l-3.033-8.293c-.053.17-.11.345-.161.516zm7.666 1.57h.01l3.304 9.126c.404-.265.787-.565 1.143-.897l-3.504-9.357c-.47-.234-.906-.399-1.309-.399-.403 0-.766.11-.954.327zm-3.65-1.01c.717 0 1.306 1.234 1.306 2.054 0 .341-.055.67-.117.962l-2.483 7.21c-.01.03-.024.061-.035.091-1.631-1.22-2.684-3.181-2.684-5.388 0-1.12.274-2.176.758-3.098l3.255-1.83zm3.65 0c.844 0 1.366 1.171 1.366 2.122 0 .61-.265 1.25-.49 1.777l-1.636-4.631c.214-.241.488-.344.76-.344zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.114 21.035c-4.991 0-9.035-4.045-9.035-9.035S7.123 2.965 12.114 2.965 21.15 7.01 21.15 12s-4.045 9.035-9.036 9.035z"/></svg>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div v-for="(project, index) in displayedProjects" :key="project.id"
                        class="group relative overflow-hidden rounded-2xl glass-panel shadow-[0_10px_40px_rgba(0,232,255,0.05)] reveal-on-scroll"
                        :ref="revealRef"
                        :data-reveal-delay="(index % 2) * 100"
                    >
                        
                        <!-- Project Cover / First Gallery Image -->
                        <div v-if="project.imageUrl" @click="openLightbox(project)" class="aspect-video overflow-hidden relative cursor-zoom-in">
                            <img :src="serveImage(project.imageUrl, 800, 450)" :alt="project.title"
                                loading="lazy"
                                class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                            
                            <!-- Project Logo Overlay -->
                            <div v-if="project.logoUrl" class="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 p-2 shadow-2xl overflow-hidden group-hover:scale-110 transition-transform">
                                <img :src="serveImage(project.logoUrl, 100, 100)" class="w-full h-full object-contain" loading="lazy" />
                            </div>

                            <!-- Tech Icon Overlay -->
                            <div class="absolute top-4 right-4 w-10 h-10 rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
                                <span v-if="project.techType === 'wordpress'" class="w-6 h-6 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" class="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.181 2.986-.51-.11-.186-.21-.363-.293-.53l-2.535-7.165zm3.91-3.796c.621 0 1.09.53 1.09 1.134 0 .528-.27 1.05-.594 1.55l-2.991 8.072c2.095-1.34 3.483-3.655 3.483-6.289 0-1.144-.258-2.228-.718-3.197l-.27.73c0 .01.01.01.01.01zm-11.734.417c-.441.979-.688 2.063-.688 3.203 0 2.825 1.565 5.282 3.882 6.574l-3.033-8.293c-.053.17-.11.345-.161.516zm7.666 1.57h.01l3.304 9.126c.404-.265.787-.565 1.143-.897l-3.504-9.357c-.47-.234-.906-.399-1.309-.399-.403 0-.766.11-.954.327zm-3.65-1.01c.717 0 1.306 1.234 1.306 2.054 0 .341-.055.67-.117.962l-2.483 7.21c-.01.03-.024.061-.035.091-1.631-1.22-2.684-3.181-2.684-5.388 0-1.12.274-2.176.758-3.098l3.255-1.83zm3.65 0c.844 0 1.366 1.171 1.366 2.122 0 .61-.265 1.25-.49 1.777l-1.636-4.631c.214-.241.488-.344.76-.344zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.114 21.035c-4.991 0-9.035-4.045-9.035-9.035S7.123 2.965 12.114 2.965 21.15 7.01 21.15 12s-4.045 9.035-9.036 9.035z"/></svg>
                                </span>
                                <span v-else class="material-symbols-outlined text-2xl">code</span>
                            </div>

                            <!-- Overlay on hover -->
                            <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>

                        <div class="p-6 md:p-8">
                            <div class="flex items-center justify-between gap-4 mb-4">
                                <h4
                                    class="text-xl font-headline font-bold text-on-background group-hover:text-primary transition-colors truncate">
                                    {{ project.title }}</h4>
                                <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank"
                                    class="flex-shrink-0 flex items-center gap-2 text-primary font-headline font-black font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                    <span>SEE WEBSITE</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mb-0.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                </a>
                            </div>
                            
                            <div class="text-on-surface-variant text-sm font-light mb-6 rich-text-content line-clamp-3" v-html="project.description"></div>
                            
                            <!-- Small Gallery Strip -->
                            <div v-if="project.gallery && project.gallery.length > 1" class="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                                <div v-for="(img, idx) in project.gallery" :key="idx" 
                                    @click="openLightbox(project)"
                                    class="min-w-[80px] h-12 rounded-lg overflow-hidden border border-white/5 opacity-60 hover:opacity-100 transition-all cursor-pointer hover:scale-105">
                                    <img :src="serveImage(img, 160, 100)" class="w-full h-full object-cover" loading="lazy" />
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <span v-for="tag in project.tags" :key="tag"
                                    class="text-[10px] font-label font-bold text-secondary-fixed border border-secondary/20 px-2 py-1 rounded hover:bg-secondary/10 transition-colors">{{ tag }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Load More Trigger -->
                <div ref="loadMoreTrigger" class="h-20 w-full opacity-0"></div>
            </section>

            <!-- Contact Section -->
            <section class="mb-5 md:mb-48 px-6 md:px-0" id="contact">
                <div
                    class="glass-panel p-6 md:p-16 rounded-[2rem] border-primary/10 shadow-[0_0_60px_rgba(0,232,255,0.05)] reveal-on-scroll"
                    :ref="revealRef"
                >
                    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-16">
                        <!-- Header & Intro (Mobile: Order 1, Desktop: Order 1) -->
                        <div>
                            <h2 class="font-headline text-4xl font-black mb-3 md:mb-8 leading-tight">INITIALIZE CONNECTION</h2>
                            <p class="text-on-surface-variant mb-6 md:mb-12 text-lg">Ready to upgrade your system architecture?
                                Leave a packet below and my node will reach out to yours within 24 standard cycles.</p>
                            
                            <!-- Desktop Contact Links -->
                            <div class="hidden lg:flex flex-col gap-6">
                                <div v-for="(link, idx) in dataStore.contactUrls" :key="link.id" 
                                    class="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300 group/contact-item"
                                    :style="{ transitionDelay: idx * 50 + 'ms' }"
                                >
                                    <div
                                        class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary border border-white/5 overflow-hidden p-2">
                                        <img v-if="link.iconUrl" :src="serveImage(link.iconUrl, 100, 100)" class="w-full h-full object-contain" />
                                        <span v-else class="material-symbols-outlined">link</span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-label uppercase tracking-widest text-slate-500">{{ link.platform }}</span>
                                        <div class="flex items-center gap-3">
                                            <a v-if="link.url" :href="link.url" target="_blank" class="font-headline text-lg tracking-tight hover:text-primary transition-colors">{{ link.value || link.url }}</a>
                                            <span v-else class="font-headline text-lg tracking-tight">{{ link.value }}</span>
                                            
                                            <!-- Copy Button for non-URL values -->
                                            <button 
                                                v-if="link.value && !link.url" 
                                                @click="copyToClipboard(link.value)"
                                                class="text-slate-500 hover:text-primary transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <span class="material-symbols-outlined text-sm">content_copy</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Form -->
                        <div>
                            <form @submit.prevent="handleContactSubmit" class="space-y-6">
                                <div class="space-y-2 group">
                                    <label
                                        class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1 group-focus-within:text-primary transition-colors">Source_Identifier</label>
                                    <input
                                        v-model="contactForm.name"
                                        required
                                        class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Your Name" type="text" />
                                </div>
                                <div class="space-y-2 group">
                                    <label
                                        class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1 group-focus-within:text-primary transition-colors">Network_Protocol</label>
                                    <input
                                        v-model="contactForm.email"
                                        required
                                        class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Email Address" type="email" />
                                </div>
                                <div class="space-y-2 group">
                                    <label
                                        class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1 group-focus-within:text-primary transition-colors">Payload_Data</label>
                                    <textarea
                                        v-model="contactForm.message"
                                        required
                                        class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Brief project overview..." rows="4"></textarea>
                                </div>
                                <button
                                    :disabled="contactStatus.sending || contactStatus.sent"
                                    class="w-full bg-primary py-4 rounded-xl text-on-primary font-headline font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,232,255,0.3)] hover:brightness-110 active:scale-95 transition-all hover:shadow-[0_0_30px_rgba(0,232,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                >
                                  {{ contactStatus.sent ? 'MESSAGE SENT' : (contactStatus.sending ? 'SENDING...' : 'SEND MESSAGE') }}
                                </button>
                                <p v-if="contactStatus.error" class="text-error text-xs font-label uppercase tracking-widest text-center mt-2">{{ contactStatus.error }}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer Shell -->
    <footer class="w-full py-12 reveal-on-scroll" :ref="revealRef">
        <div class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <span class="font-headline text-[10px] tracking-[0.2em] text-[#7CF700] font-bold uppercase animate-pulse">CATALIN-ENE.RO // PORTFOLIO // CV</span>
            <span class="font-headline text-[10px] tracking-[0.2em] text-slate-600 uppercase">CATALIN-ENE.RO // ALL RIGHTS RESERVED</span>
        </div>
    </footer>


    <!-- Lightbox Modal -->
    <Transition name="modal-project">
      <div v-if="selectedProject" class="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12">
          <div class="absolute inset-0 bg-background/90 backdrop-blur-2xl" @click="closeLightbox"></div>
          
          <div 
            class="modal-content relative w-full max-w-6xl h-full md:h-auto md:max-h-full overflow-y-auto scrollbar-hide flex flex-col bg-background/50 md:rounded-[2.5rem] md:border md:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
            @scroll="handleModalScroll"
          >
              <!-- Sticky Header -->
              <div 
                class="sticky top-0 z-[110] transition-all duration-500 ease-in-out px-8 md:px-16"
                :class="{ 'sticky-nav-active py-4': modalScrollY > 50, 'py-12 md:py-20': modalScrollY <= 50 }"
              >
                  <div class="flex items-center justify-between gap-8">
                    <div class="flex flex-col gap-2 transition-all duration-500" :class="{ 'scale-90 origin-left': modalScrollY > 50 }">
                        <div class="flex items-center gap-6">
                            <h2 class="font-headline font-black uppercase tracking-tighter text-on-background leading-none truncate max-w-[60%]"
                                :class="{ 'text-2xl md:text-3xl': modalScrollY > 50, 'text-4xl md:text-7xl': modalScrollY <= 50 }"
                            >
                              {{ selectedProject.title }}
                            </h2>
                            <a v-if="selectedProject.projectUrl" :href="selectedProject.projectUrl" target="_blank" 
                                class="hidden md:flex items-center gap-2 text-primary font-headline font-black text-xl hover:brightness-110 transition-all flex-shrink-0"
                            >
                                <span>SEE WEBSITE</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                            </a>
                        </div>
                        <div class="flex flex-wrap gap-2 transition-opacity duration-500" :class="{ 'opacity-0 h-0 overflow-hidden': modalScrollY > 100 }">
                            <span v-for="tag in selectedProject.tags" :key="tag" class="bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 rounded-full text-[10px] font-bold font-label uppercase tracking-widest">{{ tag }}</span>
                        </div>
                    </div>
                    
                    <button @click="closeLightbox" class="text-white/40 hover:text-white transition-all hover:rotate-90">
                        <span class="material-symbols-outlined text-3xl md:text-4xl">close</span>
                    </button>
                  </div>
              </div>

              <!-- Content Area -->
              <div class="px-8 md:px-16 pb-24 space-y-12">
                  <!-- Description (Moved Up & Out of Card) -->
                  <div class="reveal-on-scroll" :ref="revealRef">
                      <div class="rich-text-content text-xl md:text-2xl leading-relaxed text-on-surface/90 font-light" v-html="selectedProject.description"></div>
                  </div>

                  <div class="grid grid-cols-1 gap-8 md:gap-12">
                      <div v-for="(img, idx) in selectedProject.gallery" :key="idx" class="rounded-3xl overflow-hidden shadow-2xl border border-white/5 reveal-on-scroll" :ref="revealRef">
                          <img :src="serveImage(img, 1600, 1200, 'fit')" class="w-full h-auto" />
                      </div>
                  </div>

                  <!-- Separate Action Bar -->
                  <div v-if="selectedProject.projectUrl" class="reveal-on-scroll" :ref="revealRef">
                      <div class="glass-panel p-6 md:px-12 md:py-8 rounded-[2rem] bg-background/40 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group/action-bar hover:border-primary/20 transition-all duration-500">
                          <div class="flex items-center gap-6">
                              <div class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary border border-white/5 group-hover/action-bar:scale-110 transition-transform">
                                  <span class="material-symbols-outlined animate-pulse">language</span>
                              </div>
                              <div class="flex flex-col gap-1">
                                  <span class="text-primary font-label text-[10px] uppercase tracking-[0.3em] font-bold">Node_Active</span>
                                  <span class="text-white text-sm font-headline uppercase tracking-widest opacity-60">Ready for handshake // Port_443</span>
                              </div>
                          </div>

                          <a :href="selectedProject.projectUrl" 
                              target="_blank" 
                              class="group/btn relative overflow-hidden bg-primary px-12 py-5 rounded-2xl text-on-primary font-headline font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,232,255,0.2)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,232,255,0.4)] hover:-translate-y-1 active:scale-95 flex items-center gap-4 w-full md:w-auto justify-center"
                          >
                              <!-- Shimmer effect -->
                              <div class="absolute inset-0 w-full h-full bg-white/30 -skew-x-[45deg] -translate-x-[150%] group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                              
                              <span class="relative z-10">SEE WEBSITE</span>
                              <span class="material-symbols-outlined relative z-10 text-xl transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">north_east</span>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDataStore } from '../stores/data';
import { useReveal } from '../composables/useReveal';
import { useScrollLock } from '@vueuse/core';

const dataStore = useDataStore();
const selectedProject = ref<any>(null);
const { revealRef } = useReveal();
const currentSection = ref('home');
const modalScrollY = ref(0);
const projectFilter = ref<'all' | 'custom' | 'wordpress'>('all');
const displayLimit = ref(8);
const loadMoreTrigger = ref<HTMLElement | null>(null);

const isLocked = useScrollLock(document.documentElement);

const filteredProjects = computed(() => {
  let filtered = dataStore.projects;
  if (projectFilter.value !== 'all') {
    filtered = dataStore.projects.filter(p => p.techType === projectFilter.value);
  }
  return filtered;
});

const displayedProjects = computed(() => {
  return filteredProjects.value.slice(0, displayLimit.value);
});

const contactForm = ref({
  name: '',
  email: '',
  message: ''
});

const contactStatus = ref({
  sending: false,
  sent: false,
  error: null as string | null
});

const handleContactSubmit = async () => {
  contactStatus.value.sending = true;
  contactStatus.value.error = null;
  
  const result = await dataStore.sendContactMessage(
    contactForm.value.name,
    contactForm.value.email,
    contactForm.value.message
  );
  
  contactStatus.value.sending = false;
  if (result.success) {
    contactStatus.value.sent = true;
    contactForm.value = { name: '', email: '', message: '' };
    setTimeout(() => {
      contactStatus.value.sent = false;
    }, 5000);
  } else {
    contactStatus.value.error = result.error || 'Failed to send message';
  }
};

const navLinks = [
  { text: 'Home', href: '#home' },
  { text: 'Experience', href: '#experience' },
  { text: 'Projects', href: '#portfolio' },
  { text: 'Contact', href: '#contact' }
];

const handleModalScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  modalScrollY.value = target.scrollTop;
};

onMounted(() => {
  dataStore.fetchAll();
  
  // Simple, robust scroll tracking
  const updateActiveSection = () => {
    const sections = ['home', 'experience', 'portfolio', 'contact'];
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection.value = sectionId;
          break;
        }
      }
    }
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection(); // Initial check

  // Infinite scroll observer
  const loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && displayLimit.value < filteredProjects.value.length) {
      displayLimit.value += 4;
    }
  }, { rootMargin: '400px' });

  if (loadMoreTrigger.value) {
    loadMoreObserver.observe(loadMoreTrigger.value);
  }
});

const scrollTo = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Image Serving Helper
const serveImage = (path: string, width = 800, height = 600, fit = 'fill') => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

const openLightbox = (project: any) => {
  selectedProject.value = project;
  isLocked.value = true;
};

const closeLightbox = () => {
  selectedProject.value = null;
  isLocked.value = false;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // Optional: Add a toast notification here if you have one
};
</script>
