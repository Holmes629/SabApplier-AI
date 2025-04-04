export const defaultApplications = [
  {
    id: 1,
    title: "JEE Mains 2025",
    status: "Application is opening soon",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: false,
    isCart: false,
    officialLink: "https://jeemain.nta.nic.in/"
  },
  {
    id: 2,
    title: "JEE Advanced 2025",
    status: "Application is open",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: true,
    isCart: false,
    officialLink: "https://jeeadv.ac.in/"
  },
  {
    id: 3,
    title: "NEET 2025",
    status: "Application is opening soon",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: false,
    isCart: false,
    officialLink: "https://neet.nta.nic.in/"
  },
  {
    id: 4,
    title: "Railway Group D 2025",
    status: "Application is open",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: false,
    isCart: false
  },
  {
    id: 5,
    title: "SSC CGL 2025",
    status: "Application is opening soon",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: false,
    isCart: false,
    officialLink: "https://ssc.nic.in/cgl2025"
  },
  {
    id: 6,
    title: "SSC CHSL 2025",
    status: "Application is opening soon",
    applicationFees: "NA",
    deadline: "dd/mm/yyyy",
    isApplied: false,
    isCart: false,
    officialLink: "https://ssc.nic.in/chsl2025"
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