"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ChevronLeft, ChevronRight, 
  Eye, Grid3X3, Sun, Zap, Monitor, Camera, Plus
} from 'lucide-react';

const serviceTypes = [
  { value: 'solar', label: 'Solar Energy', icon: Sun },
  { value: 'electricwork', label: 'Electrical Work', icon: Zap },
  { value: 'ups', label: 'UPS Systems', icon: Monitor },
  { value: 'camera', label: 'Security Systems', icon: Camera }
];

const ITEMS_PER_PAGE = 8; // Adjust this if you want more/less per page

export default function CorporateGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch gallery items
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

  // Filter Logic
  const filteredItems = galleryItems.filter(item => {
    return filterType === 'all' || item.type === filterType;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  // Calculate items for current page
  const paginatedItems = filteredItems.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = paginatedItems.length < filteredItems.length;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Lightbox Handlers
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
    <main className="min-h-screen bg-[#fbf8ff] text-slate-900 font-sans antialiased">
      
      {/* ── 1. SEO HERO / HEADER ── */}
      <header className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Image with Deep Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop"
            alt="Advanced industrial infrastructure facility"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1E40AF]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001453]/60 to-[#1a1b22]/90" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto mt-4"
        >
          <span className="inline-block text-[#F59E0B] font-bold tracking-widest uppercase text-sm mb-4">
            Industrial Excellence
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Our Engineering Portfolio
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Explore our proven track record in delivering high-specification industrial and commercial electrical solutions worldwide.
          </p>
        </motion.div>
      </header>

      {/* ── 2. FILTER BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setFilterType('all')}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              filterType === 'all' 
              ? 'bg-[#1E40AF] text-white shadow-md border-transparent' 
              : 'bg-white text-slate-700 hover:bg-[#e8e7f1] border border-[#c4c5d5]'
            }`}
          >
            <Grid3X3 className="w-4 h-4 mr-2" /> All Projects
          </button>
          {serviceTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filterType === type.value 
                ? 'bg-[#1E40AF] text-white shadow-md border-transparent' 
                : 'bg-white text-slate-700 hover:bg-[#e8e7f1] border border-[#c4c5d5]'
              }`}
            >
              <type.icon className="w-4 h-4 mr-2" /> {type.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. DYNAMIC GRID ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 min-h-[50vh] pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {paginatedItems.map((item) => {
                  const typeConfig = serviceTypes.find(t => t.value === item.type) || serviceTypes[0];
                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={item._id}
                      onClick={() => openLightbox(item)}
                      className="group relative cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e8e7f1] aspect-square"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={`${typeConfig.label} Project`} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Dark Gradient Overlay for Text Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001453]/90 via-[#001453]/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                      
                      {/* Content Container */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end h-full">
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#F59E0B] text-[#001453] text-[10px] sm:text-xs font-bold px-2 py-1 rounded flex items-center shadow-md">
                              <typeConfig.icon className="w-3 h-3 mr-1" /> {typeConfig.label}
                            </span>
                          </div>
                          <p className="text-white text-sm sm:text-base font-medium line-clamp-2 drop-shadow-md">
                            Click to view full project
                          </p>
                        </motion.div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination / Load More Button */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  className="flex items-center bg-white border-2 border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Load More Projects
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#001453]/95 backdrop-blur-md p-2 sm:p-4 md:p-12"
            onClick={closeLightbox}
          >
            <div 
              className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center" 
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button Mobile/Desktop */}
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 md:-top-12 md:right-0 bg-white/10 hover:bg-red-500 text-white p-2 rounded-full transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col justify-center" style={{ maxHeight: '85vh' }}>
                <div className="relative flex-grow flex items-center justify-center min-h-[50vh]">
                  <img 
                    src={selectedImage.imageUrl} 
                    alt="Project Image" 
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                  
                  {/* Nav Buttons overlaying image */}
                  {selectedImage.index > 0 && (
                    <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#F59E0B] text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-colors">
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}
                  {selectedImage.index < filteredItems.length - 1 && (
                    <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#F59E0B] text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-colors">
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}
                </div>
                
                {/* Image Details Bar at bottom */}
                <div className="bg-[#1a1b22] border-t border-[#444653] p-4 sm:p-6 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      {(() => {
                        const tConf = serviceTypes.find(t => t.value === selectedImage.type) || serviceTypes[0];
                        return (
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-[#1E40AF] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded flex items-center shadow-md">
                              <tConf.icon className="w-4 h-4 mr-2" /> {tConf.label}
                            </span>
                            <span className="text-slate-400 text-xs sm:text-sm">
                              {new Date(selectedImage.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="text-slate-300 text-sm font-bold bg-[#2f3037] px-3 py-1.5 rounded border border-[#444653]">
                      {selectedImage.index + 1} / {filteredItems.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </main>
  );
}
