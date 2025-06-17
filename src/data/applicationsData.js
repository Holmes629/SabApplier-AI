import { geminiExamService } from '../services/geminiApi';

export const defaultApplications = [
  {
    id: 1,
    title: "UPSC Civil Services (Prelims) 2025",
    status: "Application Open",
    notificationDate: "14/02/2025",
    deadline: "14/03/2025",
    examDate: "31/05/2025",
    eligibility: "Graduate from recognized university",
    category: "Government",
    conductingBody: "Union Public Service Commission",
    officialLink: "https://upsc.gov.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 2,
    title: "SSC CGL 2025",
    status: "Application Open",
    notificationDate: "22/04/2025",
    deadline: "21/05/2025",
    examDate: "14/06/2025 to 05/07/2025",
    eligibility: "Graduate from recognized university",
    category: "Government",
    conductingBody: "Staff Selection Commission",
    officialLink: "https://ssc.nic.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 3,
    title: "JEE Main 2025",
    status: "Application Open",
    notificationDate: "30/10/2024",
    deadline: "30/11/2024",
    examDate: "22/01/2025 to 31/01/2025",
    eligibility: "12th with PCM, minimum 75%",
    category: "Engineering",
    conductingBody: "National Testing Agency",
    officialLink: "https://jeemain.nta.nic.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 4,
    title: "NEET UG 2025",
    status: "Application Open",
    notificationDate: "07/02/2025",
    deadline: "09/03/2025",
    examDate: "04/05/2025",
    eligibility: "12th with PCB, minimum 50%",
    category: "Medical",
    conductingBody: "National Testing Agency",
    officialLink: "https://neet.nta.nic.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 5,
    title: "IBPS PO 2025",
    status: "Coming Soon",
    notificationDate: "05/08/2025",
    deadline: "25/08/2025",
    examDate: "19/10/2025 to 20/10/2025",
    eligibility: "Graduate from recognized university",
    category: "Banking",
    conductingBody: "Institute of Banking Personnel Selection",
    officialLink: "https://ibps.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 6,
    title: "CAT 2025",
    status: "Coming Soon",
    notificationDate: "30/07/2025",
    deadline: "20/09/2025",
    examDate: "24/11/2025",
    eligibility: "Graduate with minimum 50%",
    category: "Management",
    conductingBody: "Indian Institute of Management",
    officialLink: "https://iimcat.ac.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 7,
    title: "CLAT 2025",
    status: "Application Open",
    notificationDate: "15/01/2025",
    deadline: "15/05/2025",
    examDate: "08/12/2025",
    eligibility: "12th passed or appearing",
    category: "Law",
    conductingBody: "Consortium of NLUs",
    officialLink: "https://consortiumofnlus.ac.in",
    isApplied: false,
    isCart: false
  },
  {
    id: 8,
    title: "NDA 2025 (II)",
    status: "Application Open",
    notificationDate: "31/05/2025",
    deadline: "18/06/2025",
    examDate: "01/09/2025",
    eligibility: "12th passed (unmarried male candidates)",
    category: "Defence",
    conductingBody: "Union Public Service Commission",
    officialLink: "https://upsc.gov.in",
    isApplied: false,
    isCart: false
  }
];

// Function to fetch fresh exam data from Gemini API
export const fetchCompetitiveExams = async () => {
  try {
    // For debugging, let's temporarily disable cache to ensure fresh API calls
    console.log('🔄 Fetching fresh exam data from Gemini API (cache disabled for debugging)...');
    
    // Add minimum loading time to show animation (2 seconds)
    const [examData] = await Promise.all([
      geminiExamService.fetchCompetitiveExams(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    console.log('📊 Received exam data:', {
      count: examData.length,
      firstExam: examData[0]?.title,
      isFromAPI: examData[0]?.title !== "UPSC Civil Services (Prelims) 2025" // Check if it's not fallback data
    });
    
    return examData;
  } catch (error) {
    console.error('❌ Error fetching exam data from Gemini:', error);
    console.log('🔄 Returning default applications as fallback');
    // Return default data if API fails
    return defaultApplications;
  }
};

export const getApplicationsFromStorage = async () => {
  try {
    console.log('🔄 Force fetching fresh exam data (cache disabled for debugging)...');
    
    // Temporarily disable cache to ensure we get fresh data
    const freshData = await fetchCompetitiveExams();
    
    // Cache the fresh data
    localStorage.setItem('applications', JSON.stringify(freshData));
    localStorage.setItem('applicationsTimestamp', Date.now().toString());
    
    return freshData;
  } catch (error) {
    console.error('❌ Error getting applications:', error);
    
    // If everything fails, return default data
    localStorage.setItem('applications', JSON.stringify(defaultApplications));
    return defaultApplications;
  }
};

export const saveApplicationsToStorage = (applications) => {
  localStorage.setItem('applications', JSON.stringify(applications));
  localStorage.setItem('applicationsTimestamp', Date.now().toString());
};

// Function to refresh exam data manually
export const refreshExamData = async () => {
  try {
    const freshData = await fetchCompetitiveExams();
    
    // Update cache
    localStorage.setItem('applications', JSON.stringify(freshData));
    localStorage.setItem('applicationsTimestamp', Date.now().toString());
    
    return freshData;
  } catch (error) {
    console.error('Error refreshing exam data:', error);
    return defaultApplications;
  }
}; 