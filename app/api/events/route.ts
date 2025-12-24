import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import Event, { generateSlug, normalizeDate, normalizeTime } from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON data format" }, { status: 400 });
    }

    const file = formData.get("image");

    if (!file) return NextResponse.json({ message: "Image file is required" }, { status: 400 });

    // Check if file is actually a File object (not a string)
    if (typeof file === "string") {
      return NextResponse.json({ message: "Invalid file format - expected File object" }, { status: 400 });
    }

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: "DevEvent" }, (error, results) => {
          if (error) return reject(error);

          resolve(results);
        })
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    // Generate slug from title
    const slug = generateSlug(event.title as string);

    // Normalize date and time
    const normalizedDate = normalizeDate(event.date as string);
    const normalizedTime = normalizeTime(event.time as string);

    const createdEvent = await Event.create({
      ...event,
      slug,
      date: normalizedDate,
      time: normalizedTime,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Event Creation Failed", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 });
  }
}
