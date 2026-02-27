Create a comprehensive Job Posting Form for a college placement portal with the following requirements:

## FORM STRUCTURE (Multi-Step Form with 6 Steps)

### STEP 1: COMPANY & JOB BASICS
Fields:
- Company Name* (text input)
- Company Website/LinkedIn (URL input)
- Company Logo* (file upload - accept: .jpg, .jpeg, .png, max: 2MB)
- Industry/Sector* (dropdown: IT/Software, Finance/Banking, Manufacturing, Consulting, E-commerce, Healthcare, Education, Automobile, FMCG, Telecom, Media, Other)
- Company Size* (dropdown: Startup (<50), Small (50-200), Medium (200-1000), Large (1000+))
- Company Description* (textarea, max 500 chars)
- Company Location/Headquarters* (text input)
- Job Title/Role* (text input)
- Job ID/Reference Number (auto-generated format: JOB-YYYY-XXXX)
- Department* (dropdown: Engineering, Sales, Marketing, HR, Finance, Operations, Product, Design, Other)
- Employment Type* (radio: Full-time, Internship, Part-time, Contract)
- Job Category* (dropdown: Technical, Non-Technical, Management)

### STEP 2: DRIVE TYPE & ELIGIBILITY
Fields:
- Drive Type* (radio buttons)
  - On-Campus (requires TPO approval)
  - Off-Campus (directly visible to students)

- Target Batch/Year* (multi-select checkboxes: 2024, 2025, 2026, 2027, 2028)
- Eligible Degrees* (multi-select checkboxes: B.Tech, M.Tech, MBA, MCA, BCA, B.Sc, M.Sc, Other)
- Eligible Branches/Specializations* (multi-select checkboxes: CSE, IT, ECE, EEE, Mechanical, Civil, Chemical, Biotechnology, MBA-Finance, MBA-Marketing, MBA-HR, MCA, All Branches)

**Eligibility Criteria Section:**
- Minimum CGPA/Percentage* (number input with dropdown: CGPA/Percentage)
- Active Backlogs Allowed* (radio: Yes/No)
  - If Yes: Maximum Active Backlogs Allowed (number input)
- Minimum 10th Percentage (number input, 0-100)
- Minimum 12th/Diploma Percentage (number input, 0-100)
- Gap Years Allowed* (radio: Yes/No)
  - If Yes: Maximum Gap Years (number input)
- Age Limit (text input, optional - e.g., "Below 25 years")
- Any Other Eligibility Criteria (textarea, optional)

### STEP 3: SELECTION PROCESS
Fields:
- Total Number of Rounds* (number input, 1-10)
- Round Details* (dynamic fields based on total rounds):
  For Each Round (Round 1, Round 2, etc.):
  - Round Name* (text input - e.g., "Online Aptitude Test")
  - Round Type* (dropdown: Aptitude Test, Technical Test, Coding Round, Group Discussion, Technical Interview, HR Interview, Case Study, Assignment, Other)
  - Duration (text input - e.g., "60 minutes", optional)
  - Mode* (radio: Online, Offline)
  - Platform/Tool (text input - e.g., "HackerRank, Google Meet", optional for offline)
  - Topics/Description (textarea - e.g., "DSA, SQL, Java fundamentals")

### STEP 4: COMPENSATION & JOB DETAILS
**Compensation Section:**
- CTC (Cost to Company)* (number input with currency INR, per annum)
- Base Salary (number input, optional - if different from CTC)
- Stipend (number input - show only if Employment Type = Internship)
- Joining Bonus (number input, optional)
- Performance Bonus/Variable Pay (text input, optional - e.g., "Up to 20% of base")
- Other Benefits (textarea - e.g., "Health insurance, relocation support, meal coupons")

**Job Details Section:**
- Job Description* (rich text editor/textarea - responsibilities, day-to-day work, min 100 chars)
- Required Skills* (tag input - e.g., Java, Python, React, Communication, Leadership)
- Preferred Skills (tag input, optional)
- Experience Required (dropdown: 0 years (Fresher), 0-1 years, 1-2 years, 2-3 years, Other)
- Number of Openings/Positions* (number input)
- Work Mode* (radio: Work from Office, Hybrid, Remote)
- Work Location(s)* (multi-text input - cities where role is based)

**Internship Specific Fields** (show only if Employment Type = Internship):
- Internship Duration* (text input - e.g., "2 months", "6 weeks")
- Possibility of PPO (Pre-Placement Offer)* (radio: Yes, No, Performance Based)

**Bond/Agreement Section:**
- Service Agreement/Bond* (radio: Yes, No)
  - If Yes:
    - Bond Duration* (text input - e.g., "2 years")
    - Bond Amount (number input, optional)
    - Bond Details (textarea)

