# 🚀 Elevate - Placement Tracker Platform

A comprehensive placement tracking platform that connects students, companies, and Training & Placement Officers (TPOs) to streamline the recruitment process and track career progress.

## ✨ Features

### 🔐 Authentication System
- **Role-based Registration**: Single signup form with dynamic fields based on role selection
- **Three User Types**: Student, Company, and TPO roles
- **OTP Verification**: Email-based account verification for security
- **Password Management**: Secure password reset functionality

### 👨‍🎓 Student Features
- Profile management with academic details
- Placement status tracking
- Resume and skills management
- Application tracking

### 🏢 Company Features
- Company profile management
- Job posting creation and management
- Candidate application review
- Placement analytics

### 👨‍🏫 TPO Features
- Institute management
- Student placement statistics
- Company relationship management
- Comprehensive reporting

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hot Toast** - Notification system
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elevate-placement-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Server environment variables
   cd server
   cp env.example .env
   ```
   
   Update `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/elevate-placement-tracker
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev
   
   # Start client (from client directory)
   npm start
   ```

## 📁 Project Structure

```
elevate-placement-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

## 🎯 User Roles & Fields

### Student Registration
- Name, Email, Password
- Roll Number, Branch, Graduation Year
- College Name

### Company Registration
- Company Name, Email, Password
- Contact Number

### TPO Registration
- Name, Email, Password
- Institute Name, Contact Number

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **OTP Verification**: Email-based account verification
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing security

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
```

### Backend (Node.js)
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with job portals
- [ ] AI-powered candidate matching
- [ ] Video interview scheduling
- [ ] Document verification system

---

**Elevate** - Empowering careers, one placement at a time! 🚀