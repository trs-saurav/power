'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle, Trash2, RefreshCw, Eye, Filter, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GalleryUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    // Gallery list states
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [filterType, setFilterType] = useState('all');

    const serviceTypes = [
        { value: 'solar', label: 'Solar Services', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'electricwork', label: 'Electric Work', color: 'bg-blue-100 text-blue-800' },
        { value: 'ups', label: 'UPS Services', color: 'bg-green-100 text-green-800' },
        { value: 'camera', label: 'Camera Services', color: 'bg-purple-100 text-purple-800' }
    ];

    // Fetch gallery items
    const fetchGalleryItems = async () => {
        setLoading(true);
        try {
            const queryParam = filterType !== 'all' ? `?type=${filterType}` : '';
            const response = await fetch(`/api/gallery${queryParam}`);
            const result = await response.json();
            
            if (result.success) {
                setGalleryItems(result.data);
            } else {
                toast.error('Failed to fetch gallery items');
            }
        } catch (error) {
            toast.error('Network error while fetching images');
        } finally {
            setLoading(false);
        }
    };

    // Load gallery items on component mount and filter change
    useEffect(() => {
        fetchGalleryItems();
    }, [filterType]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                // Check file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size must be less than 5MB');
                    return;
                }

                setSelectedFile(file);
                
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target.result);
                reader.readAsDataURL(file);

                toast.success('Image selected successfully');
            } else {
                toast.error('Please select an image file');
                setSelectedFile(null);
                setPreview(null);
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile || !selectedType) {
            toast.error('Please select both file and service type');
            return;
        }

        const uploadPromise = new Promise(async (resolve, reject) => {
            try {
                setUploading(true);

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('type', selectedType);

                const response = await fetch('/api/gallery', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    setSelectedFile(null);
                    setSelectedType('');
                    setPreview(null);
                    
                    // Reset form
                    document.getElementById('file-input').value = '';
                    
                    // Refresh gallery
                    fetchGalleryItems();
                    
                    resolve(result);
                } else {
                    reject(new Error(result.message || 'Upload failed'));
                }
            } catch (error) {
                reject(error);
            } finally {
                setUploading(false);
            }
        });

        toast.promise(
            uploadPromise,
            {
                loading: 'Uploading image...',
                success: 'Image uploaded successfully! 🎉',
                error: (err) => err.message || 'Upload failed'
            }
        );
    };

    const handleDelete = async (itemId) => {
        const deletePromise = new Promise(async (resolve, reject) => {
            try {
                setDeleteLoading(itemId);

                const response = await fetch(`/api/gallery/${itemId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (response.ok) {
                    // Remove item from local state
                    setGalleryItems(prev => prev.filter(item => item._id !== itemId));
                    resolve(result);
                } else {
                    reject(new Error(result.message || 'Delete failed'));
                }
            } catch (error) {
                reject(error);
            } finally {
                setDeleteLoading(null);
            }
        });

        toast.promise(
            deletePromise,
            {
                loading: 'Deleting image...',
                success: 'Image deleted successfully! 🗑️',
                error: (err) => err.message || 'Delete failed'
            }
        );
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        document.getElementById('file-input').value = '';
        toast.success('Selection cleared');
    };

    const getTypeLabel = (type) => {
        const serviceType = serviceTypes.find(t => t.value === type);
        return serviceType ? serviceType.label : type;
    };

    const getTypeColor = (type) => {
        const serviceType = serviceTypes.find(t => t.value === type);
        return serviceType ? serviceType.color : 'bg-gray-100 text-gray-800';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    
                    {/* Left Column - Upload Form */}
                    <div className="space-y-6">
                        <Card className="w-full sticky top-6">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Upload Gallery Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpload} className="space-y-4 sm:space-y-6">
                                    
                                    {/* Service Type Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="service-type" className="text-sm font-medium">
                                            Service Type
                                        </Label>
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select service type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serviceTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* File Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="file-input" className="text-sm font-medium">
                                            Select Image
                                        </Label>
                                        <Input
                                            id="file-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                                        </p>
                                    </div>

                                    {/* Upload Button */}
                                    <Button
                                        type="submit"
                                        disabled={!selectedFile || !selectedType || uploading}
                                        className="w-full py-2.5 sm:py-3"
                                        size="lg"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Image
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preview and Gallery */}
                    <div className="space-y-6">
                        
                        {/* Image Preview Section */}
                        {preview && (
                            <Card className="w-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Preview</CardTitle>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={clearSelection}
                                            className="h-8"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="relative rounded-lg overflow-hidden border">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-48 sm:h-64 object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>File: {selectedFile?.name}</span>
                                            <span>Size: {formatFileSize(selectedFile?.size || 0)}</span>
                                        </div>
                                        {selectedType && (
                                            <Badge className={`text-xs w-fit ${getTypeColor(selectedType)}`}>
                                                {getTypeLabel(selectedType)}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Gallery Section */}
                        <Card className="w-full">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                        <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                                        Gallery Images ({galleryItems.length})
                                    </CardTitle>
                                    
                                    {/* Filter and Refresh */}
                                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                                        <Select value={filterType} onValueChange={setFilterType}>
                                            <SelectTrigger className="w-full xs:w-40">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                {serviceTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                        <Button 
                                            variant="outline" 
                                            onClick={fetchGalleryItems}
                                            disabled={loading}
                                            className="w-full xs:w-auto"
                                        >
                                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-gray-600">Loading images...</span>
                                    </div>
                                ) : galleryItems.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium mb-2">No images found</p>
                                        <p className="text-sm">Upload your first image to get started!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                                        {galleryItems.map((item) => (
                                            <div key={item._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                {/* Thumbnail */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={`${getTypeLabel(item.type)} image`}
                                                        className="w-16 h-16 object-cover rounded-md border"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                                                            {getTypeLabel(item.type)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="flex-shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deleteLoading === item._id}
                                                    >
                                                        {deleteLoading === item._id ? (
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                                                        ) : (
                                                            <Trash2 className="h-3 w-3 text-red-600" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
