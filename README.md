# MyFlix - Netflix-Style Movie Streaming Platform

A complete, modern movie streaming platform built with Next.js 16, TypeScript, MongoDB, Tailwind CSS, and Framer Motion. Features a full admin dashboard for content management.

## 🚀 Features

### Frontend (User-Facing)
- 🎬 **Netflix-Style UI** - Stunning movie grid layout with hover effects
- 🔍 **Search & Filter** - Find movies by title, genre, rating
- 📺 **Video Player** - YouTube & direct video URL support
- � **Movie Details** - Complete info pages with trailers, cast, ratings
- ⭐ **Featured Movies** - Hero section with dynamic featured content
- 💜 **Beautiful Purple-Pink Theme** - Consistent gradient design throughout
- 📱 **Fully Responsive** - Perfect on all devices
- � **Smooth Animations** - Framer Motion powered transitions

### Admin Dashboard
- 📊 **Analytics Dashboard** - Total movies, users, views, ratings
- ➕ **Add Movies** - Complete form with image upload via Cloudinary
- ✏️ **Edit/Delete** - Full CRUD operations for movie management
- 🔍 **Search Movies** - Quick search through your library
- 📈 **Statistics** - Real-time stats and insights
- � **Featured Control** - Mark movies as featured for homepage

### Technical Features
- ⚡ **Next.js 16** with App Router for optimal performance
- 🗄️ **MongoDB** database with Mongoose ODM
- 🔐 **NextAuth.js** authentication system
- ☁️ **Cloudinary Integration** for media management
- 🎨 **Tailwind CSS v4** with custom gradients
- 💫 **Glass-morphism Effects** and backdrop blur
- � **Dynamic Routes** for movies and watch pages
- 🔥 **API Routes** for all CRUD operations
- ⚡ **Turbopack** enabled for faster development

## 📦 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Media Storage**: Cloudinary
- **Video Player**: Native HTML5 + YouTube embed
- **Icons**: React Icons, Lucide React
- **Font**: Inter (Google Fonts)

## 🛠️ Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Variables** (Already configured in `.env.local`):
```env
MONGODB_URI=mongodb+srv://jaan_007:5UQMGY8jfwOFUCaB@myflixcluster...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkmbdwyxv
CLOUDINARY_API_KEY=547884466328118
CLOUDINARY_API_SECRET=I5qZTjf13c2c-arErhLfrJAb1NQ
NEXTAUTH_SECRET=your-super-secret-nextauth-key
NEXTAUTH_URL=http://localhost:3001
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open in your browser:**
- Frontend: [http://localhost:3001](http://localhost:3001)
- Admin Dashboard: [http://localhost:3001/admin](http://localhost:3001/admin)

## 📁 Project Structure

```
playrix-iptv/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth authentication
│   │   │   ├── movies/              # Movie CRUD operations
│   │   │   └── admin/stats/         # Dashboard statistics
│   │   ├── admin/                   # Admin dashboard
│   │   ├── movie/[id]/              # Movie detail pages
│   │   ├── watch/[id]/              # Video player pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx   # Main admin interface
│   │   │   └── AddMovieModal.tsx    # Add/Edit movie form
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── MovieHero.tsx            # Hero section with featured movie
│   │   ├── MovieSection.tsx         # Movie grid sections
│   │   ├── MovieDetailClient.tsx    # Movie detail page
│   │   ├── WatchClient.tsx          # Video player component
│   │   ├── ComingSoonBanner.tsx     # "Shows coming soon" banner
│   │   └── Footer.tsx               # Footer
│   ├── models/
│   │   ├── Movie.ts                 # Movie schema
│   │   ├── User.ts                  # User schema
│   │   └── Category.ts              # Category schema
│   └── lib/
│       ├── mongodb.ts               # Database connection
│       └── utils.ts                 # Utility functions
├── .env.local                       # Environment variables
└── public/                          # Static assets
```

## 🎨 Key Features Walkthrough

### Homepage
- **Featured Hero**: Dynamic featured movie with play button
- **Movie Sections**: Trending, New Releases, Top Rated
- **Coming Soon Banner**: "TV Shows coming soon" message
- **Responsive Grid**: Netflix-style movie cards

### Movie Detail Page (`/movie/[id]`)
- Full movie information with poster
- Cast, director, genre, rating display
- Play button + Add to list
- Similar movies section

### Watch Page (`/watch/[id]`)
- Full-screen video player
- YouTube embed support
- Direct video URL support
- Movie info below player

### Admin Dashboard (`/admin`)
- **Stats Cards**: Movies, Users, Views, Ratings
- **Movie Management**: Add, Edit, Delete movies
- **Search**: Quick search through movies
- **Add Movie Form**: Complete form with:
  - Title, Description, Director
  - Poster URL (Cloudinary)
  - Video URL (YouTube or direct)
  - Trailer URL
  - Genre tags (multi-select)
  - Cast members (multi-add)
  - Rating, Year, Duration
  - Quality, Language
  - Featured checkbox

## 🎯 How to Use

### Adding Your First Movie

1. Navigate to **http://localhost:3001/admin**
2. Click **"Add Movie"** button
3. Fill in the form:
   - **Poster URL**: Upload image to Cloudinary and paste URL
     - Go to Cloudinary dashboard
     - Upload your poster image
     - Copy the URL
   - **Video URL**: Use YouTube link or direct video URL
     - YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
     - Direct: Any `.mp4` URL
   - Add genres by typing and clicking "Add"
   - Add cast members the same way
   - Set rating (0-10)
   - Check "Featured" to show on homepage
4. Click **"Add Movie"**

### Video URL Formats Supported
- YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- YouTube Short: `https://youtu.be/dQw4w9WgXcQ`
- Direct MP4: `https://example.com/movie.mp4`
- Cloudinary: `https://res.cloudinary.com/.../video.mp4`

