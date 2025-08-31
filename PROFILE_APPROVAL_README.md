# Student Profile Approval System

This document describes the implementation of the Student Profile Approval functionality that allows TPOs and Superadmins to approve or reject student profiles.

## Overview

The Profile Approval system provides a comprehensive interface for managing student profile approvals with the following features:

- **Profile Status Display**: Shows current approval status (Pending, Approved, Rejected)
- **Approval Actions**: Approve/Reject buttons for authorized users
- **Rejection Reason**: Modal for providing rejection reasons
- **Permission Control**: Only TPOs and Superadmins can approve/reject profiles
- **Notifications**: Automatic notifications sent to students upon approval/rejection

## Components

### 1. ProfileApproval Component
**Location**: `client/src/pages/student/components/ProfileApproval.jsx`

**Features**:
- Displays current profile approval status
- Shows profile information (personal and academic details)
- Provides approve/reject buttons for authorized users
- Modal for entering rejection reasons
- Loading states and error handling
- Responsive design with Tailwind CSS

**Key Functions**:
- `loadProfileData()`: Loads profile and approval status data
- `handleApprove()`: Approves the student profile
- `handleReject()`: Rejects the profile with a reason
- `canApproveReject()`: Checks user permissions

### 2. API Integration
**Location**: `client/src/services/studentApi.js`

**New Endpoints**:
- `getProfileApprovalStatus()`: Get current approval status
- `approveProfile(studentId)`: Approve a student profile
- `rejectProfile(studentId, reason)`: Reject a profile with reason

### 3. Server Routes
**Location**: `server/routes/student.js`

**New Routes**:
- `GET /api/student/profile/approval-status`: Get approval status
- `PUT /api/student/profile/:studentId/approve`: Approve profile (TPO/Superadmin only)
- `PUT /api/student/profile/:studentId/reject`: Reject profile (TPO/Superadmin only)

## User Roles and Permissions

### Students
- Can view their own profile approval status
- Cannot approve or reject profiles
- Receive notifications when their profile is approved/rejected

### TPOs (Training & Placement Officers)
- Can view student profiles
- Can approve student profiles
- Can reject student profiles with reasons
- Can only manage students from their institute

### Superadmins
- Can view all student profiles
- Can approve any student profile
- Can reject any student profile with reasons
- Full system access

## Database Schema

The approval system uses the following fields in the User model:

```javascript
// Approval system fields
approvalStatus: {
  type: String,
  enum: ['Pending', 'Approved', 'Rejected'],
  default: 'Pending'
},
approvedAt: {
  type: Date
},
approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
rejectedAt: {
  type: Date
},
rejectedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
rejectionReason: {
  type: String
}
```

## Usage

### For Students
1. Navigate to the student dashboard
2. Click on "Profile Approval" in the sidebar
3. View current approval status and profile information

### For TPOs/Superadmins
1. Navigate to the student dashboard
2. Click on "Profile Approval" in the sidebar
3. Review student profile information
4. Click "Approve Profile" to approve
5. Click "Reject Profile" to reject (requires reason)

## API Endpoints

### Get Profile Approval Status
```http
GET /api/student/profile/approval-status
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "approvalStatus": "Pending",
    "approvedAt": null,
    "approvedBy": null,
    "rejectedAt": null,
    "rejectedBy": null,
    "rejectionReason": null
  }
}
```

### Approve Profile
```http
PUT /api/student/profile/:studentId/approve
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Student profile approved successfully",
  "data": {
    "approvalStatus": "Approved",
    "approvedAt": "2024-01-15T10:30:00.000Z",
    "approvedBy": "tpo-user-id"
  }
}
```

### Reject Profile
```http
PUT /api/student/profile/:studentId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Incomplete profile information"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Student profile rejected",
  "data": {
    "approvalStatus": "Rejected",
    "rejectedAt": "2024-01-15T10:30:00.000Z",
    "rejectedBy": "tpo-user-id",
    "rejectionReason": "Incomplete profile information"
  }
}
```

## Notifications

The system automatically creates notifications when profiles are approved or rejected:

### Approval Notification
- **Title**: "Profile Approved"
- **Message**: "Your profile has been approved by the TPO."
- **Type**: "achievement"

### Rejection Notification
- **Title**: "Profile Rejected"
- **Message**: "Your profile has been rejected. Reason: [reason]"
- **Type**: "admin"

## Testing

A test file is provided at `client/src/test-profile-approval.js` with the following test functions:

- `testLoadProfileData()`: Test profile data loading
- `testApproveProfile(studentId)`: Test profile approval
- `testRejectProfile(studentId, reason)`: Test profile rejection
- `testPermissionCheck(userRole)`: Test permission validation

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Only TPOs and Superadmins can approve/reject profiles
3. **Input Validation**: Rejection reasons are validated
4. **Audit Trail**: All approval/rejection actions are logged with timestamps and user IDs

## Future Enhancements

1. **Bulk Operations**: Approve/reject multiple profiles at once
2. **Approval Workflow**: Multi-step approval process
3. **Email Notifications**: Send email notifications in addition to in-app notifications
4. **Approval History**: Detailed history of all approval actions
5. **Profile Templates**: Pre-defined profile templates for different roles

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure user has TPO or Superadmin role
2. **Profile Not Found**: Verify student ID exists in database
3. **Missing Rejection Reason**: Rejection requires a reason
4. **Network Errors**: Check API endpoint availability

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=profile-approval
```

## Support

For issues or questions regarding the Profile Approval system, please contact the development team or create an issue in the project repository.
