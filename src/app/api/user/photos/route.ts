import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    const caption = formData.get("caption") as string | null;
    const isMain = formData.get("isMain") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "photos");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${session.user.id}_${timestamp}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Get current photo count to set order
    const photoCount = await prisma.photo.count({
      where: { userId: session.user.id },
    });

    // If this is set as main photo, update all other photos to not be main
    if (isMain) {
      await prisma.photo.updateMany({
        where: { userId: session.user.id },
        data: { isMain: false },
      });
    }

    // Create photo record in database
    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        url: `/uploads/photos/${filename}`,
        caption: caption?.trim() || null,
        order: photoCount,
        isMain: isMain || photoCount === 0, // First photo is automatically main
      },
    });

    return NextResponse.json({ photo });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/user/photos - Request received");
    const session = await getServerSession(authOptions);
    console.log("DELETE - Session:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("id");
    console.log("DELETE - Photo ID:", photoId);

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    // Find the photo to delete
    console.log("DELETE - Finding photo for user:", session.user.id);
    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: session.user.id, // Ensure user owns this photo
      },
    });
    console.log("DELETE - Found photo:", photo);

    if (!photo) {
      console.log("DELETE - Photo not found");
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete from database
    console.log("DELETE - Deleting from database");
    await prisma.photo.delete({
      where: { id: photoId },
    });
    console.log("DELETE - Database delete successful");

    // Delete file from disk
    try {
      const filepath = join(process.cwd(), "public", photo.url);
      const fs = await import("fs/promises");
      await fs.unlink(filepath);
    } catch (fileError) {
      console.warn("Could not delete file from disk:", fileError);
      // Continue anyway - database record is deleted
    }

    // If this was the main photo, set another photo as main
    if (photo.isMain) {
      const remainingPhotos = await prisma.photo.findMany({
        where: { userId: session.user.id },
        orderBy: { order: "asc" },
        take: 1,
      });

      if (remainingPhotos.length > 0) {
        await prisma.photo.update({
          where: { id: remainingPhotos[0].id },
          data: { isMain: true },
        });
      }
    }

    console.log("DELETE - All operations successful");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photoId, caption, isMain } = body;

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    // Find the photo to update
    const photo = await prisma.photo.findFirst({
      where: {
        id: photoId,
        userId: session.user.id, // Ensure user owns this photo
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // If setting as main photo, remove main status from all other photos
    if (isMain) {
      await prisma.photo.updateMany({
        where: {
          userId: session.user.id,
          id: { not: photoId },
        },
        data: { isMain: false },
      });
    }

    // Update the photo
    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        caption: caption?.trim() || null,
        isMain: isMain ?? photo.isMain,
      },
    });

    return NextResponse.json({ photo: updatedPhoto });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}