### Cloudinary Setup
Your Cloudinary is already configured:
- **Cloud Name**: dkmbdwyxv
- **API Key**: 547884466328118
- Upload images/videos through Cloudinary dashboard
- Copy URLs to use in movie forms

## 🎨 Customization

### Colors
The purple-pink gradient theme is consistent across all components. To customize:
- Gradients use: `from-purple-600 to-pink-600`
- Borders use: `border-purple-500/50`
- Text uses: `text-purple-400`

### Branding
To change "MyFlix" branding:
- `src/components/Navbar.tsx` - Logo text
- `src/components/Footer.tsx` - Footer branding
- `src/app/layout.tsx` - Site metadata

## 🚀 Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
```bash
vercel deploy
```

## �️ Database Schema

### Movie Collection
```typescript
{
  title: string
  description: string
  posterUrl: string
  trailerUrl: string (optional)
  videoUrl: string
  thumbnailUrl: string (optional)
  genre: string[]
  rating: number (0-10)
  year: number
  duration: number (minutes)
  cast: string[]
  director: string
  language: string
  quality: string (HD, 4K, 1080p, 720p)
  views: number
  featured: boolean
  comingSoon: boolean
}
```

### User Collection
```typescript
{
  name: string
  email: string
  password: string (hashed)
  role: 'user' | 'admin'
  subscription: { plan, status, dates }
  watchHistory: []
  favorites: []
}
```

## 🚀 API Endpoints

- `GET /api/movies` - Get all movies (with pagination & search)
- `GET /api/movies/[id]` - Get single movie
- `POST /api/movies` - Create new movie
- `PUT /api/movies/[id]` - Update movie
- `DELETE /api/movies/[id]` - Delete movie
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/auth/[...nextauth]` - Authentication

## 🔮 Future Enhancements

- ✅ TV Shows & Series support
- ✅ User authentication & profiles
- ✅ Watch history tracking
- ✅ Favorites/Watchlist
- ✅ Comments & reviews
- ✅ Advanced search & filters
- ✅ Recommendation engine
- ✅ Subtitles support
- ✅ Multiple video quality options

## 🌐 Social Media

- [Facebook](https://www.facebook.com/people/Playrix-Sky/)
- [Telegram](https://t.me/yourchannel)
- [Instagram](https://www.instagram.com/playrixsky/)
- [TikTok](https://www.tiktok.com/@playrix.sky)

## 📞 Support

For questions or issues:
- **Phone**: +92-303-3996000
- **Email**: contact@playrix.pk

## 📄 License

© 2025 MyFlix. All rights reserved.

---

Built with ❤️ using Next.js 16, MongoDB, Tailwind CSS v4, and Framer Motion
