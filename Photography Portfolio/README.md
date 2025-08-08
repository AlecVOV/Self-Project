# Photography Portfolio - Content Management Guide

This guide will help you modify and manage the content of your photography portfolio website.

## Quick Setup

Install dependencies and start development server:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see your changes in real-time.

## 🖼️ Hero Section Images

**Location:** `components/Home/HeroSlider.vue`

The hero slider displays 3 rotating images. To modify them:

1. Open `components/Home/HeroSlider.vue`
2. Find the `slides` array (around line 45)
3. Replace the image URLs in the `image` property:

```javascript
const slides = [
  {
    id: 1,
    image: 'YOUR_NEW_IMAGE_URL_HERE',
    alt: 'Description of your image'
  },
  {
    id: 2,
    image: 'YOUR_NEW_IMAGE_URL_HERE',
    alt: 'Description of your image'
  },
  {
    id: 3,
    image: 'YOUR_NEW_IMAGE_URL_HERE',
    alt: 'Description of your image'
  }
];
```

**Tips:**
- Use high-quality images (1920x1080 or larger)
- Optimize images for web (use tools like TinyPNG)
- Consider using a CDN or image hosting service

## 🎨 Featured Work Section (Index Page)

**Location:** `components/Home/FeaturedWork.vue`

To modify the 3 featured work images on the homepage:

1. Open `components/Home/FeaturedWork.vue`
2. Find the `featuredWork` array (around line 65)
3. Update the images and details:

```javascript
const featuredWork = [
  {
    id: 1,
    title: 'Your Work Title',
    category: 'landscape', // or 'wedding', 'portrait', etc.
    image: 'YOUR_NEW_IMAGE_URL_HERE'
  },
  // ... repeat for other items
];
```

## 📸 Portfolio Gallery Images

**Location:** `components/Portfolio/PortfolioGrid.vue`

The portfolio grid gets its images from the `photos` prop passed from parent pages. To modify portfolio images:

### For Main Portfolio Page
**Location:** `pages/portfolio/index.vue`

1. Open the portfolio index page
2. Look for the photos data (usually in a `photos` array or imported from a data file)
3. Update the image URLs and metadata

### For Category-Specific Pages
**Location:** `pages/portfolio/[category].vue`

1. Open the dynamic category page
2. Find the photos data for each category
3. Update images for specific categories (wedding, portrait, landscape, etc.)

**Example structure:**
```javascript
const photos = [
  {
    id: 1,
    title: 'Photo Title',
    category: 'wedding',
    image: 'YOUR_IMAGE_URL_HERE'
  },
  // ... more photos
];
```

## 📝 Blog Management

### Adding a New Blog Post

**Location:** `pages/blog/index.vue` and `pages/blog/[slug].vue`

1. **Add to Blog List** (`pages/blog/index.vue`):
   - Find the `blogPosts` array (around line 25)
   - Add a new blog post object:

```javascript
{
  id: 7, // increment the ID
  title: 'Your New Blog Post Title',
  slug: 'your-new-blog-post-slug', // URL-friendly version
  date: '2024-01-15', // YYYY-MM-DD format
  image: 'YOUR_FEATURED_IMAGE_URL',
  category: 'Wedding', // or 'Technique', 'Equipment', etc.
  excerpt: 'Brief description of your blog post...'
}
```

2. **Add Full Content** (`pages/blog/[slug].vue`):
   - Find the `blogPosts` array (around line 30)
   - Add the same post with additional content fields:

```javascript
{
  id: 7,
  title: 'Your New Blog Post Title',
  slug: 'your-new-blog-post-slug',
  date: '2024-01-15',
  image: 'YOUR_FEATURED_IMAGE_URL',
  category: 'Wedding',
  excerpt: 'Brief description...',
  content: 'First paragraph of your blog post...',
  contentImage1: 'URL_FOR_FIRST_CONTENT_IMAGE',
  caption1: 'Caption for first image',
  content2: 'Second paragraph...',
  contentImage2: 'URL_FOR_SECOND_CONTENT_IMAGE',
  caption2: 'Caption for second image',
  content3: 'Final paragraph...'
}
```

### Deleting a Blog Post

