import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if it's a DELETE operation from Supabase Webhook
    if (body.type !== "DELETE" || !body.old_record) {
      return NextResponse.json({ message: "Ignored, not a DELETE event." }, { status: 200 });
    }

    const { pdf_url } = body.old_record;

    if (!pdf_url) {
      return NextResponse.json({ message: "No PDF URL found in record." }, { status: 200 });
    }

    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/dx1ywq1pi/image/upload/v172.../nlitedu_certificates/NLIT-2026-1002.png
    // The public ID includes the folder: nlitedu_certificates/NLIT-2026-1002
    
    const urlParts = pdf_url.split("/");
    const filenameWithExt = urlParts.pop(); // e.g., NLIT-2026-1002.png
    const folder = urlParts.pop(); // e.g., nlitedu_certificates

    if (!filenameWithExt || !folder) {
      return NextResponse.json({ message: "Invalid Cloudinary URL format." }, { status: 400 });
    }

    // Remove the file extension to get the true public_id
    const filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf(".")) || filenameWithExt;
    const publicId = `${folder}/${filename}`;

    // Cloudinary credentials
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary credentials missing.");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    // Call Cloudinary Admin API to delete the image
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;
    const params = new URLSearchParams();
    params.append("public_ids[]", publicId);

    const deleteReq = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
      }
    });

    const result = await deleteReq.json();
    console.log(`Cloudinary deletion result for ${publicId}:`, result);

    return NextResponse.json({ success: true, result }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
