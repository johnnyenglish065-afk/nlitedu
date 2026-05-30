// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Extracts resource type and public ID from a Cloudinary URL
 */
function extractCloudinaryDetails(url: string) {
  if (!url || typeof url !== 'string' || !url.includes("cloudinary.com")) return null;
  
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/');
    
    let resourceType = "image";
    if (pathParts.includes("raw")) resourceType = "raw";
    else if (pathParts.includes("video")) resourceType = "video";
    
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1) return null;
    
    let publicIdParts = pathParts.slice(uploadIndex + 1);
    if (publicIdParts.length > 0 && publicIdParts[0].match(/^v\d+$/)) {
      publicIdParts.shift(); // remove version
    }
    
    let publicId = decodeURIComponent(publicIdParts.join('/'));
    
    // For images and videos, remove the extension. For raw files, keep the extension!
    if (resourceType !== "raw") {
      const lastDotIndex = publicId.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        publicId = publicId.substring(0, lastDotIndex);
      }
    }
    
    return { resourceType, publicId };
  } catch (e) {
    console.error("Error parsing URL:", url, e);
    return null;
  }
}

/**
 * Deletes a file from Cloudinary using the Admin API
 */
async function deleteFromCloudinary(url: string) {
  const details = extractCloudinaryDetails(url);
  if (!details) {
    console.log("Could not extract details for URL:", url);
    return false;
  }

  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
  const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
  const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary credentials in Supabase Secrets");
    return false;
  }

  const { resourceType, publicId } = details;
  console.log(`Attempting to delete Cloudinary asset: [${resourceType}] ${publicId}`);

  const authHeader = `Basic ${btoa(`${apiKey}:${apiSecret}`)}`;
  const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload?public_ids[]=${encodeURIComponent(publicId)}`;

  try {
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Authorization": authHeader,
      }
    });

    const data = await res.json();
    console.log(`Cloudinary API response for ${publicId}:`, data);
    
    return res.ok && data?.deleted?.[publicId] === 'deleted';
  } catch (error) {
    console.error(`Failed to call Cloudinary API for ${publicId}:`, error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Database Webhooks send JSON payload with 'type' and 'old_record'/'record'
    const payload = await req.json();

    // Ensure this is a DELETE event
    if (payload.type === "DELETE" && payload.old_record) {
      const oldRecord = payload.old_record;
      const urlsToDelete = [];

      // Add known cloudinary URL fields (checking both camelCase and snake_case to be safe)
      if (oldRecord.marksheet_12_url) urlsToDelete.push(oldRecord.marksheet_12_url);
      if (oldRecord.marksheet_sem_url) urlsToDelete.push(oldRecord.marksheet_sem_url);
      if (oldRecord.marksheet12Url) urlsToDelete.push(oldRecord.marksheet12Url);
      if (oldRecord.marksheetSemUrl) urlsToDelete.push(oldRecord.marksheetSemUrl);
      
      // Expandable if you add profile photos, etc.
      if (oldRecord.profile_photo_url) urlsToDelete.push(oldRecord.profile_photo_url);
      if (oldRecord.profilePhotoUrl) urlsToDelete.push(oldRecord.profilePhotoUrl);

      console.log(`Found ${urlsToDelete.length} files to delete for record ${oldRecord.id}`);

      // Delete each found URL concurrently
      await Promise.all(urlsToDelete.map(url => deleteFromCloudinary(url)));
    } else {
      console.log("Ignored event type or missing old_record:", payload.type);
    }

    return new Response(JSON.stringify({ status: "success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing Database Webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
