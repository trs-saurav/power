import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Gallery from '@/models/gallery';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import authSeller from '@/lib/authSeller';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;

        const isAdmin = await authSeller(userId);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, message: "Admin access required" }, 
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = params;
        
        // Find the gallery item
        const galleryItem = await Gallery.findById(id);
        if (!galleryItem) {
            return NextResponse.json(
                { success: false, message: 'Gallery item not found' },
                { status: 404 }
            );
        }

        // Extract public_id from Cloudinary URL for deletion
        const urlParts = galleryItem.imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `gallery/${galleryItem.type}/${publicIdWithExtension.split('.')[0]}`;

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
            console.warn('Cloudinary deletion failed:', cloudinaryError);
        }

        // Delete from database
        await Gallery.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Gallery item deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to delete gallery item',
                ...(process.env.NODE_ENV === 'development' && { error: error.message })
            },
            { status: 500 }
        );
    }
}