1. Remove the post object from both arrays in:
   - `pages/blog/index.vue`
   - `pages/blog/[slug].vue`

### Modifying Existing Blog Posts

1. Find the post by its `id` in both files
2. Update any fields (title, content, images, etc.)
3. Keep the `slug` consistent between both files

## 🖼️ Other Image Locations

### Bottom Section Image (Index Page)
**Location:** `pages/index.vue` (around line 85)

```html
<img 
  src="YOUR_NEW_IMAGE_URL_HERE" 
  alt="Beautiful portrait photography" 
  class="w-full h-auto rounded-sm shadow-lg"
/>
```

### Author Photo (Blog Posts)
**Location:** `pages/blog/[slug].vue` (around line 35)

```html
<img 
  src="YOUR_AUTHOR_PHOTO_URL" 
  alt="Author photo" 
  class="w-12 h-12 rounded-full mr-4 object-cover"
/>
```

## 📁 Image Hosting Options

### Option 1: Local Storage (Simple)
Store images in your project's `public/` folder:
```
public/
  images/
    hero/
      hero-1.jpg
      hero-2.jpg
    portfolio/
      wedding-1.jpg
      portrait-1.jpg
    blog/
      post-1.jpg
```
Reference as: `/images/hero/hero-1.jpg`

### Option 2: Cloudinary (With File Size Considerations)

**⚠️ Cloudinary Free Plan Limits:**
- **Image files:** 10MB maximum
- **RAW files:** 10MB maximum (often too small for photography)
- **Monthly bandwidth:** 25GB

**Solutions for Large Photography Files:**

#### **Solution 1: Pre-process Images (Recommended)**
Optimize images before uploading to Cloudinary:

1. **Use Adobe Lightroom/Photoshop:**
   - Export JPEG at 85-90% quality
   - Resize to max 4000px on longest side
   - Usually results in 2-8MB files

2. **Use Free Tools:**
   ```bash
   # ImageMagick (command line)
   magick input.jpg -quality 85 -resize 4000x4000> output.jpg
   
   # Or use online tools like:
   # - TinyPNG.com
   # - Squoosh.app (Google)
   # - Photopea.com (free Photoshop alternative)
   ```

3. **Batch Processing Script:**
   ```bash
   # Process all images in a folder
   for img in *.jpg; do
     magick "$img" -quality 85 -resize 4000x4000> "web_$img"
   done
   ```

#### **Solution 2: Hybrid Approach**
- **Small/medium images:** Cloudinary (under 10MB)
- **Large images:** Alternative hosting

#### **Solution 3: Cloudinary Paid Plan**
- **Plus Plan:** $89/month, 100MB file limit
- **Advanced Plan:** $224/month, 300MB file limit

**Cloudinary Setup (for processed images):**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Upload your optimized images
3. Use optimized URLs:
```javascript
// Auto-optimized image with CDN delivery
const imageUrl = 'https://res.cloudinary.com/your-cloud/image/upload/c_fill,w_1200,h_800,q_auto,f_auto/your-image.jpg'
```

### Option 3: GitHub + CDN (Free)
1. Create a separate GitHub repo for images
2. Upload images to the repo
3. Use jsDelivr CDN:
```javascript
const imageUrl = 'https://cdn.jsdelivr.net/gh/username/portfolio-images@main/hero/image.jpg'
```

### Option 4: Large File Alternatives (For 10MB+ Images)

#### **ImageKit.io** (Better free limits)
- **Free tier:** 20GB storage, 20GB bandwidth
- **File size limit:** 25MB (better than Cloudinary)
- **Built-in optimization**
```javascript
const imageUrl = 'https://ik.imagekit.io/your-id/image.jpg?tr=w-1200,h-800,q-80'
```

#### **Bunny CDN** (Cost-effective)
- **Storage:** $0.01/GB/month
- **Bandwidth:** $0.01-0.05/GB
- **No file size limits**
- **Global CDN**

#### **AWS S3 + CloudFront** (Professional)
- **Very cheap** for storage
- **No file size limits**
- **Requires technical setup**
```javascript
const imageUrl = 'https://your-cloudfront-domain.com/images/photo.jpg'
```