### STEP 5: DATES & APPLICATION REQUIREMENTS
**Important Dates:**
- Application Deadline* (date-time picker)
- Tentative Drive/Interview Date (date picker - show only for On-Campus)
- Expected Joining Date* (date picker or month-year picker)
- Result Declaration Date (date picker, optional)

**Conditional Fields for On-Campus:**
- Preferred Drive Date Range* (date range picker)
- Venue Requirements (textarea - e.g., "Seminar hall with projector, capacity 100")
- Number of Students Expected* (number input)
- Pre-Placement Talk Required* (radio: Yes, No)
  - If Yes:
    - PPT Date & Time* (date-time picker)
    - PPT Duration (text input - e.g., "30 minutes")
    - PPT Venue/Mode* (text input - e.g., "Auditorium" or "Online via Zoom")

**Conditional Fields for Off-Campus:**
- Application Portal URL* (URL input - where students should apply)
- How to Apply Instructions* (textarea - step-by-step application process)

**Application Requirements:**
- Resume Required* (checkbox, checked by default and disabled)
- Resume Format (dropdown: Any, PDF only, DOC/DOCX only)
- Cover Letter Required* (radio: Yes, No)
- Additional Documents Required (multi-select: Portfolio, Certificates, Project Links, GitHub Profile, LinkedIn Profile, Other)
- Special Instructions for Students (textarea - any specific guidelines)

**Contact Information:**
- HR/Recruiter Name* (text input)
- Contact Email* (email input)
- Contact Phone Number* (phone input with country code)
- Alternate Contact Email (email input, optional)
- Alternate Phone Number (phone input, optional)

### STEP 6: REVIEW & SUBMIT
- Display all entered information in organized sections
- Edit buttons for each section to go back
- Terms & Conditions checkbox* (e.g., "I confirm all information is accurate")
- Save as Draft button
- Submit button

## CONDITIONAL LOGIC REQUIREMENTS

1. **Drive Type Conditions:**
   - If "On-Campus" selected:
     * Show: Preferred Drive Date Range, Venue Requirements, Number of Students Expected, Pre-Placement Talk fields
     * Hide: Application Portal URL, How to Apply Instructions
     * On Submit: Set status to "Pending TPO Approval"
     * Send notification to TPO
   
   - If "Off-Campus" selected:
     * Show: Application Portal URL*, How to Apply Instructions*
     * Hide: Preferred Drive Date Range, Venue Requirements, Number of Students Expected, Pre-Placement Talk fields
     * On Submit: Auto-validate and publish immediately
     * Make visible to all eligible students

2. **Employment Type Conditions:**
   - If "Internship" selected:
     * Show: Stipend*, Internship Duration*, Possibility of PPO*
     * Hide/Optional: CTC (can be shown as "CTC if converted to full-time")
   
   - If "Full-time/Part-time/Contract" selected:
     * Show: CTC*, Base Salary, Joining Bonus
     * Hide: Stipend, Internship Duration, Possibility of PPO

3. **Backlog Condition:**
   - If "Active Backlogs Allowed" = Yes: Show "Maximum Active Backlogs Allowed" field
   - If No: Hide the field

4. **Gap Year Condition:**
   - If "Gap Years Allowed" = Yes: Show "Maximum Gap Years" field
   - If No: Hide the field

5. **Bond Condition:**
   - If "Service Agreement/Bond" = Yes: Show Bond Duration, Bond Amount, Bond Details
   - If No: Hide these fields

6. **PPT Condition (On-Campus only):**
   - If "Pre-Placement Talk Required" = Yes: Show PPT Date & Time, Duration, Venue/Mode
   - If No: Hide these fields

## BACKEND WORKFLOW LOGIC

### For On-Campus Jobs:
1. Company submits form
2. Set job status = "Pending TPO Approval"
3. Send email notification to TPO with job details
4. TPO Dashboard shows pending jobs
5. TPO can:
   - Approve: Status changes to "Approved" → Visible to eligible students with "Apply" button
   - Reject: Status changes to "Rejected" → Company receives rejection reason
   - Request Changes: Status = "Changes Requested" → Company can edit and resubmit
6. After approval, TPO can:
   - Edit drive date, venue, coordinator assignment
   - Schedule campus visit
   - Send bulk notifications to eligible students
7. Students see job with:
   - All job details
   - "Apply" button (internal application)
   - Application deadline countdown
   - Status tracking

### For Off-Campus Jobs:
1. Company submits form
2. Basic validation check
3. Set job status = "Active"
4. Immediately visible to all eligible students based on:
   - Batch/Year match
   - Degree match
   - Branch match
   - CGPA/Percentage eligibility
   - Backlog criteria
   - Gap year criteria
5. Students see job with:
   - All job details
   - "Apply Now" button (redirects to external portal URL)
   - Track click analytics (who clicked apply)

