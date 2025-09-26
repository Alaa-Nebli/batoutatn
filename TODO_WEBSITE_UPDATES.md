# Website Updates TODO List

## 1. Text/Label Updates

### ✅ Analysis Complete - Files Identified:
- **Reserver billet** → **Reserver vol**: Found in UnifiedReservation component, ReservationForm component
- **Tous nos voyage** → **Remove button**: VERIFIED - This button doesn't exist (shows "Tous nos programmes" which is correct)
- **Voyages organise** → **Voyages à l'étranger**: Found in SEO.js, program pages
- **Excursions** → **Excursions en Tunisie**: Found in services pages
- **Notre adresse** → **Adresse postale**: Found in ContactUs.js
- **Découvrir nos service** → **Contacter nous**: Found in services pages
- **Aventure** → **Voyage**: Found in UnifiedReservation component

### 📋 TODO Items:
- [✅] 1.1 Update "Reserver billet" to "Reserver vol" in components/UnifiedReservation/UnifiedReservation.js
- [✅] 1.2 Find and remove "Tous nos voyage" button - VERIFIED: Button doesn't exist, current text is correct
- [✅] 1.3 Update "Voyages organise" to "Voyages à l'étranger" in components/SEO/SEO.js
- [ ] 1.4 Update "Excursions" to "Excursions en Tunisie" in services pages
- [✅] 1.5 Update "Notre Adresse" to "Adresse postale" in components/Contact/ContactUs.js
- [✅] 1.6 Update "Découvrir nos service" to "Contacter nous" in service pages - VERIFIED: Already updated
- [✅] 1.7 Update "Aventure" to "Voyage" in components/UnifiedReservation/UnifiedReservation.js

## 2. Contact & Call Features

### ✅ Analysis Complete - Current Implementation:
- Call buttons currently visible on both mobile and desktop
- Current email: batouta.info@gmail.com
- WhatsApp functionality exists but not linked to call buttons
- Call buttons link to phone numbers directly

### 📋 TODO Items:
- [✅] 2.1 Modify call buttons to display only on mobile screens - COMPLETED: Added md:hidden class
- [✅] 2.2 Update call button actions to include both WhatsApp and telephone options - COMPLETED: Added WhatsApp buttons
- [✅] 2.6 Add desktop phone number copy functionality - COMPLETED: Desktop copies to clipboard, mobile calls
- [✅] 7.2 Update admin interface to allow phone and WhatsApp number management - COMPLETED: Enhanced admin form
- [✅] 2.7 Optimize mobile phone interface - COMPLETED: Vertical stack layout for mobile with intuitive design
- [✅] 2.3 Update outgoing email from batouta.info@gmail.com to outgoing.batouta@gmail.com
- [ ] 2.4 Ensure admin has access to call button functionality
- [ ] 2.5 Update phone numbers and WhatsApp links in ContactUs.js

## 3. Service Classes

### ✅ Analysis Complete - Current Implementation:
- Found economy, business, first classes in ReservationForm.js
- Missing "Premium" class option
- Need to verify Eco class exists

### 📋 TODO Items:
- [ ] 3.1 Add "Premium" class option to ReservationForm.js
- [✅] 3.2 Update service classes to show: Eco, Premium, Business, First in ReservationForm.js
- [✅] 3.3 Ensure all 4 classes display: Eco, Premium, Business, First

## 4. Functional Fixes

### ✅ Analysis Complete - Current Issues:
- Reserver button links found in multiple components
- Mobile responsiveness needs verification
- Button actions need testing

### 📋 TODO Items:
- [✅] 4.1 Fix Reserver button functionality in ProgramHeaderCard component - COMPLETED: Updated Link structure
- [ ] 4.2 Verify mobile responsiveness of all reservation buttons
- [ ] 4.3 Test button actions to ensure correct text/action triggers
- [ ] 4.4 Update reservation button links to use correct routing

## 5. Business Info

### ✅ Analysis Complete - Current Implementation:
- Opening hours currently: "Lun-Ven: 8h00 - 18h00"
- Located in components/Contact/ContactUs.js

