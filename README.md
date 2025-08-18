# Santa Teresa Directory 🌴

A comprehensive web application for discovering businesses and services in Santa Teresa, Costa Rica. Built with Node.js, Express, SQLite, and vanilla JavaScript with Tailwind CSS.

![Santa Teresa Directory](https://img.shields.io/badge/Status-Ready-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🏖️ Features

### Core Functionality
- **Business Directory**: Browse all local businesses with detailed information
- **Smart Search**: Real-time search with autocomplete suggestions
- **Category Filtering**: Filter businesses by type (restaurants, hotels, surf shops, etc.)
- **Featured Businesses**: Highlight top-rated local favorites
- **Business Details**: Comprehensive business pages with contact info, hours, and descriptions
- **Add Business**: Simple form for new business submissions

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Fast Performance**: Optimized vanilla JavaScript, no heavy frameworks
- **SQLite Database**: Lightweight, reliable data storage
- **RESTful API**: Clean API endpoints for all operations
- **Image Upload**: Support for business photos
- **Search History**: Remember user searches
- **Accessibility**: WCAG compliant with proper semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files, navigate to the directory
   cd santa-teresa-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

That's it! The application will be running with sample data.

## 📁 Project Structure

```
santa-teresa-directory/
├── server.js                 # Express server configuration
├── package.json              # Dependencies and scripts
├── database/
│   ├── init.sql             # Database schema and sample data
│   └── santa-teresa.db      # SQLite database file (created after init)
├── routes/
│   ├── businesses.js        # Business API endpoints
│   └── categories.js        # Category API endpoints
├── scripts/
│   └── init-db.js          # Database initialization script
├── public/
│   ├── index.html          # Homepage
│   ├── business-detail.html # Business detail page
│   ├── add-business.html   # Add business form
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   ├── search.js       # Search features
│   │   └── business-form.js # Form handling
│   └── images/             # Uploaded business images
└── README.md               # This file
```

## 🔧 API Endpoints

### Businesses
- `GET /api/businesses` - List all businesses
  - Query params: `category`, `search`, `featured`
- `GET /api/businesses/:id` - Get single business
- `POST /api/businesses` - Add new business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/with-counts` - Categories with business counts
- `POST /api/categories` - Add new category

### Uploads
- `POST /api/upload` - Upload business image

## 🎨 Customization

### Adding New Categories
1. Add to the database:
   ```sql
   INSERT INTO categories (name, icon) VALUES ('New Category', '🏷️');
   ```
2. Or use the API:
   ```javascript
   POST /api/categories
   {
     "name": "New Category",
     "icon": "🏷️"
   }
   ```

### Styling
- Edit `/public/css/style.css` for custom styles
- Tailwind CSS classes are used throughout the HTML
- Color scheme uses Costa Rica/beach theme:
  - Ocean Blue: `#0ea5e9`
  - Palm Green: `#16a34a`
  - Sand: `#fbbf24`
  - Sunset: `#f97316`

### Sample Data
The application comes with sample businesses including:
- **Restaurants**: Ylang Ylang Restaurant, Soda Típica Tica
- **Hotels**: Casa Corcovado, Latitude 10 Resort, Nautilus
- **Surf Shops**: Playa Carmen Surf Shop, Witch's Rock Surf Camp
- **Cafes**: The Bakery
- **Tours**: Santa Teresa Adventure Tours
- **Beach Bars**: Kika Beach Bar

## 🛠️ Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run init-db    # Initialize/reset database
```

### Database Management
The SQLite database is located at `database/santa-teresa.db`. You can:
- View with any SQLite browser
- Reset by deleting the file and running `npm run init-db`
- Backup by copying the file

### Adding Features
1. **New API endpoints**: Add to `/routes/` directory
2. **Frontend features**: Add to `/public/js/` directory
3. **Styling**: Update `/public/css/style.css`
4. **Database changes**: Update `/database/init.sql`

## 🌐 Deployment

### Local Network Access
To access from other devices on your network:
```bash
# Find your IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# Start server on all interfaces
PORT=3000 node server.js
# Access via http://YOUR_IP:3000
```

### Production Deployment
1. **Environment Variables**:
   ```bash
   PORT=3000
   NODE_ENV=production
   ```

2. **Process Manager** (recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js --name santa-teresa-directory
   ```

3. **Reverse Proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add comments for complex logic
- Ensure mobile responsiveness
- Test on different screen sizes

## 📱 Mobile Features

- Touch-friendly interface
- Responsive grid layouts
- Mobile-optimized search
- Click-to-call phone numbers
- Swipe-friendly navigation
- Fast loading on mobile networks

## 🔒 Security Notes

- Input validation on all forms
- SQL injection prevention with parameterized queries
- File upload restrictions (size, type)
- CORS enabled for cross-origin requests
- No authentication required (public directory)

## 🐛 Troubleshooting

### Common Issues

**Database not found**:
```bash
npm run init-db
```

**Port already in use**:
```bash
PORT=3001 npm start
```

**Images not uploading**:
- Check `public/images/` directory exists and is writable
- Verify file size under 5MB
- Ensure file is valid image format

**Search not working**:
- Check browser console for JavaScript errors
- Verify API endpoints are responding
- Clear browser cache

### Logs
Server logs will show in the terminal. For production, consider using a logging service.

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🌟 Credits

- Built for the Santa Teresa, Costa Rica community
- Icons from system emojis
- Styling with Tailwind CSS
- Database with SQLite

---

**Made with ❤️ for Santa Teresa** 🏄‍♂️🌊

For questions or support, please create an issue in the repository.