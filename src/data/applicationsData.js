// Hardcoded exam data - no API dependency
export const defaultApplications = [
  {
    "id": 1,
    "title": "UPSC Civil Services (Prelims) 2026",
    "status": "Notification Expected",
    "notificationDate": "14/01/2026",
    "deadline": "03/02/2026",
    "examDate": "24/05/2026",
    "eligibility": "Graduate from recognized university",
    "category": "Government",
    "conductingBody": "Union Public Service Commission",
    "officialLink": "https://upsc.gov.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 2,
    "title": "JEE Main 2026 (Session 1)",
    "status": "Notification Expected",
    "notificationDate": "01/11/2025",
    "deadline": "30/11/2025",
    "examDate": "20/01/2026",
    "eligibility": "Class 12 pass or appearing in 2026",
    "category": "Engineering",
    "conductingBody": "National Testing Agency (NTA)",
    "officialLink": "https://jeemain.nta.ac.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 3,
    "title": "JEE Main 2026 (Session 2)",
    "status": "Notification Expected",
    "notificationDate": "01/02/2026",
    "deadline": "01/03/2026",
    "examDate": "05/04/2026",
    "eligibility": "Class 12 pass or appearing in 2026",
    "category": "Engineering",
    "conductingBody": "National Testing Agency (NTA)",
    "officialLink": "https://jeemain.nta.ac.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 4,
    "title": "NEET UG 2026",
    "status": "Notification Expected",
    "notificationDate": "01/12/2025",
    "deadline": "31/12/2025",
    "examDate": "03/05/2026",
    "eligibility": "Class 12 with Physics, Chemistry, Biology/Biotech",
    "category": "Medical",
    "conductingBody": "National Testing Agency (NTA)",
    "officialLink": "https://neet.nta.nic.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 5,
    "title": "CAT 2025",
    "status": "Notification Expected",
    "notificationDate": "01/08/2025",
    "deadline": "15/09/2025",
    "examDate": "30/11/2025",
    "eligibility": "Bachelor’s degree with minimum 50% marks",
    "category": "Management",
    "conductingBody": "Indian Institutes of Management (IIM)",
    "officialLink": "https://iimcat.ac.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 6,
    "title": "CLAT 2026",
    "status": "Notification Expected",
    "notificationDate": "01/07/2025",
    "deadline": "15/10/2025",
    "examDate": "01/12/2025",
    "eligibility": "Class 12 pass or appearing in 2026",
    "category": "Law",
    "conductingBody": "Consortium of NLUs",
    "officialLink": "https://consortiumofnlus.ac.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 7,
    "title": "NDA & NA (I) Examination 2026",
    "status": "Notification Expected",
    "notificationDate": "01/01/2026",
    "deadline": "31/01/2026",
    "examDate": "12/04/2026",
    "eligibility": "Class 12 pass or appearing in 2026",
    "category": "Defence",
    "conductingBody": "Union Public Service Commission",
    "officialLink": "https://upsc.gov.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 8,
    "title": "CDS (I) Examination 2026",
    "status": "Notification Expected",
    "notificationDate": "01/01/2026",
    "deadline": "31/01/2026",
    "examDate": "12/04/2026",
    "eligibility": "Graduate/Bachelor’s degree or final year appearing",
    "category": "Defence",
    "conductingBody": "Union Public Service Commission",
    "officialLink": "https://upsc.gov.in",
    "isApplied": false,
    "isCart": false
  },
  {
    "id": 9,
    "title": "XAT 2026",
    "status": "Notification Expected",
    "notificationDate": "01/07/2025",
    "deadline": "30/11/2025",
    "examDate": "05/01/2026",
    "eligibility": "Bachelor’s degree or final year appearing",
    "category": "Management",
    "conductingBody": "XLRI Jamshedpur",
    "officialLink": "https://xatonline.in",
    "isApplied": false,
    "isCart": false
  },
];

// Simple function to get applications from storage or return default data
export const getApplicationsFromStorage = async () => {
  try {
    // Check if data exists in localStorage
    const storedData = localStorage.getItem('applications');
    
    if (storedData) {
      const applications = JSON.parse(storedData);
      console.log('📊 Loaded applications from storage:', applications.length, 'exams');
      return applications;
    } else {
      // Return default data and save to storage
      console.log('📊 Using default applications data:', defaultApplications.length, 'exams');
      saveApplicationsToStorage(defaultApplications);
      return defaultApplications;
    }
  } catch (error) {
    console.error('❌ Error loading applications from storage:', error);
    // Return default data if there's any error
    return defaultApplications;
  }
};

export const saveApplicationsToStorage = (applications) => {
  try {
    localStorage.setItem('applications', JSON.stringify(applications));
    localStorage.setItem('applicationsTimestamp', Date.now().toString());
    console.log('✅ Saved', applications.length, 'applications to storage');
  } catch (error) {
    console.error('❌ Error saving applications to storage:', error);
  }
};

// Function to refresh exam data (now just returns the hardcoded data)
export const refreshExamData = async () => {
  try {
    console.log('🔄 Refreshing exam data with hardcoded data');
    
    // Update localStorage with fresh copy of default data
    saveApplicationsToStorage(defaultApplications);
    
    return defaultApplications;
  } catch (error) {
    console.error('❌ Error refreshing exam data:', error);
    return defaultApplications;
  }
}; 