### 📋 TODO Items:
- [✅] 5.1 Update opening hours to "8:30 – 17:00" in components/Contact/ContactUs.js

## 6. Program Download - PDF Generation

### ✅ Analysis Complete - Current Implementation:
- Current system uses window.print() for PDF generation
- Issues with older mobile browsers
- Print styles exist but limited functionality

### 📋 TODO Items:
- [✅] 6.1 Install PDF generation library (jspdf and html2canvas)
- [✅] 6.2 Create PDF generation service for program details
- [✅] 6.3 Replace window.print() with proper PDF generation in pages/programs/[id]/index.js
- [✅] 6.4 Implement direct PDF download functionality
- [✅] 6.5 Add fallback for older mobile browsers
- [✅] 6.6 Update floating action buttons to use new PDF functionality

## 7. Admin Program Creation - Images Timeline Fix

### ✅ Analysis Complete - Current Issues:
- Found admin program creation in pages/admin/programs.js
- Images array structure causes timeline disorder
- No reliable way to associate images with specific timeline days

### 📋 TODO Items:
- [✅] 7.1 Modify database schema to link images to specific timeline days - COMPLETED: Added TimelineImage model with preserved data
- [ ] 7.2 Update admin interface to allow image assignment per timeline day
- [ ] 7.3 Create image uploader component for individual timeline items
- [ ] 7.4 Update timeline image display logic in program pages
- [ ] 7.5 Add image validation and ordering functionality
- [ ] 7.6 Implement drag-and-drop interface for timeline images

## 8. Additional Technical Tasks

### 📋 Implementation Order:
- [✅] 8.1 Create utility functions for PDF generation
- [ ] 8.2 Update database migrations for timeline-image relationships
- [ ] 8.3 Create mobile detection utilities for call button visibility
- [✅] 8.4 Update email configuration for outgoing emails
- [ ] 8.5 Implement service class management system
- [ ] 8.6 Create comprehensive testing suite for button functionality

## 9. Quality Assurance

### 📋 Testing Requirements:
- [ ] 9.1 Test all text updates across different pages
- [ ] 9.2 Verify mobile-only call button visibility
- [ ] 9.3 Test PDF generation on various devices and browsers
- [ ] 9.4 Verify reservation button functionality
- [ ] 9.5 Test admin panel image upload improvements
- [ ] 9.6 Validate email system with new outgoing address
- [ ] 9.7 Cross-browser compatibility testing

## 10. Deployment Checklist

### 📋 Pre-deployment:
- [ ] 10.1 Backup current database
- [ ] 10.2 Test all changes in staging environment
- [ ] 10.3 Verify email configuration changes
- [ ] 10.4 Update environment variables for new email
- [ ] 10.5 Test PDF downloads on mobile devices
- [ ] 10.6 Verify admin panel functionality

---

## ✅ COMPLETED ITEMS (9/34):
1. ✅ Update "Reserver billet" to "Reserver vol"
2. ✅ Update "Aventure" to "Voyage" 
3. ✅ Update "Notre Adresse" to "Adresse postale"
4. ✅ Update opening hours to "8:30 – 17:00"
5. ✅ Update email to "outgoing.batouta@gmail.com"
6. ✅ Update "Voyages organise" to "Voyages à l'étranger"
7. ✅ Add Premium service class and update class names
8. ✅ Install PDF generation libraries
9. ✅ Implement PDF generation functionality

## 🚧 IN PROGRESS (25/34):
**High Priority (P1):** Items 1.4, 1.6, 2.1-2.2, 2.4-2.5, 4.1-4.4
**Medium Priority (P2):** Items 7.1-7.6
**Low Priority (P3):** Items 8.2-8.6, 9.1-9.7, 10.1-10.6

## Priority Levels:
**High Priority (P1):** Items 1, 2, 4 (Remaining text updates, Call features, Functional fixes)
**Medium Priority (P2):** Items 7 (Admin improvements)
**Low Priority (P3):** Items 8, 9, 10 (Technical tasks, QA, Deployment)

## Updated Timeline:
- P1 Tasks: 1-2 days remaining
- P2 Tasks: 3-4 days  
- P3 Tasks: 1-2 days
- **Total Remaining: 5-8 days**