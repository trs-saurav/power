'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Grid3X3, 
    Sun,
    Zap,
    Monitor,
    Camera,
    Eye,
    ArrowRight,
    Play,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function ModernGalleryPage() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const serviceTypes = [
        { 
            value: 'solar', 
            label: 'Solar Energy', 
            gradient: 'from-amber-400 via-orange-500 to-yellow-600',
            bgGradient: 'from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-900/20',
            icon: Sun,
            description: 'Sustainable power solutions',
            accent: 'text-amber-600 dark:text-amber-400'
        },
        { 
            value: 'electricwork', 
            label: 'Electrical Work', 
            gradient: 'from-blue-400 via-cyan-500 to-blue-600',
            bgGradient: 'from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-900/20',
            icon: Zap,
            description: 'Professional installations',
            accent: 'text-blue-600 dark:text-blue-400'
        },
        { 
            value: 'ups', 
            label: 'UPS Systems', 
            gradient: 'from-emerald-400 via-green-500 to-teal-600',
            bgGradient: 'from-emerald-50 to-green-100 dark:from-emerald-950/20 dark:to-green-900/20',
            icon: Monitor,
            description: 'Backup power systems',
            accent: 'text-emerald-600 dark:text-emerald-400'
        },
        { 
            value: 'camera', 
            label: 'Security Systems', 
            gradient: 'from-purple-400 via-violet-500 to-purple-600',
            bgGradient: 'from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20',
            icon: Camera,
            description: 'Advanced surveillance',
            accent: 'text-purple-600 dark:text-purple-400'
        }
    ];

    // Fetch gallery items
    const fetchGalleryItems = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/gallery');
            const result = await response.json();
            
            if (result.success) {
                setGalleryItems(result.data);
            } else {
                console.error('API returned error:', result);
            }
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const getTypeConfig = (type) => {
        return serviceTypes.find(t => t.value === type) || serviceTypes[0];
    };

    // Enhanced filtering logic
    const filteredItems = galleryItems.filter(item => {
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesSearch = searchTerm === '' || 
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getTypeConfig(item.type).label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getTypeConfig(item.type).description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesType && matchesSearch;
    });

    const openLightbox = (item, index) => {
        const filteredIndex = filteredItems.findIndex(filteredItem => filteredItem._id === item._id);
        setSelectedImage({ ...item, index: filteredIndex });
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        if (selectedImage && selectedImage.index < filteredItems.length - 1) {
            const nextItem = filteredItems[selectedImage.index + 1];
            setSelectedImage({ ...nextItem, index: selectedImage.index + 1 });
        }
    };

    const prevImage = () => {
        if (selectedImage && selectedImage.index > 0) {
            const prevItem = filteredItems[selectedImage.index - 1];
            setSelectedImage({ ...prevItem, index: selectedImage.index - 1 });
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!selectedImage) return;
            
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [selectedImage]);

    // Modern Loading Component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                    <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Modern Image Card Component
    const ImageCard = ({ item, index }) => {
        const config = getTypeConfig(item.type);
        const IconComponent = config.icon;

        return (
            <Card 
                className="group overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5"
                onClick={() => openLightbox(item, index)}
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={item.imageUrl}
                        alt={`${config.label} service`}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient} opacity-0 group-hover:opacity-90 transition-opacity duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex justify-end">
                            <div className="w-10 h-10 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0 shadow-lg`}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {config.label}
                            </Badge>
                            <p className="text-white text-sm font-medium">{config.description}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-semibold text-sm ${config.accent}`}>{config.label}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{config.description}</p>
                </CardContent>
            </Card>
        );
    };

    // Enhanced Lightbox with Fixed Dimensions
    const ModernLightbox = ({ image, onClose }) => (
        <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative w-full max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
                {/* Fixed Container for Consistent Sizing */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden mx-auto" style={{ aspectRatio: '16/10' }}>
                    <img
                        src={image.imageUrl}
                        alt={`${getTypeConfig(image.type).label} service`}
                        className="w-full h-full object-contain bg-black rounded-2xl"
                        style={{ 
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                        }}
                    />
                    
                    {/* Image Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 rounded-b-2xl">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <Badge className={`bg-gradient-to-r ${getTypeConfig(image.type).gradient} text-white border-0 shadow-lg`}>
                                    {React.createElement(getTypeConfig(image.type).icon, { className: "h-4 w-4 mr-2" })}
                                    {getTypeConfig(image.type).label}
                                </Badge>
                                <span className="text-sm opacity-90">
                                    {new Date(image.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="text-sm opacity-90 bg-black/20 px-3 py-1 rounded-full">
                                {image.index + 1} of {filteredItems.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                {image.index > 0 && (
                    <Button
                        onClick={prevImage}
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 border-0 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 transition-all duration-200"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                )}
                
                {image.index < filteredItems.length - 1 && (
                    <Button
                        onClick={nextImage}
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 border-0 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 transition-all duration-200"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                )}

                {/* Close Button */}
                <Button
                    onClick={onClose}
                    size="icon"
                    className="absolute top-4 right-4 bg-black/30 border-0 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 transition-all duration-200"
                >
                    <X className="h-5 w-5" />
                </Button>

                {/* Keyboard Navigation Hint */}
                <div className="absolute top-4 left-4 text-white/70 text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Use ← → arrows or ESC to close
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen m-auto relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            
            


            {/* Modern Gallery Header - Removed top margin */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-violet-950/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
                    {/* Title Section */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
                            <Eye className="h-4 w-4" />
                            Professional Gallery
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent mb-4">
                            Our Work Portfolio
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Explore our expertise across solar, electrical, and security solutions
                        </p>
                    </div>

                    {/* Modern Search and Filter Section */}
                    <div className="flex flex-col items-center space-y-6">
                        
                        {/* Enhanced Search Bar */}
                        <div className="relative w-full max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <Input
                                placeholder="Search our projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-4 text-lg bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                            />
                            {searchTerm && (
                                <Button
                                    onClick={() => setSearchTerm('')}
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Modern Filter Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                            {/* All Projects Button */}
                            <Button
                                onClick={() => setFilterType('all')}
                                variant={filterType === 'all' ? 'default' : 'outline'}
                                className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 group ${
                                    filterType === 'all' 
                                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white shadow-lg shadow-slate-900/25 scale-105' 
                                        : 'bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 relative z-10">
                                    <Grid3X3 className="h-4 w-4" />
                                    <span>All Projects</span>
                                    <Badge variant="secondary" className={`ml-2 ${filterType === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                        {galleryItems.length}
                                    </Badge>
                                </div>
                            </Button>
                            
                            {/* Service Type Filter Buttons */}
                            {serviceTypes.map((type) => {
                                const IconComponent = type.icon;
                                const typeCount = galleryItems.filter(item => item.type === type.value).length;
                                const isActive = filterType === type.value;
                                
                                return (
                                    <Button
                                        key={type.value}
                                        onClick={() => setFilterType(type.value)}
                                        variant={isActive ? 'default' : 'outline'}
                                        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 group ${
                                            isActive 
                                                ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg scale-105` 
                                                : 'bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 relative z-10">
                                            <IconComponent className="h-4 w-4" />
                                            <span className="hidden sm:inline">{type.label}</span>
                                            <span className="sm:hidden">{type.label.split(' ')[0]}</span>
                                            <Badge 
                                                variant="secondary" 
                                                className={`ml-2 ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                                            >
                                                {typeCount}
                                            </Badge>
                                        </div>
                                        
                                        {/* Animated Background Effect */}
                                        {!isActive && (
                                            <div className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                        )}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Results Counter */}
                        {(searchTerm || filterType !== 'all') && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                <Eye className="h-4 w-4" />
                                <span>
                                    Showing {filteredItems.length} of {galleryItems.length} projects
                                </span>
                                {(searchTerm || filterType !== 'all') && (
                                    <Button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterType('all');
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ml-2"
                                    >
                                        Clear all
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Gallery Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 ">

              
                {loading ? (
                    <LoadingSkeleton />
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Eye className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            {searchTerm || filterType !== 'all' 
                                ? 'Try adjusting your search criteria or browse all categories' 
                                : 'Our gallery is currently being updated with new projects'}
                        </p>
                        {(searchTerm || filterType !== 'all') && (
                            <Button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('all');
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                View All Projects
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item, index) => (
                            <ImageCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modern Lightbox */}
            {selectedImage && (
                <ModernLightbox image={selectedImage} onClose={closeLightbox} />
            )}
        </div>
    );
}
