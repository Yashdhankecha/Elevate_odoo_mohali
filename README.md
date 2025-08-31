# 🚀 Elevate - Comprehensive Placement Tracker Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-8.0+-orange?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.3+-cyan?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</div>

## 📹 Preview Video
🎥 **[Watch Demo Video]** -  https://drive.google.com/drive/folders/1JtYBU8BUwuodFChIFrsziQ1qcTMgCsY_?usp=sharing

---

## 🎯 Overview

**Elevate** is a comprehensive placement tracking platform that revolutionizes the recruitment process by connecting students, companies, and Training & Placement Officers (TPOs) in a unified ecosystem. Built with modern technologies, it provides real-time tracking, advanced analytics, and seamless communication for all stakeholders.

## ✨ Key Features

### 🔐 **Multi-Role Authentication System**
- **Role-based Registration**: Dynamic signup forms based on user type
- **Three User Types**: Student, Company, and TPO with distinct permissions
- **Email OTP Verification**: Secure account verification process
- **JWT Authentication**: Token-based secure authentication
- **Password Management**: Forgot password and reset functionality

### 👨‍🎓 **Student Portal**
- **Comprehensive Profile Management**: Academic details, skills, projects, certifications
- **Placement Tracking**: Real-time application status and interview progress
- **Resume Builder**: Professional resume creation and management
- **Skill Assessment**: Track technical and soft skills with proficiency levels
- **Internship Applications**: Browse and apply for internship opportunities
- **Dashboard Analytics**: Profile completion, application statistics, placement status

### 🏢 **Company Portal**
- **Job Management**: Create, edit, and manage job postings
- **Interview Scheduling**: Schedule and manage candidate interviews
- **Application Tracking**: Review applications with status updates
- **Candidate Analytics**: Detailed candidate profiles and performance metrics
- **Dashboard Insights**: Real-time statistics and performance analytics
- **Company Profile**: Manage company information and branding

### 👨‍🏫 **TPO (Training & Placement Officer) Portal**
- **Institute Management**: Comprehensive student and company oversight
- **Placement Analytics**: Branch-wise statistics and performance tracking
- **Internship Management**: Create and manage internship opportunities
- **Student Verification**: Profile approval and verification system
- **Reporting Tools**: Generate detailed placement reports
- **Company Relations**: Manage company partnerships and relationships

### 📊 **Advanced Analytics & Reporting**
- **Real-time Dashboards**: Live statistics and performance metrics
- **Branch-wise Analytics**: Detailed analysis by academic branches
- **Placement Statistics**: Success rates, package analysis, company distribution
- **Export Functionality**: PDF and Excel report generation
- **Performance Tracking**: Student and company performance monitoring

## 🛠️ Technology Stack

### **Frontend**
- **React.js 18.2.0** - Modern UI framework with hooks
- **TailwindCSS 3.3.6** - Utility-first CSS framework
- **React Router 6.20.1** - Client-side routing
- **React Hot Toast 2.4.1** - Notification system
- **React Icons 4.12.0** - Comprehensive icon library
- **Recharts 2.7.2** - Data visualization charts
- **Axios 1.6.2** - HTTP client for API communication

### **Backend**
- **Node.js 18+** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB 8.0.3** - NoSQL database with Mongoose ODM
- **JWT 9.0.2** - JSON Web Token authentication
- **Bcryptjs 2.4.3** - Password hashing and security
- **Nodemailer 6.9.7** - Email service integration
- **Express Validator 7.0.1** - Input validation middleware

