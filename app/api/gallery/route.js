import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Gallery from '@/models/gallery';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!type || !['solar', 'electricwork', 'ups', 'camera'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid service type' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: `gallery/${type}`,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // Save to database
        const newGalleryItem = new Gallery({
            imageUrl: uploadResult.secure_url,
            type: type
        });

        await newGalleryItem.save();

        return NextResponse.json({
            message: 'Image uploaded successfully',
            data: newGalleryItem
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}

// GET all gallery items
export async function GET() {
    try {
        await connectDB();

        const galleryItems = await Gallery.find({})
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: galleryItems
        });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery items' },
            { status: 500 }
        );
    }
}