#### **GitHub LFS + jsDelivr** (Free for smaller projects)
- **Git Large File Storage** for big files
- **Free up to 1GB storage**
- **Served via jsDelivr CDN**
```bash
# Setup Git LFS
git lfs track "*.jpg"
git lfs track "*.png"
git add .gitattributes
```

### Option 5: Imgur (Quick Testing)
1. Upload to [imgur.com](https://imgur.com)
2. Get direct image link
3. Use in your code:
```javascript
const imageUrl = 'https://i.imgur.com/ABC123.jpg'
```

### Option 5: Docker-Based Self-Hosting (⚠️ Adds Backend Complexity)

#### **PhotoPrism** (Full backend solution)
**Note: PhotoPrism IS a backend application with database - this changes your simple static site!**

PhotoPrism includes:
- ✅ **Built-in database** (MariaDB/MySQL)
- ✅ **Web server** and API
- ✅ **Image processing** and optimization
- ✅ **Admin interface** for managing photos
- ❌ **Requires server hosting** (not static anymore)
- ❌ **Need to maintain** database and updates

```bash
# docker-compose.yml - Full backend stack
version: '3.5'
services:
  photoprism:
    image: photoprism/photoprism:latest
    ports:
      - "2342:2342"
    environment:
      PHOTOPRISM_ADMIN_PASSWORD: "your-password"
      PHOTOPRISM_SITE_URL: "http://localhost:2342/"
    volumes:
      - "./photos:/photoprism/originals"
      - "./storage:/photoprism/storage"
```
Access images via: `http://your-domain:2342/api/v1/t/[token]/[size]/[hash]`

**Hosting Requirements:**
- VPS/Cloud server (DigitalOcean, AWS, etc.)
- Domain name pointing to your server
- SSL certificate setup
- Regular backups and maintenance

#### **Piwigo** (Gallery-focused)
Professional photo gallery with API:
```bash
docker run -d \
  --name piwigo \
  -p 8080:80 \
  -v piwigo_data:/var/www/html \
  linuxserver/piwigo
```

#### **MinIO + Custom Image Server**
S3-compatible storage with custom optimization:
```bash
# docker-compose.yml
version: '3.7'
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password123
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
  
  image-proxy:
    image: willnorris/imageproxy
    ports:
      - "8080:8080"
    command: -addr 0.0.0.0:8080 -cache memory:100mb
```

#### **Nginx + Image Processing**
Simple static file server with on-the-fly optimization:
```dockerfile
# Dockerfile
FROM nginx:alpine
RUN apk add --no-cache imagemagick
COPY nginx.conf /etc/nginx/nginx.conf
COPY images/ /usr/share/nginx/html/images/
```

```nginx
# nginx.conf with image optimization
location ~* ^/images/(.+)$ {
    set $width 800;
    set $height 600;
    if ($arg_w) { set $width $arg_w; }
    if ($arg_h) { set $height $arg_h; }
    
    try_files $uri @resize;
}

location @resize {
    # Image resizing logic here
}
```

### ❌ Not Recommended: Google Photos
While technically possible, Google Photos isn't designed for web hosting and may:
- Break links unexpectedly
- Violate terms of service
- Lack CDN optimization
- Have slow loading times

## 📁 File Organization Tips

1. **Choose one hosting method** and stick with it for consistency
2. **Optimize images** before uploading (use tools like TinyPNG)
3. **Use descriptive filenames** (e.g., `wedding-couple-sunset.jpg`)
4. **Backup**: Always backup your content before making changes
5. **Testing**: Test changes in development mode before deploying

## � Deocker-Based Image Hosting Setup

### Quick Start: PhotoPrism (Best for Photographers)

1. **Create docker-compose.yml:**
```yaml
version: '3.5'
services:
  photoprism:
    image: photoprism/photoprism:latest
    depends_on:
      - mariadb
    restart: unless-stopped
    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined
    ports:
      - "2342:2342"
    environment:
      PHOTOPRISM_ADMIN_PASSWORD: "your-secure-password"
      PHOTOPRISM_SITE_URL: "http://localhost:2342/"
      PHOTOPRISM_ORIGINALS_LIMIT: 5000
      PHOTOPRISM_HTTP_COMPRESSION: "gzip"
      PHOTOPRISM_DATABASE_DRIVER: "mysql"
      PHOTOPRISM_DATABASE_SERVER: "mariadb:3306"
      PHOTOPRISM_DATABASE_NAME: "photoprism"
      PHOTOPRISM_DATABASE_USER: "photoprism"
      PHOTOPRISM_DATABASE_PASSWORD: "insecure"
    working_dir: "/photoprism"
    volumes:
      - "~/Pictures:/photoprism/originals"
      - "./storage:/photoprism/storage"

  mariadb:
    restart: unless-stopped
    image: mariadb:10.9
    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined
    command: mysqld --innodb-buffer-pool-size=512M --transaction-isolation=READ-COMMITTED --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --max-connections=512 --innodb-rollback-on-timeout=OFF --innodb-lock-wait-timeout=120
    volumes:
      - "./database:/var/lib/mysql"
    environment:
      MYSQL_ROOT_PASSWORD: insecure
      MYSQL_DATABASE: photoprism
      MYSQL_USER: photoprism
      MYSQL_PASSWORD: insecure
```

2. **Start the services:**
```bash
docker-compose up -d
```

3. **Access PhotoPrism:** http://localhost:2342

4. **Get image URLs:**
```javascript
// PhotoPrism API endpoint for optimized images
const imageUrl = `http://your-domain:2342/api/v1/t/${token}/${size}/${hash}`
```

### Alternative: Simple Nginx + ImageMagick

1. **Create Dockerfile:**
```dockerfile
FROM nginx:alpine

# Install ImageMagick for image processing
RUN apk add --no-cache imagemagick

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your images
COPY images/ /usr/share/nginx/html/images/

EXPOSE 80
```

2. **Create nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Enable gzip compression
    gzip on;
    gzip_types image/jpeg image/png image/webp;

    server {
        listen 80;
        
        # Serve original images
        location /images/ {
            root /usr/share/nginx/html;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Serve resized images
        location ~ ^/images/resize/(\d+)x(\d+)/(.+)$ {
            set $width $1;
            set $height $2;
            set $image $3;
            
            # This would need additional configuration for actual resizing
            try_files /images/$image @resize;
        }
    }
}
```

3. **Build and run:**
```bash
docker build -t my-image-server .
docker run -d -p 8080:80 my-image-server
```

### Using with Your Portfolio

Once you have a Docker image server running, update your image URLs:

```javascript
// In your Vue components
const slides = [
  {
    id: 1,
    image: 'http://your-docker-host:2342/api/v1/t/token/1200x800/image-hash',
    alt: 'Your image description'
  }
];
```

## 🚀 Static Site Deployment (No Backend Needed!)

Your portfolio is a **static site** - it doesn't need a backend server! This makes deployment simple and cost-effective.

### Recommended Static Hosting (Free Options)

#### **Netlify** (Easiest)
1. Connect your GitHub repo to Netlify
2. Build command: `npm run generate`
3. Publish directory: `dist`
4. Auto-deploys on git push
5. **Free custom domain** and SSL

#### **Vercel** (Great for Nuxt)
1. Import your GitHub repo
2. Vercel auto-detects Nuxt settings
3. **Zero configuration** needed
4. **Free custom domain** and global CDN

#### **GitHub Pages** (Free)
1. Enable GitHub Pages in repo settings
2. Use GitHub Actions for auto-deployment:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Build Commands for Static Deployment

```bash
# Generate static files
npm run generate

# Preview the generated site
npm run preview
```

### When You DON'T Need a Backend

Your current portfolio works perfectly without a backend because:
- ✅ **Images** are hosted externally (URLs in code)
- ✅ **Blog posts** are stored in JavaScript arrays
- ✅ **Portfolio items** are hardcoded data
- ✅ **No user authentication** needed
- ✅ **No database** required
- ✅ **No server-side processing**

### When You MIGHT Want a Backend

Consider adding a backend only if you need:
- 📝 **Content Management System** (CMS) for easy editing
- 📧 **Contact form** that sends emails
- 💬 **Comments** on blog posts
- 👤 **User accounts** or admin panel
- 📊 **Analytics** beyond Google Analytics
- 🔍 **Search functionality**

### Simple Backend Options (If Needed Later)

#### **Headless CMS** (No server management)
- **Strapi Cloud** - Free tier available
- **Contentful** - Easy content management
- **Sanity** - Real-time collaboration

#### **Serverless Functions** (For contact forms)
- **Netlify Functions** - Built into Netlify
- **Vercel Functions** - Built into Vercel
- **Cloudflare Workers** - Global edge computing

### Current Deployment Recommendation

For your portfolio right now:
1. **Use Netlify or Vercel** (both free)
2. **Keep images external** (Cloudinary/Imgur)
3. **Edit content directly in code**
4. **Deploy automatically** on git push

This gives you:
- 🚀 **Fast loading** (global CDN)
- 💰 **Zero hosting costs**
- 🔒 **Automatic HTTPS**
- 📱 **Mobile optimized**
- ⚡ **No server maintenance**

## 🤔 Static vs Backend: Which Should You Choose?

### Keep It Static (Recommended for Most Portfolios)

**Best for:** Simple portfolio showcasing your work

**Image Hosting Options:**
- **Cloudinary** (free tier + CDN)
- **Imgur** (free, simple)
- **GitHub + jsDelivr CDN** (free)
- **Local files** in `public/` folder

**Pros:**
- ✅ **Free hosting** (Netlify/Vercel)
- ✅ **Zero maintenance**
- ✅ **Lightning fast**
- ✅ **No technical complexity**
- ✅ **Deploy with git push**

**Cons:**
- ❌ **Manual content updates** (edit code)
- ❌ **No admin interface**

### Add Backend (PhotoPrism/CMS)

**Best for:** Frequently updated portfolios or client galleries

**What You Get:**
- ✅ **Easy content management**
- ✅ **Admin interface**
- ✅ **Image optimization**
- ✅ **Professional features**

**What You Need:**
- 💰 **VPS hosting** ($5-20/month)
- 🔧 **Server maintenance**
- 📚 **Technical knowledge**
- ⏰ **Setup time**

### My Recommendation for You:

**Start Static!** Here's why:
1. Your portfolio works perfectly as-is
2. You can always add a backend later
3. Free hosting saves money
4. Less complexity = fewer problems
5. Focus on photography, not server management

**Upgrade to Backend Later If:**
- You're updating content weekly
- You want client galleries
- You need user accounts
- You want advanced features

### Quick Start: Stay Static with Better Image Hosting

Instead of PhotoPrism, try **Cloudinary** (free tier):
1. Upload images to Cloudinary
2. Get optimized URLs
3. Replace URLs in your code
4. Deploy to Netlify/Vercel

**Result:** Professional image delivery without backend complexity!

## 📸 Recommended Workflow for Large Photography Files

### For Most Photographers (Recommended):

1. **Process RAW files** in Lightroom/Photoshop
2. **Export web versions:**
   - Format: JPEG
   - Quality: 85-90%
   - Size: 4000px max width/height
   - Color space: sRGB
   - Result: Usually 2-8MB files

3. **Upload to ImageKit.io** (25MB limit, better than Cloudinary)
4. **Use optimized URLs** in your portfolio
5. **Deploy static site** to Netlify/Vercel

### Alternative: Two-Tier System

**For portfolio display:**
- Use compressed web versions (under 10MB)
- Host on Cloudinary/ImageKit

**For client downloads/full resolution:**
- Use Google Drive, Dropbox, or WeTransfer
- Link to full-res versions when needed

### Quick Image Optimization Tools:

**Online (Free):**
- **Squoosh.app** - Google's image optimizer
- **TinyPNG.com** - Smart compression
- **Photopea.com** - Free Photoshop alternative

**Desktop:**
- **Adobe Lightroom** - Professional workflow
- **GIMP** - Free alternative
- **ImageOptim** (Mac) - Drag & drop optimization

**Windows Built-in Tools:**

#### **Paint (Basic resizing)**
1. Right-click image → "Edit with Paint"
2. Click "Resize" button
3. Choose "Pixels" and uncheck "Maintain aspect ratio"
4. Set max dimension to 4000px
5. Save as JPEG
**Limitation:** No quality control, basic compression only

#### **Photos App (Better option)**
1. Open image in Windows Photos app
2. Click "..." → "Resize"
3. Choose "Custom" 
4. Set dimensions (e.g., 4000x3000)
5. Save copy
**Limitation:** Limited quality settings

#### **PowerShell Script (Advanced)**
Create a `.ps1` file for batch processing:
```powershell
# resize-images.ps1
Add-Type -AssemblyName System.Drawing

$sourceFolder = "C:\YourPhotos"
$outputFolder = "C:\YourPhotos\Web"

Get-ChildItem $sourceFolder -Filter "*.jpg" | ForEach-Object {
    $image = [System.Drawing.Image]::FromFile($_.FullName)
    $newWidth = 4000
    $newHeight = [int]($image.Height * $newWidth / $image.Width)
    
    $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
    
    $outputPath = Join-Path $outputFolder ("web_" + $_.Name)
    $newImage.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $image.Dispose()
    $newImage.Dispose()
    $graphics.Dispose()
}
```

**Better Free Windows Apps:**
- **GIMP** - Full-featured, like Photoshop
- **Paint.NET** - Lightweight with plugins
- **IrfanView** - Fast batch processing
- **XnConvert** - Excellent batch converter

**Command Line (ImageMagick):**
```bash
# Install ImageMagick via Chocolatey
choco install imagemagick

# Or download from: https://imagemagick.org/script/download.php#windows

# Optimize single image
magick input.jpg -quality 85 -resize 4000x4000> -strip output.jpg

# Batch process folder (PowerShell)
Get-ChildItem *.jpg | ForEach-Object { magick $_.Name -quality 85 -resize 4000x4000> -strip "web_$($_.Name)" }
```

### 🪟 Windows Image Processing Comparison

| Tool | Built-in? | Batch Process | Quality Control | Ease of Use |
|------|-----------|---------------|-----------------|-------------|
| **Paint** | ✅ Yes | ❌ No | ❌ Basic | ⭐⭐⭐⭐⭐ |
| **Photos App** | ✅ Yes | ❌ No | ⚠️ Limited | ⭐⭐⭐⭐ |
| **PowerShell** | ✅ Yes | ✅ Yes | ⚠️ Limited | ⭐⭐ |
| **GIMP** | ❌ Free Download | ✅ Yes | ✅ Full | ⭐⭐ |
| **Paint.NET** | ❌ Free Download | ⚠️ With plugins | ✅ Good | ⭐⭐⭐ |
| **IrfanView** | ❌ Free Download | ✅ Excellent | ✅ Good | ⭐⭐⭐⭐ |
| **ImageMagick** | ❌ Free Download | ✅ Excellent | ✅ Full | ⭐⭐ |

### 🎯 Quick Recommendation for Windows Users:

**For Single Images:** Use **Photos App** (built-in, easy)
**For Batch Processing:** Download **IrfanView** (free, powerful, user-friendly)

#### **IrfanView Batch Setup:**
1. Download from [irfanview.com](https://www.irfanview.com/)
2. Open IrfanView → File → Batch Conversion
3. Set output format to JPEG
4. Click "Advanced" → set quality to 85
5. Check "Resize" → set max dimension to 4000px
6. Process entire folders at once!

This approach gives you professional image delivery while staying within free hosting limits!

## 📋 Content Checklist

Before going live, ensure you've updated:
- [ ] Hero slider images (3 images)
- [ ] Featured work images (3 images)
- [ ] Portfolio gallery images (all categories)
- [ ] Blog post content and images
- [ ] Author information and photo
- [ ] Site title and meta descriptions
- [ ] Favicon (`public/favicon.png`)

## 🔧 Technical Notes

- Images are loaded from external URLs (Pexels in examples)
- The site uses Nuxt 3 with Vue 3 composition API
- Styling is done with Tailwind CSS
- Animations use @vueuse/motion
- Blog content is stored in JavaScript arrays (consider moving to a CMS for easier management)

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Ensure image URLs are accessible
3. Verify JavaScript syntax in modified files
4. Test in development mode first

---

**Remember:** Always test your changes in development mode (`npm run dev`) before building for production!