### **Development Tools**
- **Nodemon 3.0.2** - Development server with auto-restart
- **Concurrently 8.2.2** - Run multiple commands simultaneously
- **PostCSS & Autoprefixer** - CSS processing and optimization

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Elevate_odoo_mohali
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cd server
   cp env.example .env
   ```
   
   Update `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/elevate-placement-tracker
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Elevate_odoo_mohali/
├── client/                          # React Frontend
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.js           # Navigation component
│   │   │   ├── PrivateRoute.js     # Route protection
│   │   │   └── RoleBasedRoute.js   # Role-based routing
│   │   ├── contexts/               # React contexts
│   │   │   ├── AuthContext.js      # Authentication context
│   │   │   └── NotificationContext.js # Notifications
│   │   ├── pages/                  # Page components
│   │   │   ├── student/           # Student dashboard pages
│   │   │   ├── company/           # Company dashboard pages
│   │   │   ├── tpo/               # TPO dashboard pages
│   │   │   └── superadmin/        # Super admin pages
│   │   ├── services/              # API services
│   │   │   ├── studentApi.js      # Student API calls
│   │   │   ├── companyApi.js      # Company API calls
│   │   │   ├── tpoApi.js          # TPO API calls
│   │   │   └── superadminApi.js   # Super admin API calls
│   │   └── utils/                 # Utility functions
│   └── package.json
├── server/                         # Node.js Backend
│   ├── models/                    # Database models
│   │   ├── User.js               # User model with role-based data
│   │   ├── Student.js            # Student-specific model
│   │   ├── Company.js            # Company model
│   │   ├── TPO.js                # TPO model
│   │   ├── JobPosting.js         # Job posting model
│   │   ├── Application.js        # Application model
│   │   └── Interview.js          # Interview model
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication routes
│   │   ├── student.js            # Student API routes
│   │   ├── company.js            # Company API routes
│   │   ├── tpo.js                # TPO API routes
│   │   └── superadmin.js         # Super admin routes
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # Authentication middleware
│   │   └── tpoInstituteAccess.js # TPO access control
│   ├── utils/                    # Utility functions
│   │   └── emailService.js       # Email service
│   └── package.json
├── seeds/                        # Database seeding scripts
├── docs/                         # Documentation files
└── README.md
```

## 🔐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

### **Student Endpoints**
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/internship-offers` - Get internship offers
- `POST /api/student/internship-offers/:id/apply` - Apply for internship
- `GET /api/student/applications` - Get student applications

### **Company Endpoints**
- `GET /api/company/dashboard/stats` - Get dashboard statistics
- `GET /api/company/jobs` - Get company jobs
- `POST /api/company/jobs` - Create new job
- `PUT /api/company/jobs/:id` - Update job
- `DELETE /api/company/jobs/:id` - Delete job
- `GET /api/company/applications` - Get job applications
- `GET /api/company/interviews` - Get interviews

### **TPO Endpoints**
- `GET /api/tpo/dashboard/stats` - Get TPO dashboard stats
- `GET /api/tpo/students` - Get institute students
- `GET /api/tpo/internship-offers` - Get internship offers
- `POST /api/tpo/internship-offers` - Create internship offer
- `PUT /api/tpo/internship-offers/:id` - Update internship offer
- `DELETE /api/tpo/internship-offers/:id` - Delete internship offer

## 🎯 User Roles & Features

### **Student Features**
- **Profile Management**: Complete academic and personal information
- **Skills Tracking**: Technical and soft skills with proficiency levels
- **Project Portfolio**: Showcase projects with technologies and links
- **Internship Applications**: Browse and apply for opportunities
- **Placement Tracking**: Monitor application and interview status
- **Resume Builder**: Professional resume creation
- **Dashboard Analytics**: Profile completion and application statistics

### **Company Features**
- **Job Management**: Create, edit, and manage job postings
- **Candidate Search**: Filter and search student profiles
- **Interview Scheduling**: Schedule and manage interviews
- **Application Tracking**: Review and update application statuses
- **Analytics Dashboard**: Real-time statistics and performance metrics
- **Company Profile**: Manage company information and branding

### **TPO Features**
- **Institute Management**: Oversee all students and companies
- **Student Verification**: Approve and verify student profiles
- **Internship Management**: Create and manage internship opportunities
- **Placement Analytics**: Comprehensive reporting and statistics
- **Company Relations**: Manage partnerships and relationships
- **Reporting Tools**: Generate detailed placement reports

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for all passwords
- **Email Verification**: OTP-based account verification
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing security
- **Role-based Access Control**: Granular permissions per user type
- **Data Sanitization**: Protection against XSS and injection attacks

