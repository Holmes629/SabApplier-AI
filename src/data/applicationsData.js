// Hardcoded official exam portals for competitive exams
export const defaultApplications = [
  {
    id: 1,
    title: "IBPS (Institute of Banking Personnel Selection)",
    officialLink: "https://www.ibps.in/",
    category: "Banking",
  },
  {
    id: 2,
    title: "RRB (Railway Recruitment Board)",
    officialLink: "https://www.rrbapply.gov.in/#/auth/landing",
    category: "Railways",
  },
  {
    id: 3,
    title: "SSC (Staff Selection Commission)",
    officialLink: "https://ssc.gov.in/",
    category: "Government",
  },
  {
    id: 4,
    title: "UPSC (Union Public Service Commission)",
    officialLink: "https://upsconline.nic.in/",
    category: "Government",
  },
  {
    id: 5,
    title: "SBI (State Bank of India)",
    officialLink: "https://sbi.co.in/web/careers/Current-openings",
    category: "Banking",
  },
  {
    id: 6,
    title: "NTA (National Testing Agency)",
    officialLink: "https://www.nta.ac.in/",
    category: "Testing Agency",
  },
  {
    id: 7,
    title: "State PSC (State Public Service Commissions)",
    officialLink: "https://www.freejobalert.com/latest-notifications/#google_vignette",
    category: "State Government",
  },
];

// Simple function to get applications from storage or return default data
export const getApplicationsFromStorage = async () => {
  try {
    console.log('🏗️ applicationsData.js - Default data length:', defaultApplications.length);
    
    // Check if data exists in localStorage
    const storedData = localStorage.getItem('applications');
    
    if (storedData) {
      const applications = JSON.parse(storedData);
      console.log('📊 Loaded applications from storage:', applications.length, 'exams');
      
      // If stored data has fewer items than default, use default instead
      if (applications.length < defaultApplications.length) {
        console.log('⚠️ Stored data incomplete, using fresh default data');
        saveApplicationsToStorage(defaultApplications);
        return defaultApplications;
      }
      
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
    console.log('📊 Fallback to default data:', defaultApplications.length, 'exams');
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