# Export Functionality - TPO Reports & Analytics

## Overview
The TPO Dashboard's Reports & Analytics section now includes fully functional export capabilities for both PDF and Excel formats.

## Features Implemented

### 1. PDF Export
- **Library Used**: `react-to-pdf` (usePDF hook)
- **Functionality**: Exports the entire reports section as a PDF document
- **Features**:
  - Automatic filename generation with current date
  - Captures all charts, statistics, and insights
  - Professional formatting
  - Uses React hook for better integration

### 2. Excel Export
- **Library Used**: `xlsx`
- **Functionality**: Exports data in structured Excel format with multiple sheets
- **Features**:
  - Multiple worksheets for different data categories
  - Formatted data with headers
  - Includes all analytics data:
    - Overview statistics
    - Department performance
    - Company statistics
    - Monthly trends

## Data Exported

### Excel Sheets:
1. **Overview Sheet**
   - Total Students
   - Placed Students
   - Placement Rate
   - Total Applications
   - Year-over-year changes

2. **Department Performance Sheet**
   - Department names
   - Total students per department
   - Placed students count
   - Placement rate percentage
   - Performance status (High/Medium/Low)

3. **Company Performance Sheet**
   - Company names
   - Application counts
   - Offer counts
   - Success rates
   - Average package information

4. **Monthly Trends Sheet**
   - Monthly placement data
   - Application trends
   - Success rates over time

### PDF Export:
- Complete visual representation of the dashboard
- All charts and graphs
- Statistical overview
- Key insights section
- Professional formatting

## User Experience Features

### Loading States
- Buttons show "Exporting..." during the export process
- Buttons are disabled during export to prevent multiple simultaneous exports
- Visual feedback with color changes

### Notifications
- Success notifications when exports complete successfully
- Error notifications if export fails
- Uses `react-hot-toast` for consistent notification styling

### File Naming
- Automatic filename generation: `TPO_Reports_Analytics_YYYY-MM-DD.xlsx/pdf`
- Includes current date for easy file management

## Technical Implementation

### Dependencies Added:
```json
{
  "xlsx": "^latest",
  "react-to-pdf": "^2.0.1"
}
```

### Key Functions:
1. `exportReport(format)` - Main export handler
2. `exportToPDF()` - PDF generation using usePDF hook
3. `exportToExcel()` - Excel generation logic

### Error Handling:
- Try-catch blocks for both export functions
- User-friendly error messages
- Graceful fallbacks

## Usage Instructions

1. Navigate to TPO Dashboard → Reports & Analytics
2. Apply any desired filters (Time Period, Department)
3. Click "Export Excel" for structured data export
4. Click "Export PDF" for visual report export
5. Files will be automatically downloaded to the user's default download folder

## Browser Compatibility
- Works in all modern browsers
- Requires JavaScript enabled
- No additional browser plugins required

## Future Enhancements
- Custom date range selection for exports
- Email export functionality
- Scheduled report generation
- Custom report templates
- Data visualization options in Excel export
