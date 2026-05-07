"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ChevronLeft, ChevronRight, 
  Eye, Grid3X3, Sun, Zap, Monitor, Camera, Plus,
  LayoutGrid, ArrowRight
} from 'lucide-react';

const serviceTypes = [
  { value: 'solar', label: 'Solar Energy', icon: Sun },
  { value: 'electricwork', label: 'Electrical Work', icon: Zap },
  { value: 'ups', label: 'UPS Systems', icon: Monitor },
  { value: 'camera', label: 'Security Systems', icon: Camera }
];

const ITEMS_PER_PAGE = 8;

export default function CorporateGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/gallery');
        const result = await response.json();
        if (result.success) {
          setGalleryItems(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    return filterType === 'all' || item.type === filterType;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  const paginatedItems = filteredItems.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = paginatedItems.length < filteredItems.length;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const openLightbox = (item) => {
    const filteredIndex = filteredItems.findIndex(fi => fi._id === item._id);
    setSelectedImage({ ...item, index: filteredIndex });
  };
  const closeLightbox = () => setSelectedImage(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedImage && selectedImage.index < filteredItems.length - 1) {
      const nextItem = filteredItems[selectedImage.index + 1];
      setSelectedImage({ ...nextItem, index: selectedImage.index + 1 });
    }
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedImage && selectedImage.index > 0) {
      const prevItem = filteredItems[selectedImage.index - 1];
      setSelectedImage({ ...prevItem, index: selectedImage.index - 1 });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage(e);
      if (e.key === 'ArrowRight') nextImage(e);
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, filteredItems]);

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white font-body antialiased overflow-x-hidden">
      
      {/* ── 1. PREMIUM HERO SECTION ── */}
      <header className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about/gallery_hero.png"
            alt="Advanced industrial portfolio"
            fill
            priority
            className="object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/80 via-transparent to-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Visual Authority</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[0.9] tracking-tighter mb-6 uppercase">
            Project <br/>
            <span className="text-blue-500 italic">Telemetry.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A high-definition showcase of our structural achievements across industrial, commercial, and solar infrastructures.
          </p>
        </motion.div>
      </header>

      {/* ── 2. FILTER SYSTEM ── */}
      <section className="sticky top-[80px] z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-y border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                filterType === 'all' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> All Divisions
            </button>
            {serviceTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`flex items-center px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                  filterType === type.value 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <type.icon className="w-4 h-4 mr-2" /> {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROJECT GRID ── */}
      <section className="max-w-[1600px] mx-auto px-6 py-20 min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Initializing Grid...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10">
            <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-white mb-2 uppercase">Zero Records Found</h3>
            <p className="text-slate-500">No telemetry data matches the selected filter.</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {paginatedItems.map((item, idx) => {
                  const typeConfig = serviceTypes.find(t => t.value === item.type) || serviceTypes[0];
                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      key={item._id}
                      onClick={() => openLightbox(item)}
                      className="group relative cursor-pointer bg-white/5 border border-white/5 overflow-hidden aspect-square"
                    >
                      <Image 
                        src={item.imageUrl} 
                        alt={`${typeConfig.label} Project`} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      
                      {/* Obsidian Overlay */}
                      <div className="absolute inset-0 bg-[#0a0a0b]/40 group-hover:bg-[#0a0a0b]/10 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-80" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                            {typeConfig.label}
                          </span>
                        </div>
                        <h3 className="text-white font-heading font-bold text-lg uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          View Project <ArrowRight className="inline w-4 h-4 ml-1.5 text-blue-500" />
                        </h3>
                      </div>

                      {/* Corner Decoration */}
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/10 group-hover:border-blue-500/50 transition-colors m-4" />
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMore}
                  className="group flex items-center bg-white text-black font-black px-12 py-5 rounded-none transition-all duration-300 hover:bg-blue-600 hover:text-white transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  LOAD MORE PROJECTS
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── 4. LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0a0b]/95 backdrop-blur-2xl p-4 md:p-12"
            onClick={closeLightbox}
          >
            <div 
              className="relative w-full max-w-7xl max-h-full flex flex-col items-center justify-center" 
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={closeLightbox}
                className="absolute top-0 right-0 md:-top-16 md:-right-4 bg-white/5 hover:bg-blue-600 text-white p-4 transition-all duration-300 z-50 border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full bg-[#0a0a0b] border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-center" style={{ maxHeight: '85vh' }}>
                <div className="relative flex-grow flex items-center justify-center min-h-[50vh] p-4">
                  <motion.div
                    key={selectedImage._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full max-h-[70vh]"
                  >
                    <Image 
                      src={selectedImage.imageUrl} 
                      alt="Project Showcase" 
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                  
                  {/* Nav */}
                  {selectedImage.index > 0 && (
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-blue-600 text-white p-5 border border-white/10 backdrop-blur-md transition-all">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {selectedImage.index < filteredItems.length - 1 && (
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-blue-600 text-white p-5 border border-white/10 backdrop-blur-md transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                {/* Details */}
                <div className="bg-white/5 border-t border-white/10 p-8 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      {(() => {
                        const tConf = serviceTypes.find(t => t.value === selectedImage.type) || serviceTypes[0];
                        return (
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 uppercase tracking-widest">
                              {tConf.label}
                            </span>
                            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                              Deployed: {new Date(selectedImage.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="text-white font-heading font-black text-xl tracking-tighter">
                      <span className="text-blue-500">{selectedImage.index + 1}</span> / {filteredItems.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-heading {
          font-family: var(--font-outfit), sans-serif;
        }
        .font-body {
          font-family: var(--font-inter), sans-serif;
        }
      `}</style>

    </main>
  );
}