### Draft Functionality:
- "Save as Draft" button available on all steps
- Drafts saved with status = "Draft"
- Company can resume editing from dashboard
- Drafts not visible to TPO or students
- Auto-save every 2 minutes

### Edit Functionality:
- **On-Campus (Before Approval):** Company can edit freely
- **On-Campus (After Approval):** Company requests changes → TPO must re-approve
- **Off-Campus:** Company can edit but changes require re-validation
- Major changes (CTC, eligibility) trigger notifications to students who saved/applied

## VALIDATION RULES

1. **Required Field Validation:** All fields marked with * must be filled
2. **Email Validation:** Valid email format for all email fields
3. **Phone Validation:** Valid phone number format (10 digits for India)
4. **URL Validation:** Valid URL format for website, LinkedIn, application portal
5. **Date Validation:**
   - Application Deadline must be future date
   - Drive Date must be after Application Deadline
   - Joining Date must be after Drive Date
6. **Number Validation:**
   - CGPA: 0-10 scale
   - Percentage: 0-100
   - CTC, Stipend: Positive numbers
   - Number of Openings: Minimum 1
7. **File Validation:**
   - Logo: Max 2MB, formats: jpg, jpeg, png
   - Aspect ratio recommendation: Square or landscape
8. **Eligibility Logic Validation:**
   - At least one batch/year must be selected
   - At least one degree must be selected
   - At least one branch must be selected (unless "All Branches")

## DATABASE SCHEMA SUGGESTIONS

**jobs table:**
- id (primary key)
- job_id (unique, auto-generated)
- company_name, company_website, company_logo_url, industry, company_size, company_description, company_location
- job_title, department, employment_type, job_category
- drive_type (on_campus/off_campus)
- target_batches (JSON array)
- eligible_degrees (JSON array)
- eligible_branches (JSON array)
- min_cgpa_percentage (JSON: {type: 'cgpa/percentage', value: number})
- backlogs_allowed (boolean)
- max_backlogs (integer, nullable)
- min_10th_percentage, min_12th_percentage
- gap_years_allowed (boolean)
- max_gap_years (integer, nullable)
- age_limit, other_eligibility
- total_rounds (integer)
- selection_rounds (JSON array of objects)
- ctc, base_salary, stipend, joining_bonus, performance_bonus, other_benefits
- job_description, required_skills (JSON array), preferred_skills (JSON array)
- experience_required, number_of_openings, work_mode, work_locations (JSON array)
- internship_duration, ppo_possibility (nullable)
- bond_required (boolean)
- bond_duration, bond_amount, bond_details (nullable)
- application_deadline, drive_date, joining_date, result_date
- venue_requirements, expected_students, ppt_required, ppt_details (JSON, nullable for on-campus)
- application_portal_url, how_to_apply (nullable for off-campus)
- resume_required, resume_format, cover_letter_required, additional_documents (JSON array)
- special_instructions
- hr_name, contact_email, contact_phone, alternate_email, alternate_phone
- status (draft/pending_approval/approved/rejected/active/closed)
- rejection_reason (nullable)
- created_by (company_id), created_at, updated_at
- approved_by (tpo_id, nullable), approved_at (nullable)

**job_applications table:**
- id, job_id, student_id
- application_type (internal/external_click)
- applied_at, status
- resume_url, cover_letter_url, additional_docs (JSON)

**tpo_actions table:**
- id, job_id, tpo_id, action (approved/rejected/changes_requested)
- comments, action_date

## UI/UX RECOMMENDATIONS

1. **Progress Indicator:** Show steps 1-6 with current step highlighted
2. **Field Grouping:** Use cards/sections with clear headings
3. **Help Text:** Add tooltip icons with examples for complex fields
4. **Smart Defaults:** Pre-select common values (e.g., Resume Required = checked)
5. **Character Counters:** For textarea fields with limits
6. **Preview Mode:** Allow company to preview how job will appear to students
7. **Responsive Design:** Mobile-friendly form
8. **Auto-save Indicator:** Show "Draft saved" message
9. **Error Highlighting:** Clear error messages near relevant fields
10. **Confirmation Modal:** Before final submit, show summary with "Confirm Submit" button

## NOTIFICATIONS TO IMPLEMENT

1. **To TPO:** New on-campus job pending approval (email + in-app)
2. **To Company:** Approval/rejection status update (email)
3. **To Students:** New job matching their profile (email + in-app, with digest option)
4. **To Students:** Application deadline reminder (24 hours before)
5. **To Company:** Application received confirmation (for internal applications)

## ANALYTICS TO TRACK

1. Form completion rate (drop-off at each step)
2. Draft to submission conversion
3. Average time to complete form
4. Most common validation errors
5. On-campus vs off-campus job ratio
6. For jobs: views, applications, click-throughs (off-campus)

check the system once if there are already some components build check them and start working on remaining things 