## 📊 Database Schema

### **User Model**
```javascript
{
  email: String,
  password: String (hashed),
  role: String (student/company/tpo/superadmin),
  isVerified: Boolean,
  student: Object,    // Student-specific data
  company: Object,    // Company-specific data
  tpo: Object,        // TPO-specific data
  createdAt: Date,
  updatedAt: Date
}
```

### **Key Collections**
- **Users**: All user accounts with role-based data
- **JobPostings**: Job and internship opportunities
- **Applications**: Job and internship applications
- **Interviews**: Interview scheduling and management
- **Notifications**: System notifications and alerts

## 🚀 Deployment

### **Frontend Deployment (React)**
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### **Backend Deployment (Node.js)**
```bash
cd server
npm start
# Deploy to your server or cloud platform
```

### **Environment Variables for Production**
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
PORT=5000
NODE_ENV=production
```

## 🧪 Testing

### **Run Tests**
```bash
# Test API endpoints
cd server
npm test

# Test frontend components
cd client
npm test
```

### **Sample Test Data**
The project includes comprehensive test data:
- **20 Student Profiles**: Complete with skills, projects, and placement data
- **5 Company Accounts**: With job postings and interview data
- **10 TPO Accounts**: With institute management data
- **50+ Job Postings**: Various positions across different industries
- **100+ Applications**: Sample applications with different statuses

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style and conventions
- Add proper error handling and validation
- Include comprehensive documentation
- Write tests for new features
- Ensure responsive design for all components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### **Common Issues**
1. **Database Connection**: Ensure MongoDB is running and accessible
2. **Email Service**: Verify email credentials in environment variables
3. **Port Conflicts**: Check if ports 3000 and 5000 are available
4. **Dependencies**: Run `npm run install:all` to install all dependencies

### **Getting Help**
- 📧 **Email**: [your-email@domain.com]
- 💬 **Issues**: Create an issue on GitHub
- 📖 **Documentation**: Check the docs folder for detailed guides

## 🔮 Future Enhancements

### **Planned Features**
- [ ] **Real-time Notifications**: WebSocket integration for live updates
- [ ] **Video Interview Scheduling**: Integrated video conferencing
- [ ] **AI-powered Matching**: Smart candidate-company matching
- [ ] **Mobile Application**: Native iOS and Android apps
- [ ] **Advanced Analytics**: Machine learning insights and predictions
- [ ] **Document Management**: Resume and certificate upload system
- [ ] **Email Automation**: Automated email campaigns and notifications
- [ ] **Third-party Integrations**: LinkedIn, job boards, and HR systems

### **Technical Improvements**
- [ ] **Performance Optimization**: Caching and database optimization
- [ ] **Microservices Architecture**: Scalable service-based architecture
- [ ] **API Documentation**: Swagger/OpenAPI documentation
- [ ] **Containerization**: Docker and Kubernetes deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Monitoring**: Application performance monitoring

## 📈 Project Statistics

- **Total Users**: 20+ student profiles, 5+ company accounts, 10+ TPO accounts
- **API Endpoints**: 50+ RESTful endpoints
- **Database Collections**: 8+ MongoDB collections
- **Frontend Components**: 30+ React components
- **Code Coverage**: Comprehensive error handling and validation
- **Performance**: Optimized for production deployment

---

<div align="center">
  <h3>🚀 Elevate - Empowering Careers, One Placement at a Time!</h3>
  <p>Built with ❤️ using modern web technologies</p>
  
  <a href="YOUR_VIDEO_LINK_HERE" target="_blank">
    <img src="https://img.shields.io/badge/Watch-Demo%20Video-red?style=for-the-badge&logo=youtube" alt="Watch Demo Video" />
  </a>
  
  <a href="https://github.com/yourusername/Elevate_odoo_mohali" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</div>