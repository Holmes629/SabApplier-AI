import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBkUjKP2N3RxB6todhB5JpHSFL7iMDoAw4");

export class GeminiExamService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async fetchCompetitiveExams() {
    const prompt = `Generate a JSON array of exactly 9 current competitive and higher education exams in India for 2025-2026. Include only real, major exams covering all categories.

For each exam, provide this exact structure:
{
  "id": number,
  "title": "Exam Name",
  "status": "Application Open" or "Application Closed" or "Coming Soon" or "Result Declared",
  "notificationDate": "DD/MM/YYYY",
  "deadline": "DD/MM/YYYY",
  "examDate": "DD/MM/YYYY to DD/MM/YYYY" or "DD/MM/YYYY",
  "eligibility": "Brief eligibility criteria",
  "category": "Government/Engineering/Medical/Management/Law/Banking/Defence/Teaching/Railway",
  "conductingBody": "Organization Name",
  "officialLink": "https://official-website.com",
  "isApplied": false,
  "isCart": false
}

Include exactly ONE exam from each of these 9 categories:
1. Government (UPSC Civil Services)
2. Engineering (JEE Main or GATE)
3. Medical (NEET UG)
4. Banking (IBPS PO or SBI PO)
5. Management (CAT)
6. Law (CLAT)
7. Defence (NDA or AFCAT)
8. Teaching (UGC NET or CTET)
9. Railway (RRB NTPC or Group D)

Return only valid JSON array without any markdown formatting or explanations.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Log the actual API response data
      console.log('Gemini API Response - Real-time Exam Details:', JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim()));
      
      // Clean up the response to ensure it's valid JSON
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const examsData = JSON.parse(cleanText);
        return Array.isArray(examsData) ? examsData : this.getFallbackExamData();
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        return this.getFallbackExamData();
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getFallbackExamData();
    }
  }

  getFallbackExamData() {
    return [
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
      },
      {
        id: 8,
        title: "UGC NET 2025",
        status: "Application Open",
        notificationDate: "01/03/2025",
        deadline: "30/03/2025",
        examDate: "21/05/2025 to 10/06/2025",
        eligibility: "Master's degree with 55%",
        category: "Teaching",
        conductingBody: "National Testing Agency",
        officialLink: "https://ugcnet.nta.nic.in",
        isApplied: false,
        isCart: false
      },
      {
        id: 9,
        title: "RRB NTPC 2025",
        status: "Coming Soon",
        notificationDate: "15/07/2025",
        deadline: "14/08/2025",
        examDate: "TBA",
        eligibility: "12th passed for most posts",
        category: "Railway",
        conductingBody: "Railway Recruitment Board",
        officialLink: "https://indianrailways.gov.in",
        isApplied: false,
        isCart: false
      }
    ];
  }
}

export const geminiExamService = new GeminiExamService();
