import type { Department, EmploymentType, JobCategory, QualificationLevel } from '../types/career';

interface RawCategoryDef {
  number: number;
  title: string;
  qualification: QualificationLevel;
  qualDetail: string;
  types: EmploymentType[];
}

interface RawDepartmentDef {
  code: string;
  name: string;
  summary: string;
  categories: RawCategoryDef[];
}

const RAW_DEPARTMENTS: RawDepartmentDef[] = [
  {
    code: 'A',
    name: 'Healthcare',
    summary: 'Clinical care, hospital operations, diagnostics, pharmacy, and public health delivery across U.S. medical institutions.',
    categories: [
      { number: 1, title: 'Registered Nurse', qualification: 'Professional License / Certification', qualDetail: 'Active State RN License and ADN or BSN degree', types: ['Full-time', 'Part-time', 'Contract', 'Temporary'] },
      { number: 2, title: 'Nursing Assistant', qualification: 'High School / Trade', qualDetail: 'State-approved CNA training program and certification', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 3, title: 'Medical Doctor', qualification: "Master's / Doctoral", qualDetail: 'MD or DO degree, residency completion, and state medical licensure', types: ['Full-time', 'Contract'] },
      { number: 4, title: 'Surgeon', qualification: "Master's / Doctoral", qualDetail: 'MD/DO, surgical residency, and board eligibility or certification', types: ['Full-time', 'Contract'] },
      { number: 5, title: 'Pharmacist', qualification: "Master's / Doctoral", qualDetail: 'PharmD degree and active state pharmacy licensure', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 6, title: 'Medical Laboratory Scientist', qualification: "Bachelor's Degree", qualDetail: 'BS in Medical Laboratory Science and ASCP or equivalent certification', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 7, title: 'Radiologist', qualification: "Master's / Doctoral", qualDetail: 'MD/DO with diagnostic radiology residency and state license', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 8, title: 'Dentist', qualification: "Master's / Doctoral", qualDetail: 'DDS or DMD degree and state dental board licensure', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 9, title: 'Physiotherapist', qualification: "Master's / Doctoral", qualDetail: 'DPT degree and state physical therapy license', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 10, title: 'Healthcare Administrator', qualification: "Bachelor's Degree", qualDetail: "Bachelor's or Master's in Health Administration or Management", types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'B',
    name: 'Military & Defence',
    summary: 'National defense operations, cybersecurity readiness, logistics command, and defense engineering support.',
    categories: [
      { number: 11, title: 'Army Personnel', qualification: 'High School / Trade', qualDetail: 'High school diploma or equivalent and service eligibility requirements', types: ['Full-time'] },
      { number: 12, title: 'Navy Personnel', qualification: 'High School / Trade', qualDetail: 'High school diploma or equivalent and maritime service qualifications', types: ['Full-time'] },
      { number: 13, title: 'Air Force Personnel', qualification: 'High School / Trade', qualDetail: 'High school diploma or equivalent and technical aptitude standards', types: ['Full-time'] },
      { number: 14, title: 'Military Police', qualification: 'Professional License / Certification', qualDetail: 'Law enforcement academy training and security clearance eligibility', types: ['Full-time'] },
      { number: 15, title: 'Cyber Operations Specialist', qualification: "Bachelor's Degree", qualDetail: 'Cybersecurity coursework or CompTIA/ISC2 certification and clearance eligibility', types: ['Full-time', 'Contract'] },
      { number: 16, title: 'Intelligence Analyst', qualification: "Bachelor's Degree", qualDetail: "Bachelor's in Intelligence Studies, Political Science, or Data Analytics", types: ['Full-time', 'Contract'] },
      { number: 17, title: 'Logistics Specialist', qualification: 'Associate Degree', qualDetail: 'Supply chain or military logistics coordination experience', types: ['Full-time', 'Contract'] },
      { number: 18, title: 'Military Engineer', qualification: "Bachelor's Degree", qualDetail: "Bachelor's in Civil, Mechanical, or Combat Engineering disciplines", types: ['Full-time', 'Contract'] },
      { number: 19, title: 'Security Specialist', qualification: 'Professional License / Certification', qualDetail: 'Physical and operational security certification and background vetting', types: ['Full-time', 'Contract'] },
      { number: 20, title: 'Defence Administrator', qualification: "Bachelor's Degree", qualDetail: 'Public administration or defense program management degree', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'C',
    name: 'Police & Law Enforcement',
    summary: 'Municipal, state, and federal public safety, criminal investigations, dispatch, and forensic analysis.',
    categories: [
      { number: 21, title: 'Police Officer', qualification: 'Professional License / Certification', qualDetail: 'State POST certification and police academy graduation', types: ['Full-time'] },
      { number: 22, title: 'State Trooper', qualification: 'Professional License / Certification', qualDetail: 'State Highway Patrol academy completion and physical readiness', types: ['Full-time'] },
      { number: 23, title: 'Detective', qualification: 'Professional License / Certification', qualDetail: 'Sworn officer credentials and investigative experience', types: ['Full-time'] },
      { number: 24, title: 'Criminal Investigator', qualification: "Bachelor's Degree", qualDetail: "Bachelor's in Criminal Justice or related field and investigative training", types: ['Full-time', 'Contract'] },
      { number: 25, title: 'Border Patrol Agent', qualification: 'Professional License / Certification', qualDetail: 'Federal law enforcement academy training and U.S. citizenship eligibility', types: ['Full-time'] },
      { number: 26, title: 'FBI Special Agent', qualification: "Bachelor's Degree", qualDetail: "Bachelor's degree, qualifying professional experience, and federal academy", types: ['Full-time'] },
      { number: 27, title: 'Correctional Officer', qualification: 'High School / Trade', qualDetail: 'High school diploma and state/federal corrections academy certification', types: ['Full-time', 'Part-time'] },
      { number: 28, title: 'Forensic Investigator', qualification: "Bachelor's Degree", qualDetail: "Bachelor's in Forensic Science, Chemistry, or Biology", types: ['Full-time', 'Contract'] },
      { number: 29, title: 'Emergency Dispatcher', qualification: 'High School / Trade', qualDetail: 'Public safety telecommunicator training and typing proficiency', types: ['Full-time', 'Part-time'] },
      { number: 30, title: 'Crime Analyst', qualification: "Bachelor's Degree", qualDetail: 'Degree in Criminology, GIS, or Statistics and data modeling skills', types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'D',
    name: 'Technology & IT',
    summary: 'Software engineering, cloud infrastructure, cybersecurity, artificial intelligence, and enterprise systems.',
    categories: [
      { number: 31, title: 'Software Engineer', qualification: "Bachelor's Degree", qualDetail: "BS in Computer Science or equivalent production engineering experience", types: ['Full-time', 'Contract', 'Internship', 'Remote'] },
      { number: 32, title: 'Web Developer', qualification: 'Associate Degree', qualDetail: 'Frontend/Full-stack web development portfolio and modern frameworks', types: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
      { number: 33, title: 'Mobile App Developer', qualification: "Bachelor's Degree", qualDetail: 'iOS/Android engineering experience (Swift, Kotlin, or React Native)', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 34, title: 'Cybersecurity Analyst', qualification: "Bachelor's Degree", qualDetail: 'Security+ / CISSP / CEH certification or Cybersecurity degree', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 35, title: 'Data Scientist', qualification: "Master's / Doctoral", qualDetail: 'Degree in Statistics, Data Science, or Applied Math with Python/SQL', types: ['Full-time', 'Contract', 'Internship', 'Remote'] },
      { number: 36, title: 'Artificial Intelligence Engineer', qualification: "Master's / Doctoral", qualDetail: 'ML/AI engineering background, model deployment, and Python proficiency', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 37, title: 'Cloud Engineer', qualification: "Bachelor's Degree", qualDetail: 'AWS, GCP, or Azure architecture certification and IaC experience', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 38, title: 'Network Administrator', qualification: 'Associate Degree', qualDetail: 'CompTIA Network+ / Cisco CCNA and enterprise routing experience', types: ['Full-time', 'Contract'] },
      { number: 39, title: 'IT Support Specialist', qualification: 'High School / Trade', qualDetail: 'CompTIA A+ or helpdesk administration experience', types: ['Full-time', 'Part-time', 'Temporary', 'Remote'] },
      { number: 40, title: 'Database Administrator', qualification: "Bachelor's Degree", qualDetail: 'SQL/NoSQL administration, backup recovery, and performance tuning', types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'E',
    name: 'Engineering',
    summary: 'Civil infrastructure, mechanical systems, electrical grids, aerospace, robotics, and industrial engineering.',
    categories: [
      { number: 41, title: 'Civil Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Civil Engineering and EIT/PE licensure pathway', types: ['Full-time', 'Contract', 'Internship'] },
      { number: 42, title: 'Mechanical Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Mechanical Engineering and CAD/FEA experience', types: ['Full-time', 'Contract', 'Internship'] },
      { number: 43, title: 'Electrical Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Electrical Engineering and power/embedded systems design', types: ['Full-time', 'Contract'] },
      { number: 44, title: 'Chemical Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Chemical Engineering and process safety expertise', types: ['Full-time', 'Contract'] },
      { number: 45, title: 'Aerospace Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS/MS in Aerospace Engineering and propulsion or avionics systems', types: ['Full-time', 'Internship'] },
      { number: 46, title: 'Petroleum Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Petroleum Engineering and reservoir/drilling operations', types: ['Full-time', 'Contract'] },
      { number: 47, title: 'Robotics Engineer', qualification: "Master's / Doctoral", qualDetail: 'Robotics, Mechatronics, or Control Systems engineering degree', types: ['Full-time', 'Contract'] },
      { number: 48, title: 'Biomedical Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Biomedical Engineering and FDA medical device standards', types: ['Full-time', 'Internship'] },
      { number: 49, title: 'Industrial Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Industrial Engineering and Lean/Six Sigma process optimization', types: ['Full-time', 'Contract'] },
      { number: 50, title: 'Environmental Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Environmental Engineering and EPA compliance knowledge', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'F',
    name: 'Education',
    summary: 'K-12 instruction, higher education faculty, educational leadership, counseling, and digital learning.',
    categories: [
      { number: 51, title: 'Primary School Teacher', qualification: "Bachelor's Degree", qualDetail: "Bachelor's in Elementary Education and state teaching credential", types: ['Full-time', 'Temporary'] },
      { number: 52, title: 'High School Teacher', qualification: "Bachelor's Degree", qualDetail: 'Subject-area degree and state secondary teaching license', types: ['Full-time', 'Temporary'] },
      { number: 53, title: 'University Lecturer', qualification: "Master's / Doctoral", qualDetail: "Master's or PhD in academic discipline with teaching portfolio", types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 54, title: 'Professor', qualification: "Master's / Doctoral", qualDetail: 'Terminal doctoral degree and peer-reviewed research record', types: ['Full-time'] },
      { number: 55, title: 'School Administrator', qualification: "Master's / Doctoral", qualDetail: "Master's in Educational Leadership and principal/admin license", types: ['Full-time'] },
      { number: 56, title: 'Teaching Assistant', qualification: 'Associate Degree', qualDetail: 'Associate degree or paraprofessional educator certification', types: ['Full-time', 'Part-time', 'Internship'] },
      { number: 57, title: 'Special Education Teacher', qualification: "Bachelor's Degree", qualDetail: 'Special Education credential and IEP instruction training', types: ['Full-time', 'Contract'] },
      { number: 58, title: 'School Counselor', qualification: "Master's / Doctoral", qualDetail: "Master's in School Counseling and state pupil services license", types: ['Full-time'] },
      { number: 59, title: 'Education Consultant', qualification: "Master's / Doctoral", qualDetail: 'Curriculum design or academic program advisory background', types: ['Contract', 'Part-time', 'Remote'] },
      { number: 60, title: 'Online Tutor', qualification: "Bachelor's Degree", qualDetail: 'Subject mastery and remote instructional communication skills', types: ['Part-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'G',
    name: 'Aviation',
    summary: 'Flight operations, FAA-regulated aircraft maintenance, air traffic control, and airport management.',
    categories: [
      { number: 61, title: 'Commercial Pilot', qualification: 'Professional License / Certification', qualDetail: 'FAA Commercial Pilot / ATP Certificate and valid medical certificate', types: ['Full-time', 'Contract'] },
      { number: 62, title: 'Flight Attendant', qualification: 'High School / Trade', qualDetail: 'FAA cabin safety training completion and customer service background', types: ['Full-time', 'Part-time'] },
      { number: 63, title: 'Aircraft Mechanic', qualification: 'Professional License / Certification', qualDetail: 'FAA Airframe & Powerplant (A&P) Mechanic Certificate', types: ['Full-time', 'Contract'] },
      { number: 64, title: 'Air Traffic Controller', qualification: 'Professional License / Certification', qualDetail: 'FAA AT-CTI / Academy qualification and medical clearance', types: ['Full-time'] },
      { number: 65, title: 'Airport Security Officer', qualification: 'High School / Trade', qualDetail: 'TSA / airport security screening training and background clearance', types: ['Full-time', 'Part-time'] },
      { number: 66, title: 'Aviation Engineer', qualification: "Bachelor's Degree", qualDetail: 'Aerospace or Avionics engineering degree and FAA compliance experience', types: ['Full-time', 'Contract'] },
      { number: 67, title: 'Flight Dispatcher', qualification: 'Professional License / Certification', qualDetail: 'FAA Aircraft Dispatcher Certificate', types: ['Full-time'] },
      { number: 68, title: 'Airport Operations Manager', qualification: "Bachelor's Degree", qualDetail: 'Aviation Management degree and Part 139 airport operations knowledge', types: ['Full-time'] },
      { number: 69, title: 'Aircraft Inspector', qualification: 'Professional License / Certification', qualDetail: 'FAA Inspection Authorization (IA) and A&P certification', types: ['Full-time', 'Contract'] },
      { number: 70, title: 'Aviation Customer Service Agent', qualification: 'High School / Trade', qualDetail: 'Airline passenger ticketing, gate operations, and hospitality skills', types: ['Full-time', 'Part-time', 'Temporary'] }
    ]
  },
  {
    code: 'H',
    name: 'Construction',
    summary: 'Commercial and residential building, skilled electrical and plumbing trades, heavy equipment, and site safety.',
    categories: [
      { number: 71, title: 'Construction Manager', qualification: "Bachelor's Degree", qualDetail: 'Construction Management degree or extensive site superintendent experience', types: ['Full-time', 'Contract'] },
      { number: 72, title: 'Building Contractor', qualification: 'Professional License / Certification', qualDetail: 'State General Contractor license and project estimating record', types: ['Full-time', 'Contract'] },
      { number: 73, title: 'Electrician', qualification: 'Professional License / Certification', qualDetail: 'Journeyman or Master Electrician license and NEC compliance', types: ['Full-time', 'Contract'] },
      { number: 74, title: 'Plumber', qualification: 'Professional License / Certification', qualDetail: 'Journeyman or Master Plumber license and pipefitting skills', types: ['Full-time', 'Contract'] },
      { number: 75, title: 'Carpenter', qualification: 'High School / Trade', qualDetail: 'Trade apprenticeship or framing/finish carpentry proficiency', types: ['Full-time', 'Contract', 'Temporary'] },
      { number: 76, title: 'Bricklayer', qualification: 'High School / Trade', qualDetail: 'Masonry trade experience and blueprint reading', types: ['Full-time', 'Contract', 'Temporary'] },
      { number: 77, title: 'Heavy Equipment Operator', qualification: 'Professional License / Certification', qualDetail: 'OSHA certification and CDL/NCCCO crane or excavator licensing', types: ['Full-time', 'Contract', 'Temporary'] },
      { number: 78, title: 'Welder', qualification: 'Professional License / Certification', qualDetail: 'AWS welding certification (MIG, TIG, Stick, Structural)', types: ['Full-time', 'Contract'] },
      { number: 79, title: 'Painter', qualification: 'High School / Trade', qualDetail: 'Commercial/residential surface prep and coating experience', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 80, title: 'Construction Safety Officer', qualification: 'Professional License / Certification', qualDetail: 'OSHA 30 / CHST safety certification and site compliance auditing', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'I',
    name: 'Transportation & Logistics',
    summary: 'Freight movement, commercial fleet management, warehousing, and nationwide supply chain coordination.',
    categories: [
      { number: 81, title: 'Truck Driver', qualification: 'Professional License / Certification', qualDetail: 'Valid Class A or Class B Commercial Driver License (CDL) and clean MVR', types: ['Full-time', 'Contract'] },
      { number: 82, title: 'Delivery Driver', qualification: 'High School / Trade', qualDetail: 'Valid driver license, route navigation, and DOT medical card if required', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 83, title: 'Bus Driver', qualification: 'Professional License / Certification', qualDetail: 'CDL with Passenger (P) and School Bus (S) endorsements as applicable', types: ['Full-time', 'Part-time'] },
      { number: 84, title: 'Train Operator', qualification: 'Professional License / Certification', qualDetail: 'FRA Locomotive Engineer / Conductor certification', types: ['Full-time'] },
      { number: 85, title: 'Logistics Manager', qualification: "Bachelor's Degree", qualDetail: 'Supply Chain or Business degree and freight/3PL management experience', types: ['Full-time'] },
      { number: 86, title: 'Warehouse Associate', qualification: 'High School / Trade', qualDetail: 'Inventory picking, packing, WMS scanning, and safety compliance', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 87, title: 'Supply Chain Analyst', qualification: "Bachelor's Degree", qualDetail: 'Supply Chain, Economics, or Data Analytics degree with ERP/Excel skills', types: ['Full-time', 'Internship', 'Remote'] },
      { number: 88, title: 'Forklift Operator', qualification: 'Professional License / Certification', qualDetail: 'OSHA-compliant forklift certification and warehouse safety record', types: ['Full-time', 'Temporary'] },
      { number: 89, title: 'Shipping Coordinator', qualification: 'High School / Trade', qualDetail: 'Bill of lading, customs documentation, and carrier scheduling experience', types: ['Full-time', 'Contract'] },
      { number: 90, title: 'Fleet Manager', qualification: 'Associate Degree', qualDetail: 'DOT compliance, fleet maintenance scheduling, and dispatch leadership', types: ['Full-time'] }
    ]
  },
  {
    code: 'J',
    name: 'Finance & Banking',
    summary: 'Corporate accounting, financial planning, banking operations, auditing, risk management, and insurance.',
    categories: [
      { number: 91, title: 'Accountant', qualification: "Bachelor's Degree", qualDetail: 'BS in Accounting; CPA eligibility or certification preferred', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 92, title: 'Financial Analyst', qualification: "Bachelor's Degree", qualDetail: 'BS in Finance/Economics; financial modeling and forecasting skills', types: ['Full-time', 'Internship', 'Remote'] },
      { number: 93, title: 'Bank Teller', qualification: 'High School / Trade', qualDetail: 'Cash handling accuracy, retail banking operations, and client service', types: ['Full-time', 'Part-time'] },
      { number: 94, title: 'Investment Analyst', qualification: "Bachelor's Degree", qualDetail: 'Finance degree; CFA progress or Series licensing as required', types: ['Full-time', 'Internship'] },
      { number: 95, title: 'Auditor', qualification: "Bachelor's Degree", qualDetail: 'Accounting/Finance degree and GAAP/SOX or CIA/CPA credentials', types: ['Full-time', 'Contract'] },
      { number: 96, title: 'Tax Consultant', qualification: "Bachelor's Degree", qualDetail: 'Enrolled Agent (EA) or CPA credential and U.S. tax code expertise', types: ['Full-time', 'Contract', 'Temporary', 'Remote'] },
      { number: 97, title: 'Loan Officer', qualification: 'Professional License / Certification', qualDetail: 'NMLS registration/licensure and mortgage or commercial underwriting skills', types: ['Full-time', 'Remote'] },
      { number: 98, title: 'Risk Analyst', qualification: "Bachelor's Degree", qualDetail: 'Quantitative Finance, Statistics, or Risk Management background', types: ['Full-time', 'Remote'] },
      { number: 99, title: 'Insurance Agent', qualification: 'Professional License / Certification', qualDetail: 'State Property & Casualty or Life & Health insurance license', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 100, title: 'Financial Manager', qualification: "Bachelor's Degree", qualDetail: 'Finance/Accounting degree with treasury and executive budgeting experience', types: ['Full-time'] }
    ]
  },
  {
    code: 'K',
    name: 'Hospitality & Tourism',
    summary: 'Hotel operations, culinary arts, restaurant leadership, guest services, and destination management.',
    categories: [
      { number: 101, title: 'Hotel Manager', qualification: "Bachelor's Degree", qualDetail: 'Hospitality Management degree or multi-year hotel leadership', types: ['Full-time'] },
      { number: 102, title: 'Hotel Receptionist', qualification: 'High School / Trade', qualDetail: 'Front desk PMS software proficiency and guest relations skills', types: ['Full-time', 'Part-time'] },
      { number: 103, title: 'Chef', qualification: 'Associate Degree', qualDetail: 'Culinary arts training, ServSafe Manager certification, and kitchen leadership', types: ['Full-time'] },
      { number: 104, title: 'Cook', qualification: 'High School / Trade', qualDetail: 'Food safety handler permit and commercial line/prep cooking experience', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 105, title: 'Restaurant Manager', qualification: 'Associate Degree', qualDetail: 'Food service management, P&L scheduling, and health code compliance', types: ['Full-time'] },
      { number: 106, title: 'Waiter', qualification: 'High School / Trade', qualDetail: 'Table service, POS ordering, and hospitality communication skills', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 107, title: 'Housekeeper', qualification: 'High School / Trade', qualDetail: 'Commercial sanitation standards and hospitality room turnover experience', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 108, title: 'Travel Consultant', qualification: 'Associate Degree', qualDetail: 'GDS booking systems, itinerary planning, and client advisory experience', types: ['Full-time', 'Part-time', 'Remote'] },
      { number: 109, title: 'Tour Guide', qualification: 'High School / Trade', qualDetail: 'Public speaking, regional historical knowledge, and group safety', types: ['Part-time', 'Temporary'] },
      { number: 110, title: 'Event Coordinator', qualification: "Bachelor's Degree", qualDetail: 'Event logistics, vendor coordination, and hospitality planning experience', types: ['Full-time', 'Contract', 'Internship'] }
    ]
  },
  {
    code: 'L',
    name: 'Agriculture',
    summary: 'Crop production, livestock stewardship, agricultural science, food inspection, and greenhouse engineering.',
    categories: [
      { number: 111, title: 'Farm Manager', qualification: "Bachelor's Degree", qualDetail: 'Agribusiness or Agronomy degree and commercial farm operations experience', types: ['Full-time'] },
      { number: 112, title: 'Agricultural Scientist', qualification: "Master's / Doctoral", qualDetail: 'Soil science, plant genetics, or agronomy research degree', types: ['Full-time', 'Contract'] },
      { number: 113, title: 'Farm Worker', qualification: 'High School / Trade', qualDetail: 'Planting, harvesting, irrigation, and equipment handling experience', types: ['Full-time', 'Temporary'] },
      { number: 114, title: 'Livestock Manager', qualification: 'Associate Degree', qualDetail: 'Animal science training and herd health/nutrition management', types: ['Full-time'] },
      { number: 115, title: 'Dairy Farm Worker', qualification: 'High School / Trade', qualDetail: 'Milking parlor operations, sanitation, and livestock care', types: ['Full-time', 'Part-time'] },
      { number: 116, title: 'Agricultural Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Agricultural or Biosystems Engineering', types: ['Full-time', 'Contract'] },
      { number: 117, title: 'Horticulturist', qualification: "Bachelor's Degree", qualDetail: 'BS in Horticulture or Plant Science and nursery cultivation experience', types: ['Full-time', 'Temporary'] },
      { number: 118, title: 'Food Production Worker', qualification: 'High School / Trade', qualDetail: 'USDA/FDA food safety compliance and processing line operations', types: ['Full-time', 'Temporary'] },
      { number: 119, title: 'Agricultural Inspector', qualification: "Bachelor's Degree", qualDetail: 'Agricultural regulatory standards and USDA/state inspection training', types: ['Full-time', 'Contract'] },
      { number: 120, title: 'Greenhouse Technician', qualification: 'Associate Degree', qualDetail: 'Climate control, hydroponics, and integrated pest management experience', types: ['Full-time', 'Part-time'] }
    ]
  },
  {
    code: 'M',
    name: 'Manufacturing',
    summary: 'Industrial production, CNC machining, quality assurance, plant supervision, and assembly engineering.',
    categories: [
      { number: 121, title: 'Factory Worker', qualification: 'High School / Trade', qualDetail: 'Manufacturing floor safety, assembly line pacing, and PPE adherence', types: ['Full-time', 'Temporary'] },
      { number: 122, title: 'Production Manager', qualification: "Bachelor's Degree", qualDetail: 'Industrial Management degree and Lean Six Sigma manufacturing leadership', types: ['Full-time'] },
      { number: 123, title: 'Machine Operator', qualification: 'High School / Trade', qualDetail: 'CNC or automated press setup, blueprint reading, and caliper checks', types: ['Full-time', 'Contract'] },
      { number: 124, title: 'Quality Control Inspector', qualification: 'Associate Degree', qualDetail: 'ISO 9001 quality auditing, metrology tools, and defect reporting', types: ['Full-time', 'Contract'] },
      { number: 125, title: 'Assembly Technician', qualification: 'High School / Trade', qualDetail: 'Precision mechanical or electromechanical sub-assembly skills', types: ['Full-time', 'Temporary'] },
      { number: 126, title: 'Industrial Maintenance Technician', qualification: 'Professional License / Certification', qualDetail: 'PLC troubleshooting, hydraulics, pneumatics, and electrical safety', types: ['Full-time'] },
      { number: 127, title: 'Packaging Operator', qualification: 'High School / Trade', qualDetail: 'Automated packaging line operation and lot traceability', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 128, title: 'Manufacturing Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Manufacturing or Mechanical Engineering and tooling design', types: ['Full-time', 'Internship'] },
      { number: 129, title: 'Production Supervisor', qualification: 'Associate Degree', qualDetail: 'Shift leadership, KPI tracking, and OSHA workplace safety compliance', types: ['Full-time'] },
      { number: 130, title: 'Plant Manager', qualification: "Bachelor's Degree", qualDetail: 'Engineering or Operations degree with multi-line plant P&L leadership', types: ['Full-time'] }
    ]
  },
  {
    code: 'N',
    name: 'Retail & Sales',
    summary: 'B2B and consumer sales, store management, e-commerce merchandising, and customer service operations.',
    categories: [
      { number: 131, title: 'Sales Representative', qualification: 'Associate Degree', qualDetail: 'Account development, CRM pipeline management, and consultative sales', types: ['Full-time', 'Remote'] },
      { number: 132, title: 'Store Manager', qualification: 'Associate Degree', qualDetail: 'Retail P&L ownership, inventory control, and team scheduling', types: ['Full-time'] },
      { number: 133, title: 'Cashier', qualification: 'High School / Trade', qualDetail: 'POS checkout accuracy, customer courtesy, and cash reconciliation', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 134, title: 'Retail Assistant', qualification: 'High School / Trade', qualDetail: 'Floor merchandising, restocking, and shopper assistance', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 135, title: 'Customer Service Representative', qualification: 'High School / Trade', qualDetail: 'Multi-channel client resolution, ticketing systems, and communication', types: ['Full-time', 'Part-time', 'Remote'] },
      { number: 136, title: 'Merchandiser', qualification: 'High School / Trade', qualDetail: 'Planogram execution, retail display setup, and stock rotation', types: ['Full-time', 'Part-time'] },
      { number: 137, title: 'E-commerce Manager', qualification: "Bachelor's Degree", qualDetail: 'Digital storefront operations, conversion optimization, and fulfillment', types: ['Full-time', 'Remote'] },
      { number: 138, title: 'Sales Manager', qualification: "Bachelor's Degree", qualDetail: 'Revenue forecasting, territory strategy, and sales team coaching', types: ['Full-time'] },
      { number: 139, title: 'Product Demonstrator', qualification: 'High School / Trade', qualDetail: 'Live product presentation, event promotion, and customer engagement', types: ['Part-time', 'Temporary'] },
      { number: 140, title: 'Retail Supervisor', qualification: 'High School / Trade', qualDetail: 'Shift supervision, opening/closing procedures, and customer escalation', types: ['Full-time', 'Part-time'] }
    ]
  },
  {
    code: 'O',
    name: 'Human Resources',
    summary: 'Talent acquisition, payroll compliance, employee relations, workforce planning, and HR leadership.',
    categories: [
      { number: 141, title: 'HR Manager', qualification: "Bachelor's Degree", qualDetail: 'SHRM-CP / PHR credential and U.S. labor law compliance experience', types: ['Full-time', 'Remote'] },
      { number: 142, title: 'Recruitment Specialist', qualification: "Bachelor's Degree", qualDetail: 'Full-cycle candidate sourcing, ATS workflows, and interview coordination', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 143, title: 'Talent Acquisition Officer', qualification: "Bachelor's Degree", qualDetail: 'Strategic hiring pipeline design and employer branding experience', types: ['Full-time', 'Remote'] },
      { number: 144, title: 'HR Assistant', qualification: 'Associate Degree', qualDetail: 'Onboarding documentation, HRIS data entry, and employee support', types: ['Full-time', 'Part-time', 'Internship'] },
      { number: 145, title: 'Payroll Specialist', qualification: 'Associate Degree', qualDetail: 'Multi-state U.S. payroll processing, tax withholding, and CPP certification', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 146, title: 'Training Coordinator', qualification: "Bachelor's Degree", qualDetail: 'Learning management systems (LMS) and workforce training facilitation', types: ['Full-time', 'Remote'] },
      { number: 147, title: 'Employee Relations Specialist', qualification: "Bachelor's Degree", qualDetail: 'Workplace policy investigation, FMLA/ADA compliance, and mediation', types: ['Full-time', 'Remote'] },
      { number: 148, title: 'Compensation Analyst', qualification: "Bachelor's Degree", qualDetail: 'Salary benchmarking, job leveling, and benefits analysis', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 149, title: 'Workforce Planner', qualification: "Bachelor's Degree", qualDetail: 'Headcount forecasting, shift modeling, and capacity analytics', types: ['Full-time', 'Remote'] },
      { number: 150, title: 'HR Director', qualification: "Master's / Doctoral", qualDetail: 'SHRM-SCP / SPHR credential and executive organizational strategy', types: ['Full-time'] }
    ]
  },
  {
    code: 'P',
    name: 'Legal Services',
    summary: 'Legal counsel, litigation support, regulatory compliance, contract administration, and dispute resolution.',
    categories: [
      { number: 151, title: 'Attorney', qualification: "Master's / Doctoral", qualDetail: 'Juris Doctor (JD) and active State Bar admission', types: ['Full-time', 'Contract'] },
      { number: 152, title: 'Legal Assistant', qualification: 'Associate Degree', qualDetail: 'Legal correspondence, court e-filing, and case calendar management', types: ['Full-time', 'Part-time'] },
      { number: 153, title: 'Paralegal', qualification: 'Professional License / Certification', qualDetail: 'ABA-approved Paralegal Certificate or degree and legal drafting skills', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 154, title: 'Corporate Lawyer', qualification: "Master's / Doctoral", qualDetail: 'JD, active Bar license, and M&A or corporate governance experience', types: ['Full-time', 'Contract'] },
      { number: 155, title: 'Court Reporter', qualification: 'Professional License / Certification', qualDetail: 'Stenographic or digital court reporting certification (RPR/state license)', types: ['Full-time', 'Contract'] },
      { number: 156, title: 'Legal Secretary', qualification: 'High School / Trade', qualDetail: 'Legal transcription, document formatting, and office administration', types: ['Full-time', 'Part-time'] },
      { number: 157, title: 'Compliance Officer', qualification: "Bachelor's Degree", qualDetail: 'Regulatory auditing, corporate ethics, and federal/state compliance', types: ['Full-time', 'Remote'] },
      { number: 158, title: 'Legal Researcher', qualification: "Bachelor's Degree", qualDetail: 'Westlaw/LexisNexis statutory and case law analysis proficiency', types: ['Full-time', 'Contract', 'Internship', 'Remote'] },
      { number: 159, title: 'Mediator', qualification: 'Professional License / Certification', qualDetail: 'State-certified alternative dispute resolution (ADR) mediator training', types: ['Part-time', 'Contract', 'Remote'] },
      { number: 160, title: 'Contract Administrator', qualification: "Bachelor's Degree", qualDetail: 'Commercial/government contract lifecycle review and redlining', types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'Q',
    name: 'Science & Research',
    summary: 'Life sciences, clinical trials, biotechnology, physics, chemistry, and laboratory research.',
    categories: [
      { number: 161, title: 'Microbiologist', qualification: "Bachelor's Degree", qualDetail: 'BS/MS in Microbiology and aseptic culturing/assay protocols', types: ['Full-time', 'Contract'] },
      { number: 162, title: 'Biologist', qualification: "Bachelor's Degree", qualDetail: 'BS in Biology and ecological or cellular research methodology', types: ['Full-time', 'Contract', 'Internship'] },
      { number: 163, title: 'Chemist', qualification: "Bachelor's Degree", qualDetail: 'BS/MS in Chemistry and HPLC/GC analytical instrumentation', types: ['Full-time', 'Contract'] },
      { number: 164, title: 'Physicist', qualification: "Master's / Doctoral", qualDetail: 'MS/PhD in Physics and experimental or computational modeling', types: ['Full-time', 'Contract'] },
      { number: 165, title: 'Research Scientist', qualification: "Master's / Doctoral", qualDetail: 'PhD or advanced R&D track record in scientific discipline', types: ['Full-time', 'Contract'] },
      { number: 166, title: 'Laboratory Technician', qualification: 'Associate Degree', qualDetail: 'Lab sample preparation, calibration, and GLP documentation', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 167, title: 'Biotechnologist', qualification: "Bachelor's Degree", qualDetail: 'BS/MS in Biotechnology, bioprocessing, or molecular assays', types: ['Full-time', 'Internship'] },
      { number: 168, title: 'Genetic Researcher', qualification: "Master's / Doctoral", qualDetail: 'Genetics/Genomics degree and NGS sequencing analysis experience', types: ['Full-time'] },
      { number: 169, title: 'Environmental Scientist', qualification: "Bachelor's Degree", qualDetail: 'Environmental Science degree, NEPA assessments, and field sampling', types: ['Full-time', 'Contract'] },
      { number: 170, title: 'Clinical Research Associate', qualification: "Bachelor's Degree", qualDetail: 'ICH-GCP compliance and clinical trial site monitoring experience', types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'R',
    name: 'Energy & Environment',
    summary: 'Solar and wind power systems, grid modernization, water treatment, nuclear safety, and sustainability.',
    categories: [
      { number: 171, title: 'Solar Energy Technician', qualification: 'High School / Trade', qualDetail: 'NABCEP certification or PV installation and electrical safety training', types: ['Full-time', 'Contract'] },
      { number: 172, title: 'Wind Turbine Technician', qualification: 'Associate Degree', qualDetail: 'Wind energy technology certificate and working-at-heights safety', types: ['Full-time', 'Contract'] },
      { number: 173, title: 'Petroleum Technician', qualification: 'Associate Degree', qualDetail: 'Oil/gas field instrumentation, safety compliance, and well monitoring', types: ['Full-time', 'Contract'] },
      { number: 174, title: 'Renewable Energy Engineer', qualification: "Bachelor's Degree", qualDetail: 'Electrical or Mechanical Engineering degree focused on clean energy grids', types: ['Full-time', 'Contract'] },
      { number: 175, title: 'Environmental Consultant', qualification: "Bachelor's Degree", qualDetail: 'Environmental permitting, remediation planning, and regulatory reporting', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 176, title: 'Water Treatment Operator', qualification: 'Professional License / Certification', qualDetail: 'State Water/Wastewater Treatment Operator certification', types: ['Full-time'] },
      { number: 177, title: 'Environmental Inspector', qualification: "Bachelor's Degree", qualDetail: 'Compliance inspection training for air, water, and hazardous materials', types: ['Full-time', 'Contract'] },
      { number: 178, title: 'Energy Analyst', qualification: "Bachelor's Degree", qualDetail: 'Energy markets, utility forecasting, and efficiency auditing skills', types: ['Full-time', 'Remote'] },
      { number: 179, title: 'Nuclear Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS/MS in Nuclear Engineering and NRC regulatory safety standards', types: ['Full-time'] },
      { number: 180, title: 'Sustainability Manager', qualification: "Bachelor's Degree", qualDetail: 'ESG reporting, carbon accounting, and corporate sustainability programs', types: ['Full-time', 'Remote'] }
    ]
  },
  {
    code: 'S',
    name: 'Media & Entertainment',
    summary: 'Journalism, broadcasting, film production, graphic design, photography, and digital media.',
    categories: [
      { number: 181, title: 'Journalist', qualification: "Bachelor's Degree", qualDetail: 'Journalism/Communications degree and published reporting portfolio', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 182, title: 'News Reporter', qualification: "Bachelor's Degree", qualDetail: 'Broadcast or print field reporting and editorial deadline experience', types: ['Full-time', 'Contract'] },
      { number: 183, title: 'Photographer', qualification: 'Associate Degree', qualDetail: 'Commercial, editorial, or event photography portfolio and lighting skills', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 184, title: 'Video Editor', qualification: 'Associate Degree', qualDetail: 'Premiere Pro / DaVinci Resolve post-production and color grading reel', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 185, title: 'Film Director', qualification: "Bachelor's Degree", qualDetail: 'Film production directing credits and creative storyboarding leadership', types: ['Contract', 'Full-time'] },
      { number: 186, title: 'Graphic Designer', qualification: "Bachelor's Degree", qualDetail: 'Brand identity, typography, and Adobe Creative Cloud portfolio', types: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
      { number: 187, title: 'Content Creator', qualification: 'High School / Trade', qualDetail: 'Digital storytelling, multimedia production, and audience analytics', types: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
      { number: 188, title: 'Social Media Manager', qualification: "Bachelor's Degree", qualDetail: 'Multi-platform campaign management, copywriting, and growth metrics', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 189, title: 'Radio Presenter', qualification: 'Associate Degree', qualDetail: 'Broadcast voice hosting, live audio board operation, and scripting', types: ['Full-time', 'Part-time'] },
      { number: 190, title: 'Television Producer', qualification: "Bachelor's Degree", qualDetail: 'Rundown production, segment coordination, and studio broadcast control', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'T',
    name: 'Government & Public Administration',
    summary: 'Federal, state, and municipal administration, public policy, urban planning, and civic services.',
    categories: [
      { number: 191, title: 'Government Administrator', qualification: "Bachelor's Degree", qualDetail: 'Public Administration degree and agency operations experience', types: ['Full-time'] },
      { number: 192, title: 'Public Relations Officer', qualification: "Bachelor's Degree", qualDetail: 'Media relations, press releases, and crisis communications expertise', types: ['Full-time', 'Remote'] },
      { number: 193, title: 'Policy Analyst', qualification: "Master's / Doctoral", qualDetail: 'MPP or Public Policy degree with legislative/regulatory analysis', types: ['Full-time', 'Contract', 'Internship', 'Remote'] },
      { number: 194, title: 'City Planner', qualification: "Master's / Doctoral", qualDetail: 'Urban/Regional Planning degree; AICP certification preferred', types: ['Full-time'] },
      { number: 195, title: 'Government Accountant', qualification: "Bachelor's Degree", qualDetail: 'Fund accounting, GASB standards, and public budget auditing', types: ['Full-time'] },
      { number: 196, title: 'Public Affairs Specialist', qualification: "Bachelor's Degree", qualDetail: 'Civic stakeholder outreach and institutional communications', types: ['Full-time', 'Remote'] },
      { number: 197, title: 'Immigration Services Officer', qualification: "Bachelor's Degree", qualDetail: 'Federal eligibility adjudication training and U.S. citizenship', types: ['Full-time'] },
      { number: 198, title: 'Civil Service Officer', qualification: "Bachelor's Degree", qualDetail: 'Civil service examination qualification and public administration skills', types: ['Full-time'] },
      { number: 199, title: 'Public Health Officer', qualification: "Master's / Doctoral", qualDetail: 'MPH or medical background in epidemiology and community health', types: ['Full-time'] },
      { number: 200, title: 'Community Development Officer', qualification: "Bachelor's Degree", qualDetail: 'Grant administration, housing initiatives, and civic partnership skills', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'U',
    name: 'Emergency Services',
    summary: 'Fire suppression, emergency medical response, disaster preparedness, and search-and-rescue operations.',
    categories: [
      { number: 201, title: 'Firefighter', qualification: 'Professional License / Certification', qualDetail: 'Firefighter I/II certification, CPAT, and EMT credentials', types: ['Full-time'] },
      { number: 202, title: 'Paramedic', qualification: 'Professional License / Certification', qualDetail: 'NREMT-Paramedic and state EMS licensure', types: ['Full-time', 'Part-time'] },
      { number: 203, title: 'Emergency Medical Technician', qualification: 'Professional License / Certification', qualDetail: 'NREMT Basic/Advanced certification and CPR/BLS', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 204, title: 'Emergency Management Specialist', qualification: "Bachelor's Degree", qualDetail: 'FEMA ICS/NIMS certifications and emergency continuity planning', types: ['Full-time', 'Contract'] },
      { number: 205, title: 'Disaster Response Officer', qualification: "Bachelor's Degree", qualDetail: 'Incident command coordination and crisis logistics deployment', types: ['Full-time', 'Temporary'] },
      { number: 206, title: 'Rescue Technician', qualification: 'Professional License / Certification', qualDetail: 'Technical rope, confined space, and swift-water rescue certifications', types: ['Full-time', 'Contract'] },
      { number: 207, title: 'Fire Inspector', qualification: 'Professional License / Certification', qualDetail: 'NFPA Fire Inspector I/II certification and building code auditing', types: ['Full-time'] },
      { number: 208, title: 'Emergency Communications Operator', qualification: 'High School / Trade', qualDetail: 'EMD certification and multi-line 911 CAD dispatch proficiency', types: ['Full-time', 'Part-time'] },
      { number: 209, title: 'Search and Rescue Specialist', qualification: 'Professional License / Certification', qualDetail: 'SAR field navigation, wilderness EMS, and incident command training', types: ['Full-time', 'Contract'] },
      { number: 210, title: 'Fire Safety Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Fire Protection Engineering and life-safety sprinkler/alarm design', types: ['Full-time', 'Contract'] }
    ]
  },
  {
    code: 'V',
    name: 'Real Estate',
    summary: 'Residential and commercial brokerage, property management, mortgage finance, valuation, and facilities.',
    categories: [
      { number: 211, title: 'Real Estate Agent', qualification: 'Professional License / Certification', qualDetail: 'Active State Real Estate Salesperson or Broker license', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 212, title: 'Property Manager', qualification: 'Associate Degree', qualDetail: 'Tenant relations, lease administration, and CAM/maintenance budgeting', types: ['Full-time'] },
      { number: 213, title: 'Real Estate Analyst', qualification: "Bachelor's Degree", qualDetail: 'ARGUS/Excel real estate underwriting and market feasibility modeling', types: ['Full-time', 'Internship', 'Remote'] },
      { number: 214, title: 'Property Inspector', qualification: 'Professional License / Certification', qualDetail: 'State Home/Commercial Inspector license and structural reporting', types: ['Full-time', 'Contract'] },
      { number: 215, title: 'Mortgage Consultant', qualification: 'Professional License / Certification', qualDetail: 'NMLS Mortgage Loan Originator (MLO) license', types: ['Full-time', 'Remote'] },
      { number: 216, title: 'Leasing Consultant', qualification: 'High School / Trade', qualDetail: 'Property tours, Fair Housing compliance, and lease execution', types: ['Full-time', 'Part-time'] },
      { number: 217, title: 'Real Estate Appraiser', qualification: 'Professional License / Certification', qualDetail: 'State Certified Residential or General Appraiser credential', types: ['Full-time', 'Contract'] },
      { number: 218, title: 'Facilities Manager', qualification: "Bachelor's Degree", qualDetail: 'Commercial building HVAC/MEP vendor management and safety compliance', types: ['Full-time'] },
      { number: 219, title: 'Real Estate Attorney', qualification: "Master's / Doctoral", qualDetail: 'JD, active State Bar license, and commercial title/zoning experience', types: ['Full-time', 'Contract'] },
      { number: 220, title: 'Property Administrator', qualification: 'Associate Degree', qualDetail: 'Lease abstracts, vendor invoicing, and tenant portal coordination', types: ['Full-time', 'Remote'] }
    ]
  },
  {
    code: 'W',
    name: 'Beauty & Personal Care',
    summary: 'Licensed cosmetology, barbering, esthetics, massage therapy, and spa operations.',
    categories: [
      { number: 221, title: 'Hair Stylist', qualification: 'Professional License / Certification', qualDetail: 'Active State Cosmetology license and cutting/coloring portfolio', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 222, title: 'Barber', qualification: 'Professional License / Certification', qualDetail: 'Active State Barber license and precision grooming expertise', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 223, title: 'Makeup Artist', qualification: 'High School / Trade', qualDetail: 'Bridal, editorial, or retail cosmetic artistry portfolio and sanitation', types: ['Part-time', 'Contract', 'Temporary'] },
      { number: 224, title: 'Cosmetologist', qualification: 'Professional License / Certification', qualDetail: 'State Board Cosmetology license across hair, skin, and nail care', types: ['Full-time', 'Part-time'] },
      { number: 225, title: 'Nail Technician', qualification: 'Professional License / Certification', qualDetail: 'State Manicurist / Nail Technician license and hygiene compliance', types: ['Full-time', 'Part-time'] },
      { number: 226, title: 'Massage Therapist', qualification: 'Professional License / Certification', qualDetail: 'State Massage Therapy License (LMT) and anatomy certification', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 227, title: 'Skincare Specialist', qualification: 'Professional License / Certification', qualDetail: 'State Esthetician license and clinical facial treatment experience', types: ['Full-time', 'Part-time'] },
      { number: 228, title: 'Spa Manager', qualification: 'Associate Degree', qualDetail: 'Wellness facility operations, staff scheduling, and retail inventory', types: ['Full-time'] },
      { number: 229, title: 'Beauty Consultant', qualification: 'High School / Trade', qualDetail: 'Product advisory, shade matching, and customer service skills', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 230, title: 'Salon Receptionist', qualification: 'High School / Trade', qualDetail: 'Appointment booking software, client check-in, and POS checkout', types: ['Full-time', 'Part-time'] }
    ]
  },
  {
    code: 'X',
    name: 'Automotive',
    summary: 'Vehicle diagnostics, ASE-certified mechanical repair, diesel fleets, collision body work, and dealership operations.',
    categories: [
      { number: 231, title: 'Automotive Mechanic', qualification: 'Professional License / Certification', qualDetail: 'ASE Automotive Service Excellence certifications and diagnostic tools', types: ['Full-time', 'Contract'] },
      { number: 232, title: 'Auto Electrician', qualification: 'Professional License / Certification', qualDetail: 'EV/hybrid high-voltage safety and automotive wiring diagnostics', types: ['Full-time', 'Contract'] },
      { number: 233, title: 'Vehicle Inspector', qualification: 'Professional License / Certification', qualDetail: 'State safety and emissions inspection licensing', types: ['Full-time', 'Part-time'] },
      { number: 234, title: 'Automotive Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Mechanical or Automotive Engineering and powertrain/chassis design', types: ['Full-time', 'Internship'] },
      { number: 235, title: 'Car Sales Consultant', qualification: 'High School / Trade', qualDetail: 'Valid driver license, dealership CRM, and vehicle product knowledge', types: ['Full-time'] },
      { number: 236, title: 'Diesel Mechanic', qualification: 'Professional License / Certification', qualDetail: 'ASE Medium/Heavy Truck certification and diesel engine repair', types: ['Full-time', 'Contract'] },
      { number: 237, title: 'Body Repair Technician', qualification: 'Professional License / Certification', qualDetail: 'I-CAR collision frame straightening and panel replacement', types: ['Full-time'] },
      { number: 238, title: 'Automotive Painter', qualification: 'High School / Trade', qualDetail: 'HVLP spray booth refinishing, color matching, and EPA compliance', types: ['Full-time'] },
      { number: 239, title: 'Service Advisor', qualification: 'High School / Trade', qualDetail: 'Repair order estimation, warranty claims, and customer communication', types: ['Full-time'] },
      { number: 240, title: 'Automotive Technician', qualification: 'Associate Degree', qualDetail: 'OEM factory-trained maintenance and computer diagnostics', types: ['Full-time', 'Internship'] }
    ]
  },
  {
    code: 'Y',
    name: 'Social & Community Services',
    summary: 'Social work, family advocacy, rehabilitation counseling, case management, and nonprofit outreach.',
    categories: [
      { number: 241, title: 'Social Worker', qualification: "Master's / Doctoral", qualDetail: 'BSW or MSW and state LMSW/LCSW licensure', types: ['Full-time', 'Contract'] },
      { number: 242, title: 'Community Health Worker', qualification: 'High School / Trade', qualDetail: 'Public health outreach training and community resource navigation', types: ['Full-time', 'Part-time'] },
      { number: 243, title: 'Youth Counselor', qualification: "Bachelor's Degree", qualDetail: 'Psychology, Social Work, or Youth Development degree', types: ['Full-time', 'Part-time'] },
      { number: 244, title: 'Family Support Worker', qualification: 'Associate Degree', qualDetail: 'Family advocacy, home visit support, and crisis de-escalation', types: ['Full-time', 'Part-time'] },
      { number: 245, title: 'Rehabilitation Counselor', qualification: "Master's / Doctoral", qualDetail: 'Master in Rehabilitation Counseling and CRC credential', types: ['Full-time'] },
      { number: 246, title: 'Childcare Worker', qualification: 'High School / Trade', qualDetail: 'CDA credential, CPR/First Aid, and state childcare background check', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 247, title: 'Community Outreach Officer', qualification: "Bachelor's Degree", qualDetail: 'Program engagement, civic partnerships, and bilingual skills helpful', types: ['Full-time', 'Contract'] },
      { number: 248, title: 'Case Manager', qualification: "Bachelor's Degree", qualDetail: 'Social Services degree and client care plan coordination', types: ['Full-time', 'Remote'] },
      { number: 249, title: 'Disability Support Worker', qualification: 'High School / Trade', qualDetail: 'Direct support professional (DSP) training and caregiver certification', types: ['Full-time', 'Part-time'] },
      { number: 250, title: 'Nonprofit Program Manager', qualification: "Bachelor's Degree", qualDetail: 'Grant compliance, volunteer leadership, and community impact delivery', types: ['Full-time', 'Remote'] }
    ]
  },
  {
    code: 'Z',
    name: 'Telecommunications',
    summary: '5G wireless networks, fiber optic deployment, satellite links, RF engineering, and telecom infrastructure.',
    categories: [
      { number: 251, title: 'Telecommunications Engineer', qualification: "Bachelor's Degree", qualDetail: 'BS in Electrical or Telecom Engineering and carrier network design', types: ['Full-time', 'Contract'] },
      { number: 252, title: 'Fiber Optic Technician', qualification: 'Professional License / Certification', qualDetail: 'FOA CFOT certification, fusion splicing, and OTDR testing', types: ['Full-time', 'Contract'] },
      { number: 253, title: 'Telecom Installer', qualification: 'High School / Trade', qualDetail: 'Structured cabling, premise equipment installation, and safety gear', types: ['Full-time', 'Temporary'] },
      { number: 254, title: 'Network Engineer', qualification: "Bachelor's Degree", qualDetail: 'CCNP / Juniper certification and BGP/MPLS core routing experience', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 255, title: 'Satellite Technician', qualification: 'Associate Degree', qualDetail: 'VSAT dish alignment, RF signal testing, and telemetry diagnostics', types: ['Full-time', 'Contract'] },
      { number: 256, title: 'Radio Frequency Engineer', qualification: "Bachelor's Degree", qualDetail: 'RF propagation modeling, spectrum analysis, and 5G/LTE optimization', types: ['Full-time', 'Contract'] },
      { number: 257, title: 'Telecom Support Specialist', qualification: 'Associate Degree', qualDetail: 'NOC monitoring, VoIP troubleshooting, and carrier ticket escalation', types: ['Full-time', 'Remote'] },
      { number: 258, title: 'Tower Technician', qualification: 'Professional License / Certification', qualDetail: 'NWSA / ComTrain tower climbing and RF hazard safety certification', types: ['Full-time', 'Contract'] },
      { number: 259, title: 'Communications Analyst', qualification: "Bachelor's Degree", qualDetail: 'Enterprise voice/data billing auditing and telecom capacity planning', types: ['Full-time', 'Remote'] },
      { number: 260, title: 'Telecom Project Manager', qualification: "Bachelor's Degree", qualDetail: 'PMP certification and broadband/cell-site rollout coordination', types: ['Full-time', 'Contract', 'Remote'] }
    ]
  },
  {
    code: 'AA',
    name: 'Business & Management',
    summary: 'Corporate strategy, operations management, procurement, executive support, and management consulting.',
    categories: [
      { number: 261, title: 'Business Analyst', qualification: "Bachelor's Degree", qualDetail: 'Requirements gathering, SQL/BI reporting, and process mapping', types: ['Full-time', 'Contract', 'Internship', 'Remote'] },
      { number: 262, title: 'Project Manager', qualification: "Bachelor's Degree", qualDetail: 'PMP or Agile Scrum certification and cross-functional delivery', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 263, title: 'Operations Manager', qualification: "Bachelor's Degree", qualDetail: 'Multi-team operational execution, SOPs, and SLA accountability', types: ['Full-time'] },
      { number: 264, title: 'Executive Assistant', qualification: 'Associate Degree', qualDetail: 'C-suite calendar management, travel logistics, and board briefings', types: ['Full-time', 'Remote'] },
      { number: 265, title: 'Office Administrator', qualification: 'High School / Trade', qualDetail: 'Office vendor coordination, supply management, and front-office ops', types: ['Full-time', 'Part-time'] },
      { number: 266, title: 'Business Development Manager', qualification: "Bachelor's Degree", qualDetail: 'Enterprise partnership sourcing, proposals, and market expansion', types: ['Full-time', 'Remote'] },
      { number: 267, title: 'Management Consultant', qualification: "Master's / Doctoral", qualDetail: 'MBA or consulting experience in transformation and operating models', types: ['Full-time', 'Contract'] },
      { number: 268, title: 'Procurement Officer', qualification: "Bachelor's Degree", qualDetail: 'Strategic sourcing, RFP evaluation, and vendor contract negotiation', types: ['Full-time', 'Remote'] },
      { number: 269, title: 'Strategy Analyst', qualification: "Bachelor's Degree", qualDetail: 'Competitive market modeling, KPI tracking, and executive decks', types: ['Full-time', 'Internship', 'Remote'] },
      { number: 270, title: 'General Manager', qualification: "Bachelor's Degree", qualDetail: 'Full business unit P&L leadership and organizational growth', types: ['Full-time'] }
    ]
  },
  {
    code: 'AB',
    name: 'Sports & Fitness',
    summary: 'Athletic training, coaching, sports medicine therapy, physical education, and recreation management.',
    categories: [
      { number: 271, title: 'Personal Trainer', qualification: 'Professional License / Certification', qualDetail: 'NASM, ACE, or ACSM certified personal trainer credential and CPR', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 272, title: 'Fitness Instructor', qualification: 'Professional License / Certification', qualDetail: 'Group fitness certification and studio class instruction experience', types: ['Part-time', 'Full-time'] },
      { number: 273, title: 'Sports Coach', qualification: "Bachelor's Degree", qualDetail: 'Coaching certification, player development, and First Aid/concussion training', types: ['Full-time', 'Part-time', 'Temporary'] },
      { number: 274, title: 'Athletic Trainer', qualification: "Master's / Doctoral", qualDetail: 'BOC Certified Athletic Trainer (ATC) and state licensure', types: ['Full-time', 'Contract'] },
      { number: 275, title: 'Sports Administrator', qualification: "Bachelor's Degree", qualDetail: 'Sports Management degree and league/collegiate compliance', types: ['Full-time', 'Internship'] },
      { number: 276, title: 'Sports Therapist', qualification: "Bachelor's Degree", qualDetail: 'Kinesiology or Sports Therapy certification and injury rehab skills', types: ['Full-time', 'Part-time', 'Contract'] },
      { number: 277, title: 'Gym Manager', qualification: 'Associate Degree', qualDetail: 'Fitness club membership operations, staff supervision, and equipment safety', types: ['Full-time'] },
      { number: 278, title: 'Sports Analyst', qualification: "Bachelor's Degree", qualDetail: 'Performance statistics, video scouting, or sports media analysis', types: ['Full-time', 'Contract', 'Remote'] },
      { number: 279, title: 'Physical Education Teacher', qualification: "Bachelor's Degree", qualDetail: 'BS in Physical Education and state K-12 teaching license', types: ['Full-time'] },
      { number: 280, title: 'Recreation Coordinator', qualification: "Bachelor's Degree", qualDetail: 'Municipal or campus recreation program scheduling and community events', types: ['Full-time', 'Part-time', 'Temporary'] }
    ]
  },
  {
    code: 'AC',
    name: 'Marine & Maritime',
    summary: 'Merchant marine navigation, port operations, marine engineering, vessel safety, and oceanography.',
    categories: [
      { number: 281, title: 'Ship Captain', qualification: 'Professional License / Certification', qualDetail: 'USCG Merchant Mariner Credential (Master Unlimited/Tonnage) and STCW', types: ['Full-time', 'Contract'] },
      { number: 282, title: 'Marine Engineer', qualification: 'Professional License / Certification', qualDetail: 'USCG Chief/Assistant Engineer license and marine propulsion systems', types: ['Full-time', 'Contract'] },
      { number: 283, title: 'Deck Officer', qualification: 'Professional License / Certification', qualDetail: 'USCG Mate MMC, radar/ECDIS endorsements, and bridge watchkeeping', types: ['Full-time', 'Contract'] },
      { number: 284, title: 'Ship Mechanic', qualification: 'High School / Trade', qualDetail: 'Marine diesel, auxiliary machinery, and hull maintenance skills', types: ['Full-time', 'Contract'] },
      { number: 285, title: 'Marine Surveyor', qualification: 'Professional License / Certification', qualDetail: 'SAMS/NAMS accreditation and vessel hull/cargo inspection expertise', types: ['Full-time', 'Contract'] },
      { number: 286, title: 'Port Operations Officer', qualification: "Bachelor's Degree", qualDetail: 'Maritime logistics, berth scheduling, and TWIC security clearance', types: ['Full-time'] },
      { number: 287, title: 'Maritime Safety Officer', qualification: 'Professional License / Certification', qualDetail: 'ISM/ISPS maritime safety auditing and USCG regulatory compliance', types: ['Full-time', 'Contract'] },
      { number: 288, title: 'Marine Biologist', qualification: "Master's / Doctoral", qualDetail: 'MS/PhD in Marine Biology and coastal ecosystem field research', types: ['Full-time', 'Contract'] },
      { number: 289, title: 'Ship Electrician', qualification: 'Professional License / Certification', qualDetail: 'Marine power distribution, navigation electronics, and STCW ETO skills', types: ['Full-time', 'Contract'] },
      { number: 290, title: 'Shipping Manager', qualification: "Bachelor's Degree", qualDetail: 'Ocean freight chartering, maritime documentation, and port coordination', types: ['Full-time'] }
    ]
  },
  {
    code: 'AD',
    name: 'Remote & Freelance Work',
    summary: 'Distributed digital operations, remote software engineering, virtual support, translation, and digital marketing.',
    categories: [
      { number: 291, title: 'Virtual Assistant', qualification: 'High School / Trade', qualDetail: 'Executive scheduling, inbox triage, and cloud productivity suites', types: ['Remote', 'Part-time', 'Contract', 'Full-time'] },
      { number: 292, title: 'Online Customer Support Agent', qualification: 'High School / Trade', qualDetail: 'Live chat, email, and voice helpdesk support from a dedicated home office', types: ['Remote', 'Full-time', 'Part-time'] },
      { number: 293, title: 'Freelance Writer', qualification: "Bachelor's Degree", qualDetail: 'Editorial, technical, or copywriting samples and deadline reliability', types: ['Remote', 'Contract', 'Part-time'] },
      { number: 294, title: 'Online Data Entry Clerk', qualification: 'High School / Trade', qualDetail: 'High-accuracy typing, spreadsheet validation, and database updates', types: ['Remote', 'Part-time', 'Temporary'] },
      { number: 295, title: 'Digital Marketing Specialist', qualification: "Bachelor's Degree", qualDetail: 'SEO, paid search, analytics attribution, and lifecycle email campaigns', types: ['Remote', 'Full-time', 'Contract'] },
      { number: 296, title: 'Remote Software Developer', qualification: "Bachelor's Degree", qualDetail: 'Distributed Git workflows, full-stack development, and async collaboration', types: ['Remote', 'Full-time', 'Contract'] },
      { number: 297, title: 'Online Translator', qualification: "Bachelor's Degree", qualDetail: 'Native fluency in two or more languages; ATA certification helpful', types: ['Remote', 'Contract', 'Part-time'] },
      { number: 298, title: 'Remote Project Coordinator', qualification: 'Associate Degree', qualDetail: 'Asana/Jira sprint tracking, meeting notes, and distributed team support', types: ['Remote', 'Full-time', 'Contract'] },
      { number: 299, title: 'Online Research Assistant', qualification: "Bachelor's Degree", qualDetail: 'Academic or market desk research, citation synthesis, and reporting', types: ['Remote', 'Part-time', 'Internship', 'Contract'] },
      { number: 300, title: 'Remote Technical Support Agent', qualification: 'Associate Degree', qualDetail: 'Tier 1-2 software/hardware troubleshooting and remote desktop diagnostics', types: ['Remote', 'Full-time', 'Part-time'] }
    ]
  }
];

export const DEPARTMENTS: Department[] = RAW_DEPARTMENTS.map((dept) => ({
  code: dept.code,
  name: dept.name,
  summary: dept.summary
}));

export const JOB_CATEGORIES: JobCategory[] = RAW_DEPARTMENTS.flatMap((dept) =>
  dept.categories.map((cat) => ({
    number: cat.number,
    id: `cat-${cat.number}-${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: cat.title,
    departmentCode: dept.code,
    departmentName: dept.name,
    requiredQualification: cat.qualification,
    qualificationsSummary: cat.qualDetail,
    supportedEmploymentTypes: cat.types,
    overview: `General career track within ${dept.name}. Applicants submit qualifications to the U.S. talent pool for ${cat.title} opportunities (${cat.types.join(', ')}).`
  }))
);
