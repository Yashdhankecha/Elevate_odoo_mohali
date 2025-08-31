# TPO Institute-Based Access Control System

## Overview
This document explains the comprehensive institute-based access control system implemented for TPOs (Training & Placement Officers) to ensure they can only access and manage students from their own institute.

## 🔒 **Security Features**

### **1. Institute Verification Middleware**
- **File**: `server/middleware/tpoInstituteAccess.js`
- **Purpose**: Ensures TPO can only access data from their own institute
- **Components**:
  - `tpoInstituteAccess`: Verifies TPO's institute and adds it to request
  - `verifyStudentInstitute`: Verifies specific student belongs to TPO's institute
  - `buildInstituteFilter`: Helper to build institute-based filters
  - `verifyBulkInstituteAccess`: Verifies multiple students belong to institute

### **2. Database-Level Security**
- All student queries are filtered by `student.collegeName` field
- TPO can only see students where `student.collegeName === tpo.instituteName`
- Bulk operations verify all students belong to the institute before processing

## 🛡️ **Access Control Implementation**

### **Protected Routes**
All TPO routes now include institute-based access control:

1. **Dashboard Statistics** (`GET /api/tpo/dashboard-stats`)
   - Only shows statistics for TPO's institute students
   - Filters all data by institute

2. **Student Management** (`GET /api/tpo/students`)
   - Lists only students from TPO's institute
   - Search and filters work within institute scope

3. **Add Student** (`POST /api/tpo/students`)
   - Automatically assigns student to TPO's institute
   - Prevents adding students to other institutes

4. **Update Student** (`PUT /api/tpo/students/:id`)
   - Verifies student belongs to TPO's institute before update
   - Cannot modify students from other institutes

5. **Delete Student** (`DELETE /api/tpo/students/:id`)
   - Verifies student belongs to TPO's institute before deletion
   - Cannot delete students from other institutes

6. **Student Applications** (`GET /api/tpo/students/:studentId/applications`)
   - Only shows applications for students from TPO's institute

7. **Bulk Operations** (`PUT /api/tpo/students/bulk-update`)
   - Verifies all students belong to TPO's institute
   - Rejects operation if any student is from different institute

8. **Data Export** (`GET /api/tpo/export/students`)
   - Exports only students from TPO's institute

## 🔍 **Student Verification System**

### **New Verification Routes**

1. **Verify Student** (`POST /api/tpo/students/:studentId/verify`)
   ```json
   {
     "verificationStatus": "verified|pending|rejected",
     "verificationNotes": "Optional notes from TPO"
   }
   ```

2. **Get Verification Status** (`GET /api/tpo/students/verification-status`)
   - Lists all students with their verification status
   - Filter by status: `?status=verified|pending|rejected`

### **Verification Fields Added to Student Model**
```javascript
{
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedBy: ObjectId, // Reference to TPO who verified
  verifiedAt: Date
}
```

## 📋 **API Endpoints Summary**

### **Student Management (Institute-Restricted)**
- `GET /api/tpo/students` - List students from TPO's institute
- `POST /api/tpo/students` - Add student to TPO's institute
- `PUT /api/tpo/students/:id` - Update student (institute verified)
- `DELETE /api/tpo/students/:id` - Delete student (institute verified)
- `PUT /api/tpo/students/bulk-update` - Bulk update (all institute verified)

### **Student Verification (Institute-Restricted)**
- `POST /api/tpo/students/:studentId/verify` - Verify student profile
- `GET /api/tpo/students/verification-status` - Get verification status

### **Student Details (Institute-Restricted)**
- `GET /api/tpo/students/:studentId/applications` - Get student applications
- `PUT /api/tpo/students/:studentId/placement` - Update placement status

### **Data Export (Institute-Restricted)**
- `GET /api/tpo/export/students` - Export institute students data

### **General TPO Routes**
- `GET /api/tpo/dashboard-stats` - Dashboard statistics (institute filtered)
- `GET /api/tpo/companies` - View companies (no institute restriction)
- `GET /api/tpo/placement-drives` - View placement drives (no institute restriction)
- `GET /api/tpo/training-programs` - View training programs
- `GET /api/tpo/internship-records` - Internship records (institute filtered)
- `GET /api/tpo/reports-analytics` - Reports (institute filtered)

## 🔐 **Security Measures**

### **1. Middleware Chain**
```javascript
authenticateToken → isTPO → tpoInstituteAccess → routeHandler
```

### **2. Database Queries**
All student queries include institute filter:
```javascript
const filter = {
  role: 'student',
  'student.collegeName': req.tpoInstitute,
  // ... additional filters
};
```

### **3. Error Handling**
- 403 Forbidden: When trying to access students from other institutes
- 404 Not Found: When TPO profile or institute not configured
- 400 Bad Request: When validation fails

### **4. Audit Trail**
- Verification actions are logged with TPO ID and timestamp
- Notifications sent to students when verification status changes

## 🧪 **Testing Scenarios**

### **Valid Access (Should Work)**
1. TPO logs in with institute credentials
2. TPO views students from their institute
3. TPO adds new student to their institute
4. TPO updates student from their institute
5. TPO verifies student from their institute

### **Invalid Access (Should Be Blocked)**
1. TPO tries to access student from different institute
2. TPO tries to update student from different institute
3. TPO tries to delete student from different institute
4. TPO tries to verify student from different institute
5. TPO tries to export students from different institute

## 📊 **Data Flow**

```
TPO Login → Verify Institute → Access Control → Database Query (Filtered) → Response
```

1. **Authentication**: TPO logs in with credentials
2. **Institute Verification**: Middleware checks TPO's institute
3. **Access Control**: Route verifies student belongs to institute
4. **Database Query**: All queries filtered by institute
5. **Response**: Only institute-specific data returned

## 🚀 **Benefits**

1. **Data Security**: TPOs can only access their institute's data
2. **Privacy Protection**: Student data is isolated by institute
3. **Compliance**: Meets data protection requirements
4. **Audit Trail**: All verification actions are logged
5. **Scalability**: System can handle multiple institutes
6. **Maintainability**: Centralized access control logic

## 🔧 **Configuration**

### **TPO Profile Requirements**
TPO must have:
```javascript
{
  role: 'tpo',
  tpo: {
    instituteName: 'Institute Name', // Required for access
    // ... other fields
  }
}
```

### **Student Profile Requirements**
Students must have:
```javascript
{
  role: 'student',
  student: {
    collegeName: 'Institute Name', // Must match TPO's institute
    // ... other fields
  }
}
```

This system ensures complete data isolation between institutes while providing TPOs with full control over their institute's student data and verification processes.
