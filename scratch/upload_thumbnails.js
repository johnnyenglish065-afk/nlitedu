const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const cloudName = getEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') || 'dx1ywq1pi';
const uploadPreset = getEnvVar('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET') || 'nlitedu_uploads';

if (!supabaseKey) {
  console.error("No Supabase key found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const courseFiles = [
  {
    slug: 'data-analytics-package',
    filename: 'Data Analytics Package.png'
  },
  {
    slug: 'full-stack-web-development-package',
    filename: 'Full-Stack Web Development Package.png'
  },
  {
    slug: 'full-stack-using-ai-web-development',
    filename: 'Full Stack Using AI Web Development.png'
  },
  {
    slug: 'front-end-development-package',
    filename: 'Front End Development Package.png'
  },
  {
    slug: 'autocad-revit-drafting-bim-package',
    filename: 'AutoCAD + Revit Drafting & BIM Package.png'
  },
  {
    slug: 'video-editing-basic-to-advance',
    filename: 'Video Editing (Basic to Advance).png'
  }
];

const pathsToTry = [
  'C:\\Users\\ASUS\\Downloads\\thumbnai;\\',
  'C:\\Users\\ASUS\\Downloads\\thumbnail\\',
  'C:\\Users\\ASUS\\Downloads\\'
];

async function uploadToCloudinary(base64Data, filename) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: `data:image/png;base64,${base64Data}`,
      upload_preset: uploadPreset,
      public_id: `course_thumbnails/${filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}`
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

async function main() {
  console.log("Starting Cloudinary Uploads...");
  
  for (const item of courseFiles) {
    let fileContent = null;
    let foundPath = null;
    
    for (const prefix of pathsToTry) {
      const fullPath = path.join(prefix, item.filename);
      if (fs.existsSync(fullPath)) {
        fileContent = fs.readFileSync(fullPath);
        foundPath = fullPath;
        break;
      }
    }
    
    if (!fileContent) {
      console.error(`❌ Could not find file for: ${item.filename}`);
      continue;
    }
    
    console.log(`Found file at: ${foundPath}`);
    const base64Data = fileContent.toString('base64');
    
    try {
      console.log(`Uploading ${item.filename} to Cloudinary...`);
      const secureUrl = await uploadToCloudinary(base64Data, item.filename);
      console.log(`✅ Uploaded successfully. URL: ${secureUrl}`);
      
      console.log(`Updating Supabase for course slug: ${item.slug}...`);
      const { data, error } = await supabase
        .from('courses')
        .update({ image_url: secureUrl })
        .eq('slug', item.slug)
        .select();
        
      if (error) {
        console.error(`❌ Database update failed for ${item.slug}:`, error.message);
      } else {
        console.log(`✅ Database updated successfully for ${item.slug}!`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${item.filename}:`, err.message);
    }
  }
}

main().catch(console.error);
