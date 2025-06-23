# Lalith Reddy - Portfolio

A modern, minimalistic portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean design with real-time GitHub activity integration and a responsive layout.

## ✨ Features

- **Modern Design**: Clean, minimalistic interface with subtle animations
- **Real-time GitHub Activity**: Live feed of your GitHub contributions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Elegant dark color scheme with purple accents
- **Performance Optimized**: Built with Next.js 15 and optimized for speed
- **TypeScript**: Full type safety throughout the application
- **Blog Integration**: Ready for Sanity CMS blog integration
- **Project Showcase**: Dedicated projects page with detailed views

## 🚀 Live Demo

[Your Portfolio URL Here]

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons
- **Content Management**: Sanity CMS (for blog/projects)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reddy-lalith/portfolio-frontend.git
   cd portfolio-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # GitHub API Configuration
   GITHUB_TOKEN=your_github_token_here
   GITHUB_USERNAME=reddy-lalith
   
   # Sanity Configuration (if using blog/projects)
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_token
   ```

4. **Get GitHub Token**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Generate a new token with `public_repo` and `read:user` permissions
   - Add the token to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Personal Information
Update your personal details in `src/app/page.tsx`:
- Name
- Social media links
- Email address
- Current projects
- University/company information

### Styling
- Colors and themes can be customized in `tailwind.config.ts`
- Main styling is in `src/app/globals.css`
- Component-specific styles are in their respective files

### GitHub Activity
- Configure GitHub username in `.env.local`
- Customize the activity feed in `src/components/GitHubActivity.tsx`
- API endpoint is in `src/app/api/github/route.ts`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── github/
│   │       └── route.ts          # GitHub API endpoint
│   ├── blog/                     # Blog pages
│   ├── projects/                 # Project pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── GitHubActivity.tsx       # GitHub activity feed
│   └── Navigation.tsx           # Navigation component
└── lib/
    └── sanity.client.ts         # Sanity CMS client
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- **Desktop**: 1920px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 320px - 767px

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Lalith Reddy**
- GitHub: [@reddy-lalith](https://github.com/reddy-lalith)
- LinkedIn: [lalithreddy](https://linkedin.com/in/lalithreddy)
- Email: lalith2023@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Content management with [Sanity](https://www.sanity.io/)

---

⭐ If you found this portfolio helpful, please give it a star!
