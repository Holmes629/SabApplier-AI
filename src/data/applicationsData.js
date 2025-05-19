export const defaultApplications = [
  {
    id: 1,
    title: "SSC CGL 2025",
    status: "Application is opening soon",
    notificationDate: "09/06/2025",
    deadline: "04/07/2025",
    examDate: "13/08/2025 to 30/08/2025",
    eligibility: "Graduate",
    isApplied: false,
    isCart: false,
    officialLink: "https://forms.gle/Cgt4Pzv27M9EtmZY9"
  },
  {
    id: 2,
    title: "UPSC Combined Geo-Scientist (Prelim) 2026",
    status: "Application is opening soon",
    notificationDate: "03/09/2025",
    deadline: "24/09/2025",
    examDate: "08/02/2026",
    eligibility: "Graduate (Science)",
    isApplied: false,
    isCart: false,
    officialLink: "https://forms.gle/Cgt4Pzv27M9EtmZY9"
  },
  {
    id: 3,
    title: "UPSC Engineering Services (Prelim) 2026",
    status: "Application is opening soon",
    notificationDate: "17/09/2025",
    deadline: "07/10/2025",
    examDate: "08/02/2026",
    eligibility: "Engineering Graduate",
    isApplied: false,
    isCart: false,
    officialLink: "https://forms.gle/Cgt4Pzv27M9EtmZY9"
  },
  {
    id: 4,
    title: "Indian Overseas Bank LBO (Local Bank Officer)",
    status: "Application is open",
    notificationDate: "12/05/2025",
    deadline: "31/05/2025",
    examDate: "08/02/2026",
    eligibility: "Engineering Graduate",
    isApplied: false,
    isCart: false,
    officialLink: "https://iob.in"
  },
  {
    id: 5,
    title: "ECIL Recruitment 2025",
    status: "Application is open",
    notificationDate: "16/05/2025 (14:00 Hrs)",
    deadline: "05/06/2025 (14:00 Hrs)",
    examDate: "dd/mm/yyyy",
    eligibility: "",
    isApplied: false,
    isCart: false,
    officialLink: "https://www.ecil.co.in"
  },
  {
    id: 6,
    title: "Income Tax Department Recruitment 2025",
    status: "Application is open",
    notificationDate: "12/04/2025",
    deadline: "31/05/2025",
    examDate: "dd/mm/yyyy",
    eligibility: "",
    isApplied: false,
    isCart: false,
    officialLink: "https://incometaxindia.gov.in"
  },
  {
    id: 7,
    title: "Rail Land Development Authority Recruitment 2025",
    status: "Application is open",
    notificationDate: "13/05/2025",
    deadline: "30/05/2025",
    examDate: "dd/mm/yyyy",
    eligibility: "",
    isApplied: false,
    isCart: false,
    officialLink: "https://indianrailways.gov.in"
  },
  {
    id: 8,
    title: "SVPNPA Recruitment 2025",
    status: "Application is open",
    notificationDate: "05/03/2025",
    deadline: "30/06/2025",
    examDate: "dd/mm/yyyy",
    eligibility: "",
    isApplied: false,
    isCart: false,
    officialLink: "https://svpnpa.gov.in"
  }
];

export const getApplicationsFromStorage = () => {
  // Clear existing applications from localStorage
  localStorage.removeItem('applications');
  // Save and return default applications
  localStorage.setItem('applications', JSON.stringify(defaultApplications));
  return defaultApplications;
};

export const saveApplicationsToStorage = (applications) => {
  localStorage.setItem('applications', JSON.stringify(applications));
}; 