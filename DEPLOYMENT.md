# BookBee Deployment Guide

## Backend Deployment (Render)

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Connect GitHub**: Link your GitHub repository

3. **Create Web Service**:
   - Choose "Web Service"
   - Connect your repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Deploy**: Click "Create Web Service"

## Frontend Deployment (Vercel)

1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Build**:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=your_render_backend_url
   ```

5. **Deploy**: Click "Deploy"

## Alternative Deployment Options

### Backend Alternatives:
- **Heroku**: Free tier available
- **Railway**: Modern deployment platform
- **AWS EC2**: More control, requires setup

### Frontend Alternatives:
- **Netlify**: Drag-and-drop deployment
- **GitHub Pages**: Free for public repos
- **AWS S3 + CloudFront**: Scalable option

## Database Setup

1. **MongoDB Atlas**:
   - Create free cluster at [mongodb.com](https://mongodb.com)
   - Get connection string
   - Add to backend environment variables

## Post-Deployment

1. **Update API URL**: Change frontend API calls to production backend URL
2. **Test All Features**: Ensure authentication, CRUD operations work
3. **Monitor**: Check logs for any deployment issues

## Production Considerations

- Enable CORS for production domains
- Use environment-specific configurations
- Set up monitoring and logging
- Configure SSL certificates (handled by platforms)
- Set up database backups