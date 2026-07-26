export type CountryHealthProfile = {
  id: string;
  name: string;
  aliases: string[];
  systemType: string;
  /** How people usually get care */
  accessModel: string;
  /** First practical step after arrival / before leaving */
  firstStepIn: string;
  firstStepOut: string;
  languages: string[];
  recordsTip: string;
  medicationReality: string;
  specialistReality: string;
  continuityRisks: string[];
  practicalMustKnow: string[];
  officialHint: string;
};

export const countryProfiles: CountryHealthProfile[] = [
  {
    id: "myanmar",
    name: "Myanmar",
    aliases: [
      "myanmar",
      "burma",
      "yangon",
      "rangoon",
      "mandalay",
      "naypyidaw",
      "nay pyi taw",
    ],
    systemType: "Mixed public/private, heavily disrupted by conflict and access barriers",
    accessModel:
      "Public facilities exist but capacity and reliability vary sharply by region. Many people with chronic or complex needs use private hospitals/clinics in Yangon or Mandalay when they can afford them. Cross-border referral and NGO-supported care are common realities.",
    firstStepIn:
      "Identify a private hospital or trusted clinic in your arrival city early; ask what documents and payment they require before they will review an ongoing condition.",
    firstStepOut:
      "Before leaving Myanmar, get a written diagnosis summary, recent labs/imaging, and a medication list with doses — ideally stamped/signed by your current clinician. Keep paper copies; electronic access may not travel with you.",
    languages: ["Burmese", "English (limited in many settings)"],
    recordsTip:
      "Records are often in Burmese. Prepare an English summary of diagnosis, stage/severity, recent results, allergies, and exact medication names (generic + brand if known).",
    medicationReality:
      "Specialty medicines can be intermittent. Confirm remaining supply, cold-chain needs, and whether your drug is realistically available at destination — do not assume continuity.",
    specialistReality:
      "Specialist follow-up is uneven outside major cities. Bring enough clinical detail that a new doctor can understand urgency without your old hospital file.",
    continuityRisks: [
      "Service disruption and clinic closures can interrupt monitoring",
      "Paper records may be incomplete or hard to retrieve later",
      "Specialty drug stockouts are common",
    ],
    practicalMustKnow: [
      "Ask your Myanmar clinician what must not stop during travel (infusions, insulin, antiepileptics, anticoagulants, etc.).",
      "Photograph and export every key letter, scan, and prescription before you leave.",
      "If you use a Yangon/Mandalay private hospital, request a discharge/transfer-style summary, not only verbal advice.",
    ],
    officialHint:
      "Treat local hospital/clinic instructions and your destination’s official entry/health rules as the source of truth — Transit cannot verify facility status day-to-day.",
  },
  {
    id: "afghanistan",
    name: "Afghanistan",
    aliases: [
      "afghanistan",
      "kabul",
      "herat",
      "mazar",
      "mazar-i-sharif",
      "kandahar",
      "jalalabad",
    ],
    systemType:
      "Severely constrained public system with private and NGO-supported care concentrated in larger cities",
    accessModel:
      "Public services are limited and uneven. In cities such as Kabul, private clinics/hospitals and NGO-supported facilities often handle much of accessible care for those who can reach and pay for them. Security, transport, and facility capacity shape what is realistically available.",
    firstStepIn:
      "As soon as you know your city, identify a reachable private clinic/hospital or NGO-supported facility that handles your specialty, and ask what they need for a first review (passport/ID, payment method, prior records, translator).",
    firstStepOut:
      "Do not leave without physical copies of diagnosis letters, medication names/doses, and recent results. Assume the next clinician will start from zero.",
    languages: ["Dari", "Pashto", "English (variable in clinics)"],
    recordsTip:
      "Bring an English clinical summary if possible, plus originals. Include diagnosis, complications, current meds, allergies, and what monitoring is due.",
    medicationReality:
      "Many specialty drugs are hard to obtain reliably. Arrive with a buffer supply if legally/clinically allowed, exact drug names, and a plan for what happens if your medicine is unavailable locally.",
    specialistReality:
      "Advanced specialty continuity (oncology, complex biologics, rare disease care) is limited. Prioritise stabilisation, clear documentation, and early identification of any facility that can review your case.",
    continuityRisks: [
      "Limited specialty capacity and diagnostics",
      "Security/transport barriers to appointments",
      "Unreliable medication supply chains",
      "Fragmented records across facilities",
    ],
    practicalMustKnow: [
      "For Afghanistan, plan medication continuity before you travel — local restart of complex therapy can be slow or impossible short-term.",
      "Carry a one-page emergency summary: condition, meds, allergies, and who to contact.",
      "Ask whether your destination city clinic can manage your specific condition, or only provide interim care.",
      "If you need imaging/labs continued, confirm which tests are actually available locally.",
    ],
    officialHint:
      "Facility access and medicine availability change quickly. Confirm with the clinic you hope to use, and rely on official/travel health advisories for entry and security context.",
  },
  {
    id: "vietnam",
    name: "Vietnam",
    aliases: [
      "vietnam",
      "hanoi",
      "ho chi minh",
      "saigon",
      "danang",
      "da nang",
      "hai phong",
    ],
    systemType: "Public hospitals plus growing private sector",
    accessModel:
      "Provincial/central public hospitals handle much specialist care; private international clinics in major cities are commonly used by people who want English and faster access.",
    firstStepIn:
      "Decide public hospital vs private/international clinic route in your city, then book with records ready.",
    firstStepOut:
      "Request a full summary and key results from your treating hospital/clinic before departure; ask for English if available.",
    languages: ["Vietnamese", "English in some private/international clinics"],
    recordsTip:
      "Translate Vietnamese records into English (or destination language). Include diagnosis codes/names, treatment history, and latest labs/imaging.",
    medicationReality:
      "Bring a precise medication list with generic names. Confirm how long your current supply lasts through travel and first destination appointment.",
    specialistReality:
      "Specialist letters from major hospitals carry weight abroad. Get a signed summary, not only outpatient notes.",
    continuityRisks: [
      "Language barrier for overseas clinicians",
      "Incomplete transfer of imaging/pathology detail",
    ],
    practicalMustKnow: [
      "Ask for copies of pathology and imaging reports, not just conclusions.",
      "If on specialty therapy, document last dose date and next due date.",
    ],
    officialHint:
      "Confirm destination registration/visa health rules with official sources for that country.",
  },
  {
    id: "uk",
    name: "United Kingdom",
    aliases: [
      "united kingdom",
      "uk",
      "britain",
      "great britain",
      "england",
      "scotland",
      "wales",
      "northern ireland",
      "london",
      "manchester",
      "birmingham",
      "edinburgh",
      "glasgow",
      "bristol",
      "leeds",
      "nhs",
    ],
    systemType: "NHS primary-care gateway plus private options",
    accessModel:
      "Most people register with a GP; specialist NHS care is usually referral-based. Private clinics can be used in parallel but do not automatically connect to NHS records.",
    firstStepIn:
      "Once you have a UK address, register with a GP. For urgent specialty needs, ask about NHS referral vs private first appointment while entitlement is confirmed.",
    firstStepOut:
      "Request a GP summary and specialist clinic letter before leaving; list active prescriptions and upcoming appointments.",
    languages: ["English"],
    recordsTip:
      "English letters, clinic summaries, and a current medication list are the most useful pack.",
    medicationReality:
      "Overseas prescriptions are not automatically continued. A UK clinician usually needs to review and re-prescribe. Bridge supply carefully before arrival.",
    specialistReality:
      "NHS specialist access often waits on GP referral and local capacity. Private routes may be faster for an initial review.",
    continuityRisks: [
      "Entitlement/registration delays",
      "Specialty drug restart requires local clinician approval",
      "Waiting lists for non-urgent care",
    ],
    practicalMustKnow: [
      "GP registration is commonly the first gateway into NHS care.",
      "Bring proof of address documents your chosen practice accepts.",
      "Verify NHS entitlement for your immigration/residence situation on official UK pages.",
    ],
    officialHint:
      "Use official NHS / GOV.UK guidance for registration and entitlement — Transit does not decide eligibility.",
  },
  {
    id: "spain",
    name: "Spain",
    aliases: [
      "spain",
      "españa",
      "barcelona",
      "madrid",
      "valencia",
      "seville",
      "sevilla",
      "malaga",
      "bilbao",
    ],
    systemType: "Public autonomous-community system plus private insurance/clinics",
    accessModel:
      "Public care is organised by region (comunidad autónoma). Private clinics and insurers are widely used for faster specialty access.",
    firstStepIn:
      "Confirm whether you will enter via public registration (padron/health card pathway as applicable) or private insurance/clinic, then book the first specialty review.",
    firstStepOut:
      "Obtain a signed specialist summary and medication plan before departure; prepare Spanish translation if possible.",
    languages: ["Spanish", "Catalan in Catalonia", "English in some private clinics"],
    recordsTip:
      "Spanish (and Catalan where relevant) clinical handoff reduces friction. Keep an English master copy too.",
    medicationReality:
      "Confirm local availability of biologics/specialty meds and whether a Spanish specialist must authorise continuation.",
    specialistReality:
      "Public specialty access is often referral-based; private can be faster with complete records.",
    continuityRisks: [
      "Public registration timing",
      "Language friction at first visit",
      "Regional differences in process",
    ],
    practicalMustKnow: [
      "Decide public vs private route before arrival if you can.",
      "Ask your current clinician for a transfer-style letter naming diagnosis and treatment.",
    ],
    officialHint:
      "Verify registration/eligibility with official Spanish or regional health authority sources for your status.",
  },
  {
    id: "us",
    name: "United States",
    aliases: [
      "united states",
      "usa",
      "u.s.",
      "america",
      "new york",
      "california",
      "los angeles",
      "san francisco",
      "chicago",
      "houston",
      "boston",
      "seattle",
      "miami",
    ],
    systemType: "Insurance-driven mixed public/private system",
    accessModel:
      "Access usually depends on insurance network, cash-pay, Medicaid/Medicare eligibility, or safety-net clinics. There is no single national GP registration step like the NHS.",
    firstStepIn:
      "Secure insurance or a cash-pay clinic pathway first, then book a primary care or specialty appointment in-network if possible.",
    firstStepOut:
      "Export full records (CCD/summary, imaging discs/links, medication list) and understand what your US insurer/clinic will require.",
    languages: ["English", "Spanish in many regions"],
    recordsTip:
      "US clinics expect clear English records, medication lists, and often prior-auth supporting documents for specialty drugs.",
    medicationReality:
      "Specialty drugs frequently need prior authorisation. Arrive with clinical justification and recent notes, not only a prescription bottle.",
    specialistReality:
      "You may self-refer in some private settings, but insurance often requires a PCP referral.",
    continuityRisks: [
      "Insurance gaps and network limits",
      "Prior authorization delays",
      "High out-of-pocket costs",
    ],
    practicalMustKnow: [
      "Confirm insurance effective date before you need care.",
      "Ask clinics about new-patient wait times for your specialty.",
    ],
    officialHint:
      "Insurance coverage and public program eligibility are case-specific — verify with your insurer or official program sources.",
  },
  {
    id: "india",
    name: "India",
    aliases: [
      "india",
      "delhi",
      "new delhi",
      "mumbai",
      "bangalore",
      "bengaluru",
      "chennai",
      "hyderabad",
      "kolkata",
      "pune",
    ],
    systemType: "Large public system with extensive private hospital sector",
    accessModel:
      "Private hospitals in major cities often provide faster specialty care. Public tertiary hospitals are important but can be crowded; processes vary by state.",
    firstStepIn:
      "Choose a hospital/clinic for your specialty in your city and ask the international/new-patient desk what records they need.",
    firstStepOut:
      "Collect discharge summaries, investigation reports, and a medication chart before leaving.",
    languages: ["English widely in private hospitals", "Hindi and regional languages"],
    recordsTip:
      "English summaries from major private/public hospitals transfer well internationally.",
    medicationReality:
      "Many generics are available, but exact brand substitutes differ. Keep generic names and dosing schedules.",
    specialistReality:
      "Specialty centres in metros can usually review complex cases quickly if records are complete.",
    continuityRisks: [
      "Variable record quality between facilities",
      "Need to re-establish care under a new hospital number",
    ],
    practicalMustKnow: [
      "Prefer hospital letterhead summaries over informal notes.",
      "Carry imaging on CD/USB or patient portal export if available.",
    ],
    officialHint:
      "Hospital admission and prescription rules are local — confirm with the receiving facility.",
  },
  {
    id: "thailand",
    name: "Thailand",
    aliases: ["thailand", "bangkok", "chiang mai", "phuket", "pattaya"],
    systemType: "Universal coverage schemes plus strong private hospitals",
    accessModel:
      "Thai citizens may use public schemes; many expatriates and complex cases use private hospitals in Bangkok/Chiang Mai with international desks.",
    firstStepIn:
      "Contact a private hospital international centre or local clinic for your specialty and send records ahead if possible.",
    firstStepOut:
      "Request an English medical report and medication list from your treating hospital.",
    languages: ["Thai", "English common in major private hospitals"],
    recordsTip: "English medical reports from major private hospitals are usually excellent for transfer.",
    medicationReality:
      "Private hospitals can often continue many therapies, but confirm stock and cost before arrival.",
    specialistReality:
      "Bangkok has broad specialty capacity; smaller cities may need referral to a tertiary centre.",
    continuityRisks: ["Cost of private specialty care", "Need for hospital registration number"],
    practicalMustKnow: [
      "Ask about package pricing vs itemised specialty follow-up.",
      "Send records before the first visit when the hospital allows.",
    ],
    officialHint:
      "Public scheme eligibility is status-specific; private care depends on payment/insurance.",
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    aliases: [
      "uae",
      "united arab emirates",
      "dubai",
      "abu dhabi",
      "sharjah",
    ],
    systemType: "Insurance-mandated private/public mix by emirate",
    accessModel:
      "Health insurance is commonly required for residents. Care is delivered through insured private/public networks; cash-pay is possible but costly.",
    firstStepIn:
      "Activate local health insurance, then book within-network specialty care with your records.",
    firstStepOut:
      "Export a complete English summary and medication list; note last dose dates for specialty therapies.",
    languages: ["English widely in clinics", "Arabic"],
    recordsTip: "English packages are expected. Include insurance-relevant diagnosis detail.",
    medicationReality:
      "Insurance formularies and approvals can delay specialty drugs. Bring clinical justification.",
    specialistReality:
      "Major cities have strong specialty capacity if insurance authorises care.",
    continuityRisks: [
      "Insurance activation delays",
      "Formulary restrictions",
    ],
    practicalMustKnow: [
      "Confirm your visa/insurance start date against your medication schedule.",
      "Ask whether your drug needs pre-approval.",
    ],
    officialHint:
      "Insurance and residency health rules differ by emirate — confirm with your insurer/employer.",
  },
  {
    id: "singapore",
    name: "Singapore",
    aliases: ["singapore"],
    systemType: "Highly organised public clusters plus private specialists",
    accessModel:
      "Subsidised public care depends on residency status; private specialists are widely used by those who can pay or are insured.",
    firstStepIn:
      "Determine public vs private eligibility, then book a specialist with a referral letter if required.",
    firstStepOut:
      "Obtain a detailed English specialist memo and investigation bundle.",
    languages: ["English", "Mandarin", "Malay", "Tamil"],
    recordsTip: "English clinical memos are standard and travel well.",
    medicationReality:
      "Specialty drugs are available but may be expensive outside subsidy; confirm financing early.",
    specialistReality:
      "Strong specialty capacity; bring concise, complete records to avoid repeat testing.",
    continuityRisks: ["Cost without subsidy/insurance", "Appointment lead times"],
    practicalMustKnow: [
      "Ask if a referral letter is required for the clinic you want.",
      "Bring recent labs to reduce duplicate tests.",
    ],
    officialHint:
      "Subsidy and MediSave/insurance rules depend on residency — verify officially.",
  },
  {
    id: "germany",
    name: "Germany",
    aliases: ["germany", "deutschland", "berlin", "munich", "münchen", "hamburg", "frankfurt", "cologne", "köln"],
    systemType: "Statutory (public) or private health insurance system",
    accessModel:
      "Residents generally need Krankenversicherung. Care goes through office-based specialists and hospitals; pathways depend on insurance type.",
    firstStepIn:
      "Arrange health insurance cover, then register with a Hausarzt and/or relevant Facharzt.",
    firstStepOut:
      "Request Arztbrief/specialist letters and a medication plan (Medikationsplan) before leaving.",
    languages: ["German", "English in some clinics/hospitals"],
    recordsTip:
      "German Arztbriefe are ideal. Otherwise provide a structured English summary and translate key pages.",
    medicationReality:
      "Many medicines require local prescription; specialty therapies need specialist/insurance alignment.",
    specialistReality:
      "Direct specialist access is more common than in GP-gatekeeper systems, but insurance rules matter.",
    continuityRisks: ["Insurance onboarding time", "Language at smaller practices"],
    practicalMustKnow: [
      "Sort insurance status before you need prescriptions.",
      "Carry a medication list with INN/generic names.",
    ],
    officialHint:
      "Confirm insurance obligations for your residence status with official German sources.",
  },
  {
    id: "france",
    name: "France",
    aliases: ["france", "paris", "lyon", "marseille", "toulouse", "nice"],
    systemType: "Social health insurance with médecin traitant pathway",
    accessModel:
      "People usually declare a médecin traitant (GP). Specialty care and reimbursements work better inside that pathway; private sector exists alongside.",
    firstStepIn:
      "Register/open your healthcare rights as applicable, choose a médecin traitant, then arrange specialty follow-up.",
    firstStepOut:
      "Obtain a compte rendu / specialist letter and ordonnance history before departure.",
    languages: ["French", "English limited outside major/private settings"],
    recordsTip: "French clinical letters help. Otherwise translate key documents into French.",
    medicationReality:
      "Local prescriptions are needed for ongoing supply; some specialty drugs are hospital-pharmacy controlled.",
    specialistReality:
      "Bring a strong referral pack; wait times vary by specialty and region.",
    continuityRisks: ["Administrative registration delays", "Language"],
    practicalMustKnow: [
      "A French summary accelerates the first consultation.",
      "Know whether your drug is community or hospital dispensed.",
    ],
    officialHint:
      "Healthcare rights depend on your situation — verify with official French social security / health sources.",
  },
  {
    id: "canada",
    name: "Canada",
    aliases: [
      "canada",
      "toronto",
      "vancouver",
      "montreal",
      "calgary",
      "ottawa",
      "edmonton",
    ],
    systemType: "Provincial public insurance for medically necessary care",
    accessModel:
      "You generally need provincial health coverage and a family doctor/clinic. Specialty care is referral-based; wait times can be long. Private options are limited for core services.",
    firstStepIn:
      "Apply for provincial health insurance as soon as eligible, then attach to a primary care clinic and request specialty referral with your overseas records.",
    firstStepOut:
      "Export a complete English (or French in relevant provinces) summary and imaging/pathology package.",
    languages: ["English", "French in Quebec and some services"],
    recordsTip:
      "Canadian specialists want clear histories; bring translated records and a medication list with generic names.",
    medicationReality:
      "Outpatient meds are often not fully covered like physician services. Budget for prescriptions and check provincial programs.",
    specialistReality:
      "Referral + wait list is common. Complete records help triage urgency.",
    continuityRisks: [
      "Waiting period for provincial coverage in some cases",
      "Family doctor shortages",
      "Specialty wait times",
    ],
    practicalMustKnow: [
      "Check your province’s waiting period and registration documents.",
      "Ask about urgent referral criteria for your condition.",
    ],
    officialHint:
      "Provincial health ministries / official plan pages are the authority on coverage start dates.",
  },
  {
    id: "australia",
    name: "Australia",
    aliases: [
      "australia",
      "sydney",
      "melbourne",
      "brisbane",
      "perth",
      "adelaide",
    ],
    systemType: "Medicare public system plus private insurance/hospitals",
    accessModel:
      "Eligible people enrol in Medicare and see a GP for referrals to specialists. Private insurance can speed hospital/specialty access.",
    firstStepIn:
      "Confirm Medicare eligibility or private pathway, enrol if eligible, then see a GP with your overseas records for specialty referral.",
    firstStepOut:
      "Get a GP/specialist letter and medication list before leaving.",
    languages: ["English"],
    recordsTip: "English specialist letters and results are ideal.",
    medicationReality:
      "PBS listing affects cost/availability. A local clinician must usually prescribe.",
    specialistReality:
      "GP referral is the normal route into public specialty care.",
    continuityRisks: ["Medicare eligibility timing", "Specialist wait lists"],
    practicalMustKnow: [
      "Bring documents required for Medicare enrolment if eligible.",
      "Ask your current clinician for an urgency statement if treatment cannot wait.",
    ],
    officialHint:
      "Confirm Medicare eligibility on official Australian government services.",
  },
  {
    id: "pakistan",
    name: "Pakistan",
    aliases: ["pakistan", "karachi", "lahore", "islamabad", "rawalpindi"],
    systemType: "Mixed public hospitals and large private sector",
    accessModel:
      "Private hospitals in major cities provide much accessible specialty care for those who can pay; public tertiary hospitals are important but variable.",
    firstStepIn:
      "Identify a hospital for your specialty in your city and ask what records/payment they need for a new patient review.",
    firstStepOut:
      "Collect signed summaries and investigation reports before travel.",
    languages: ["Urdu", "English in many private hospitals"],
    recordsTip: "English summaries from major private hospitals transfer well.",
    medicationReality:
      "Availability varies; keep generic names and a buffer plan.",
    specialistReality:
      "Metro private hospitals can often review complex cases if records are complete.",
    continuityRisks: ["Variable record systems", "Cost of private specialty care"],
    practicalMustKnow: [
      "Prefer hospital letterhead documentation.",
      "Confirm whether your medication is stocked locally.",
    ],
    officialHint: "Confirm care pathway with the receiving hospital directly.",
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    aliases: ["bangladesh", "dhaka", "chittagong", "chattogram"],
    systemType: "Public system with expanding private hospitals in major cities",
    accessModel:
      "Dhaka private hospitals are commonly used for specialty care; public facilities vary by level.",
    firstStepIn:
      "Book a specialty clinic at a major hospital and send records ahead if possible.",
    firstStepOut:
      "Gather diagnosis letters, labs, imaging, and medication list before departure.",
    languages: ["Bengali", "English in many private hospitals"],
    recordsTip: "Prepare English summary if records are in Bengali.",
    medicationReality:
      "Confirm supply continuity; specialty agents may need hospital channels.",
    specialistReality:
      "Complex care is concentrated in major city hospitals.",
    continuityRisks: ["Fragmented paper records", "Travel gaps in therapy"],
    practicalMustKnow: [
      "Photograph all paper records before leaving.",
      "Ask for last/next treatment dates in writing.",
    ],
    officialHint: "Verify destination requirements with official sources.",
  },
  {
    id: "china",
    name: "China",
    aliases: [
      "china",
      "beijing",
      "shanghai",
      "guangzhou",
      "shenzhen",
      "chengdu",
      "hangzhou",
    ],
    systemType: "Public hospital-centred system with international/private wings in large cities",
    accessModel:
      "Care is often hospital-department based. International clinics in tier-1 cities help with English and appointments.",
    firstStepIn:
      "Decide local public hospital department vs international clinic; bring passport and records.",
    firstStepOut:
      "Request bilingual or English discharge/clinic summaries where possible.",
    languages: ["Chinese", "English in international clinics"],
    recordsTip:
      "Translate key Chinese records; keep originals. Medication names should include generics.",
    medicationReality:
      "Formulary and hospital pharmacy rules differ; confirm continuity plan before travel.",
    specialistReality:
      "Major city hospitals have deep specialty capacity; bring concise history to the right department.",
    continuityRisks: ["Language", "Hospital registration systems differ"],
    practicalMustKnow: [
      "Know the exact department you need (e.g. gastroenterology, oncology).",
      "Carry recent imaging reports, not only films.",
    ],
    officialHint:
      "Hospital appointment systems are local — confirm with the receiving hospital.",
  },
  {
    id: "japan",
    name: "Japan",
    aliases: ["japan", "tokyo", "osaka", "kyoto", "yokohama", "nagoya", "fukuoka"],
    systemType: "Universal health insurance with clinic/hospital network",
    accessModel:
      "Residents enrol in public health insurance. Clinics and hospitals are widely accessible; larger hospitals may want referrals.",
    firstStepIn:
      "Arrange insurance enrolment as applicable, then visit a clinic/hospital with translated records.",
    firstStepOut:
      "Obtain a physician summary; ask for English if the clinic can provide it.",
    languages: ["Japanese", "English limited outside major/international clinics"],
    recordsTip: "Japanese summaries help most; otherwise professional translation of key pages.",
    medicationReality:
      "Drug names/brands differ; use generics and bring packaging photos.",
    specialistReality:
      "Referral to larger hospitals is common for complex disease.",
    continuityRisks: ["Language", "Different brand names"],
    practicalMustKnow: [
      "Carry a Japanese or highly structured English med list.",
      "Ask whether a referral letter is needed for your target hospital.",
    ],
    officialHint:
      "Insurance enrolment rules depend on residence status — verify officially.",
  },
  {
    id: "turkey",
    name: "Turkey",
    aliases: ["turkey", "türkiye", "turkiye", "istanbul", "ankara", "izmir"],
    systemType: "Public SSI system plus substantial private hospitals",
    accessModel:
      "Residents may access public care via insurance registration; private hospitals in major cities offer faster specialty access.",
    firstStepIn:
      "Clarify public insurance vs private hospital route, then book specialty review with records.",
    firstStepOut:
      "Get an English or Turkish specialist report and medication list.",
    languages: ["Turkish", "English in many private hospitals"],
    recordsTip: "Private hospital English reports are useful for onward travel.",
    medicationReality:
      "Confirm local equivalents and prescription requirements.",
    specialistReality:
      "Strong private specialty capacity in Istanbul/Ankara/Izmir.",
    continuityRisks: ["Insurance status", "Need for local prescription"],
    practicalMustKnow: [
      "Ask private hospitals about international patient desks.",
      "Bring imaging on transferable media.",
    ],
    officialHint: "Confirm coverage rules for your residence/work status officially.",
  },
  {
    id: "iran",
    name: "Iran",
    aliases: ["iran", "tehran", "mashhad", "isfahan", "shiraz"],
    systemType: "Public and private hospital network",
    accessModel:
      "University/public hospitals and private clinics provide specialty care; processes and documentation are often paper-heavy.",
    firstStepIn:
      "Identify a specialty hospital/clinic in your city and prepare Persian/English records as needed.",
    firstStepOut:
      "Collect stamped reports, imaging, and medication names before leaving.",
    languages: ["Persian", "English variable"],
    recordsTip:
      "Translate key documents into English for international moves; keep originals.",
    medicationReality:
      "Availability can be constrained; document exact drugs and doses carefully.",
    specialistReality:
      "Tertiary centres in major cities handle complex conditions.",
    continuityRisks: ["Documentation language", "Medication access variability"],
    practicalMustKnow: [
      "Photograph all stamped pages.",
      "List generic drug names clearly.",
    ],
    officialHint: "Confirm destination import/personal medication rules before travel.",
  },
  {
    id: "saudi",
    name: "Saudi Arabia",
    aliases: [
      "saudi arabia",
      "saudi",
      "riyadh",
      "jeddah",
      "dammam",
      "khobar",
    ],
    systemType: "Government facilities plus private sector; insurance common for residents/employees",
    accessModel:
      "Employer/resident insurance often channels care in network hospitals. Cash-pay private care exists in major cities.",
    firstStepIn:
      "Activate insurance or confirm hospital payment route, then book specialty care with records.",
    firstStepOut:
      "Export English medical reports and medication lists.",
    languages: ["Arabic", "English in many hospitals"],
    recordsTip: "English hospital reports are commonly accepted.",
    medicationReality:
      "Formulary and approval rules can delay specialty medicines.",
    specialistReality:
      "Major cities have advanced hospitals if access/insurance allows.",
    continuityRisks: ["Insurance network limits", "Approval delays"],
    practicalMustKnow: [
      "Align your first appointment with insurance activation.",
      "Bring prior-auth style clinical detail for specialty drugs.",
    ],
    officialHint: "Follow your employer/insurer and official residency health requirements.",
  },
  {
    id: "nigeria",
    name: "Nigeria",
    aliases: ["nigeria", "lagos", "abuja", "port harcourt", "ibadan"],
    systemType: "Public facilities with strong reliance on private hospitals in cities",
    accessModel:
      "Many people use private hospitals/clinics in Lagos/Abuja for reliable specialty care; public tertiary hospitals also matter.",
    firstStepIn:
      "Choose a private or tertiary hospital for your specialty and ask for a new-patient review checklist.",
    firstStepOut:
      "Obtain written summaries and lab/imaging copies before travel.",
    languages: ["English"],
    recordsTip: "English records are standard; still keep organised copies.",
    medicationReality:
      "Specialty stock can be inconsistent — plan buffer and local alternatives with a clinician.",
    specialistReality:
      "Complex care is concentrated in major city hospitals.",
    continuityRisks: ["Supply inconsistency", "Fragmented records"],
    practicalMustKnow: [
      "Keep a personal archive of all results.",
      "Confirm medication availability before arrival if possible.",
    ],
    officialHint: "Confirm receiving hospital requirements directly.",
  },
  {
    id: "south_africa",
    name: "South Africa",
    aliases: [
      "south africa",
      "johannesburg",
      "cape town",
      "durban",
      "pretoria",
    ],
    systemType: "Public system plus large private medical-aid sector",
    accessModel:
      "Private care via medical aid is common for those who have it; public sector serves most of the population with variable waits.",
    firstStepIn:
      "If using private care, confirm medical aid/network; otherwise identify the appropriate public facility for your specialty.",
    firstStepOut:
      "Get specialist letters and investigation packs before departure.",
    languages: ["English", "Afrikaans", "other official languages by region"],
    recordsTip: "English specialist letters travel well.",
    medicationReality:
      "Private formularies and public supply differ — confirm pathway.",
    specialistReality:
      "Private specialists can be booked more directly if funded; public needs referral pathways.",
    continuityRisks: ["Medical aid waiting/network rules", "Public wait times"],
    practicalMustKnow: [
      "Clarify private vs public route before you need urgent care.",
      "Bring a full medication and allergy list.",
    ],
    officialHint: "Medical aid rules are plan-specific — verify with your scheme.",
  },
  {
    id: "brazil",
    name: "Brazil",
    aliases: [
      "brazil",
      "brasil",
      "sao paulo",
      "são paulo",
      "rio de janeiro",
      "brasilia",
      "brasília",
    ],
    systemType: "SUS public system plus private insurance/hospitals",
    accessModel:
      "SUS provides public care; many use private plans for faster specialty access in large cities.",
    firstStepIn:
      "Decide SUS vs private plan/clinic, then book specialty care with Portuguese/English records as available.",
    firstStepOut:
      "Request reports and prescriptions; translate key pages to Portuguese if possible.",
    languages: ["Portuguese", "English limited"],
    recordsTip: "Portuguese summaries help most in local clinics.",
    medicationReality:
      "Local prescribing required; specialty access depends on public programs or private cover.",
    specialistReality:
      "Major cities have strong specialty centres; bring organised history.",
    continuityRisks: ["Language", "Public queue times", "Private plan rules"],
    practicalMustKnow: [
      "Prepare a Portuguese medication list if you can.",
      "Keep digital and paper copies of imaging reports.",
    ],
    officialHint: "SUS and private plan rules are status-specific — verify locally.",
  },
  {
    id: "mexico",
    name: "Mexico",
    aliases: [
      "mexico",
      "méxico",
      "mexico city",
      "cdmx",
      "guadalajara",
      "monterrey",
    ],
    systemType: "Public institutes plus private hospitals",
    accessModel:
      "Public coverage depends on affiliation; private hospitals are widely used in major cities for faster specialty care.",
    firstStepIn:
      "Confirm public affiliation vs private hospital route, then book with Spanish records.",
    firstStepOut:
      "Collect summaries and results; Spanish translation strongly preferred.",
    languages: ["Spanish", "English in some private hospitals"],
    recordsTip: "Spanish clinical handoff reduces delays.",
    medicationReality:
      "Confirm local brand equivalents and prescription requirements.",
    specialistReality:
      "Private specialty access in large cities can be relatively fast with records ready.",
    continuityRisks: ["Affiliation paperwork", "Language if records are English-only"],
    practicalMustKnow: [
      "Bring a Spanish summary if moving into local clinics.",
      "Ask about cash-pay vs insurance at private hospitals.",
    ],
    officialHint: "Public program affiliation is case-specific — verify officially.",
  },
  {
    id: "indonesia",
    name: "Indonesia",
    aliases: ["indonesia", "jakarta", "surabaya", "bandung", "medan", "bali", "denpasar"],
    systemType: "BPJS public scheme plus private hospitals",
    accessModel:
      "BPJS pathways are tiered; private hospitals in Jakarta and other cities serve many specialty needs for insured/cash patients.",
    firstStepIn:
      "Clarify BPJS vs private hospital route, then book the right specialty clinic.",
    firstStepOut:
      "Request English/Indonesian medical reports and medication lists.",
    languages: ["Indonesian", "English in many private hospitals"],
    recordsTip: "English reports from private hospitals help international moves.",
    medicationReality:
      "Confirm stock and whether hospital pharmacy is required for your therapy.",
    specialistReality:
      "Complex care clusters in major city hospitals.",
    continuityRisks: ["BPJS referral tiers", "Private cost"],
    practicalMustKnow: [
      "Ask whether your condition needs a tertiary hospital.",
      "Keep last treatment dates in writing.",
    ],
    officialHint: "BPJS rules depend on membership — verify with official sources.",
  },
  {
    id: "philippines",
    name: "Philippines",
    aliases: [
      "philippines",
      "manila",
      "quezon city",
      "cebu",
      "davao",
    ],
    systemType: "Public facilities plus extensive private hospitals",
    accessModel:
      "Private hospitals in Metro Manila/Cebu are commonly used for specialty care; PhilHealth participation affects public pathways.",
    firstStepIn:
      "Pick a hospital specialty department and send records to the triage/international desk if available.",
    firstStepOut:
      "Get a medical abstract and laboratory/imaging copies before leaving.",
    languages: ["English", "Filipino"],
    recordsTip: "English medical abstracts are common and useful.",
    medicationReality:
      "Confirm local availability and bring generic names.",
    specialistReality:
      "Metro private hospitals can usually review complex cases with a complete abstract.",
    continuityRisks: ["Cost without coverage", "Scattered records across clinics"],
    practicalMustKnow: [
      "Request a formal medical abstract, not only prescriptions.",
      "Carry digital copies of all imaging reports.",
    ],
    officialHint: "Confirm PhilHealth/private hospital requirements for your case.",
  },
  {
    id: "cambodia",
    name: "Cambodia",
    aliases: ["cambodia", "phnom penh", "siem reap"],
    systemType: "Developing public system with private clinics/hospitals in cities",
    accessModel:
      "Phnom Penh private clinics/hospitals are often used for more reliable specialty access; complex cases may be referred regionally.",
    firstStepIn:
      "Identify a city clinic/hospital that can manage your condition or provide interim care and referral.",
    firstStepOut:
      "Take full paper/digital copies of everything before you leave.",
    languages: ["Khmer", "English in some private clinics"],
    recordsTip: "Prepare English summaries; keep originals.",
    medicationReality:
      "Specialty medicines may be limited — plan supply and alternatives.",
    specialistReality:
      "Advanced specialty capacity is limited compared with larger neighbours.",
    continuityRisks: ["Limited specialty depth", "Medication access"],
    practicalMustKnow: [
      "Assume you must carry your complete history with you.",
      "Ask whether regional referral (e.g. Thailand/Vietnam) is part of the plan.",
    ],
    officialHint: "Confirm facility capability directly before relying on it.",
  },
  {
    id: "laos",
    name: "Laos",
    aliases: ["laos", "lao", "vientiane", "luang prabang"],
    systemType: "Limited public capacity with private clinics in Vientiane",
    accessModel:
      "Complex care is limited; many people use Vientiane private clinics or seek care across borders for advanced specialty needs.",
    firstStepIn:
      "Contact a Vientiane clinic/hospital early and ask what they can realistically manage.",
    firstStepOut:
      "Export complete records; plan medication bridge carefully.",
    languages: ["Lao", "English limited"],
    recordsTip: "English summary is essential for cross-border continuity.",
    medicationReality: "Expect limited specialty stock; carry a clinician-approved plan.",
    specialistReality:
      "Advanced specialty follow-up may require regional referral.",
    continuityRisks: ["Low specialty capacity", "Supply limits"],
    practicalMustKnow: [
      "Identify backup care in a nearby country if your condition is complex.",
      "Travel with a complete paper pack.",
    ],
    officialHint: "Verify what local facilities can provide before arrival.",
  },
  {
    id: "nepal",
    name: "Nepal",
    aliases: ["nepal", "kathmandu", "pokhara"],
    systemType: "Public hospitals plus private/teaching hospitals in Kathmandu",
    accessModel:
      "Kathmandu concentrates most specialty capacity; private/teaching hospitals are commonly used.",
    firstStepIn:
      "Book a specialty clinic in Kathmandu (or your city) and bring full records.",
    firstStepOut:
      "Collect summaries and investigation copies before departure.",
    languages: ["Nepali", "English in many hospitals"],
    recordsTip: "English summaries from major hospitals help.",
    medicationReality:
      "Confirm specialty drug availability; plan a buffer.",
    specialistReality:
      "Complex care is centralised in major hospitals.",
    continuityRisks: ["Geographic centralisation of care", "Supply variability"],
    practicalMustKnow: [
      "Ask for written follow-up intervals and red-flag symptoms.",
      "Keep digital backups of all reports.",
    ],
    officialHint: "Confirm receiving hospital process directly.",
  },
  {
    id: "malaysia",
    name: "Malaysia",
    aliases: ["malaysia", "kuala lumpur", "kl", "penang", "johor bahru", "ipoh"],
    systemType: "Public Ministry of Health system plus private hospitals",
    accessModel:
      "Public pathway is referral-based; private hospitals in KL/Penang offer faster specialty access for paying/insured patients.",
    firstStepIn:
      "Choose public vs private route, then book with records (English usually fine).",
    firstStepOut:
      "Request a medical report and investigation copies.",
    languages: ["Malay", "English widely in private hospitals"],
    recordsTip: "English medical reports are commonly available in private hospitals.",
    medicationReality:
      "Private hospitals can often continue many therapies; confirm cost/stock.",
    specialistReality:
      "Good specialty depth in major private centres.",
    continuityRisks: ["Public referral waits", "Private cost"],
    practicalMustKnow: [
      "Send records to the hospital before arrival if they accept them.",
      "Clarify first-visit fees and deposits.",
    ],
    officialHint: "Public eligibility depends on status — verify officially if using MOH care.",
  },
  {
    id: "south_korea",
    name: "South Korea",
    aliases: [
      "south korea",
      "korea",
      "seoul",
      "busan",
      "incheon",
      "republic of korea",
    ],
    systemType: "National Health Insurance with high hospital capacity",
    accessModel:
      "Insured residents access clinics/hospitals widely; large tertiary hospitals handle complex specialty care, sometimes with international centres.",
    firstStepIn:
      "Arrange insurance eligibility if applicable, then book the appropriate hospital department.",
    firstStepOut:
      "Request English medical records from the international health centre if available.",
    languages: ["Korean", "English in international centres"],
    recordsTip: "English summaries from tertiary hospitals are excellent when available.",
    medicationReality:
      "Local prescribing needed; bring generic names and recent notes.",
    specialistReality:
      "Strong specialty capacity in tertiary hospitals.",
    continuityRisks: ["Language outside international centres", "Registration admin"],
    practicalMustKnow: [
      "Use hospital international centres when you need English.",
      "Bring recent labs to speed triage.",
    ],
    officialHint: "NHI enrolment depends on residence/work status — verify officially.",
  },
  {
    id: "italy",
    name: "Italy",
    aliases: ["italy", "italia", "rome", "roma", "milan", "milano", "naples", "turin", "florence"],
    systemType: "SSN regional public system plus private care",
    accessModel:
      "Public care is regional; you typically need registration/health card processes as applicable. Private specialists can be faster.",
    firstStepIn:
      "Clarify SSN registration vs private route in your region, then book specialty care.",
    firstStepOut:
      "Obtain specialist letters; Italian translation helps.",
    languages: ["Italian", "English limited"],
    recordsTip: "Italian summaries reduce friction; keep English master copy.",
    medicationReality:
      "Local prescriptions required; some therapies are hospital-linked.",
    specialistReality:
      "Public specialty waits vary by region; private can bridge.",
    continuityRisks: ["Regional bureaucracy", "Language"],
    practicalMustKnow: [
      "Learn your ASL/region first step early.",
      "Bring a translated medication list.",
    ],
    officialHint: "SSN access depends on residence/status — verify with official regional sources.",
  },
  {
    id: "netherlands",
    name: "Netherlands",
    aliases: [
      "netherlands",
      "holland",
      "amsterdam",
      "rotterdam",
      "utrecht",
      "the hague",
      "den haag",
    ],
    systemType: "Mandatory private health insurance with GP gatekeeping",
    accessModel:
      "Residents must take Dutch health insurance and usually register with a huisarts (GP). Specialists are typically referral-based.",
    firstStepIn:
      "Arrange Dutch health insurance, register with a GP, then seek specialty referral with your overseas pack.",
    firstStepOut:
      "Get a GP/specialist letter and medication overview before leaving.",
    languages: ["Dutch", "English widely understood in care settings"],
    recordsTip: "English records are often usable; a structured summary helps referral urgency.",
    medicationReality:
      "Local GP/specialist must prescribe; insurance package affects coverage.",
    specialistReality:
      "Expect GP referral for hospital specialty care.",
    continuityRisks: ["Insurance start date", "GP registration availability"],
    practicalMustKnow: [
      "Register with a GP as soon as you have an address.",
      "Check insurance effective date against medication needs.",
    ],
    officialHint:
      "Dutch insurance obligation and deadlines are official rules — verify on government sites.",
  },
  {
    id: "sweden",
    name: "Sweden",
    aliases: ["sweden", "stockholm", "gothenburg", "göteborg", "malmo", "malmö"],
    systemType: "Regional public system with high digitalisation",
    accessModel:
      "Care is region-based; you generally need personal identity/registration processes to use the system fully. Primary care is the usual entry.",
    firstStepIn:
      "Complete civil/health registration steps as applicable, then contact primary care for specialty pathway.",
    firstStepOut:
      "Export journals/summaries and medication lists before leaving.",
    languages: ["Swedish", "English widely understood"],
    recordsTip: "English summaries are often acceptable; Swedish helps.",
    medicationReality:
      "Prescriptions are local; high-cost drugs have specific pathways.",
    specialistReality:
      "Referral and triage determine speed.",
    continuityRisks: ["ID/registration timing", "Triage waits"],
    practicalMustKnow: [
      "Bring ID documents needed for system registration.",
      "Ask for written urgency rationale if therapy is time-critical.",
    ],
    officialHint: "Region and Migrationsverket/official pages govern access timing.",
  },
  {
    id: "ireland",
    name: "Ireland",
    aliases: ["ireland", "dublin", "cork", "galway", "limerick"],
    systemType: "Public HSE system plus private insurance/hospitals",
    accessModel:
      "Public care via HSE; many use private insurance for faster specialty access. GPs are central.",
    firstStepIn:
      "Find a GP and clarify public vs private specialty route with your records.",
    firstStepOut:
      "Request GP/specialist letters and medication lists.",
    languages: ["English"],
    recordsTip: "English letters are standard.",
    medicationReality:
      "Local prescribing needed; drug schemes depend on eligibility.",
    specialistReality:
      "Public waits can be long; private may be faster if insured.",
    continuityRisks: ["GP access", "Public waiting lists"],
    practicalMustKnow: [
      "Secure a GP early.",
      "Bring a concise specialty handoff for triage.",
    ],
    officialHint: "Check HSE guidance for your residency situation.",
  },
  {
    id: "new_zealand",
    name: "New Zealand",
    aliases: ["new zealand", "auckland", "wellington", "christchurch"],
    systemType: "Public health system with primary care enrolment",
    accessModel:
      "Enrol with a primary care practice; specialty care is generally referral-based in the public system.",
    firstStepIn:
      "Enrol with a GP/practice and bring overseas records for referral if needed.",
    firstStepOut:
      "Get a GP/specialist summary and medication list.",
    languages: ["English", "te reo Māori in some services"],
    recordsTip: "English summaries are ideal.",
    medicationReality:
      "Local prescribing and PHARMAC funding rules affect access/cost.",
    specialistReality:
      "Public specialty access is triage/referral based.",
    continuityRisks: ["Enrolment timing", "Triage waits"],
    practicalMustKnow: [
      "Enrol in primary care as early as possible.",
      "Document why treatment is time-critical.",
    ],
    officialHint: "Confirm eligibility on official New Zealand health/immigration-linked guidance.",
  },
  {
    id: "egypt",
    name: "Egypt",
    aliases: ["egypt", "cairo", "alexandria", "giza"],
    systemType: "Public facilities plus private hospitals in major cities",
    accessModel:
      "Private hospitals in Cairo/Alexandria are commonly used for specialty care by those who can pay; public tertiary centres also provide complex care.",
    firstStepIn:
      "Select a hospital specialty department and ask for records/payment requirements.",
    firstStepOut:
      "Collect Arabic/English reports where possible and full investigation copies.",
    languages: ["Arabic", "English in many private hospitals"],
    recordsTip: "English private-hospital reports help international transfer.",
    medicationReality:
      "Confirm local availability; keep generic names.",
    specialistReality:
      "Complex care concentrated in major cities.",
    continuityRisks: ["Cost", "Record fragmentation"],
    practicalMustKnow: [
      "Request a complete medical report before travel.",
      "Carry imaging and lab originals/copies.",
    ],
    officialHint: "Confirm receiving hospital process directly.",
  },
  {
    id: "kenya",
    name: "Kenya",
    aliases: ["kenya", "nairobi", "mombasa", "kisumu"],
    systemType: "Public system with strong private sector in Nairobi",
    accessModel:
      "Nairobi private hospitals provide much accessible specialty care; public tertiary hospitals are key for many patients.",
    firstStepIn:
      "Book a specialty clinic in a major hospital and prepare payment/insurance details.",
    firstStepOut:
      "Export summaries and results before departure.",
    languages: ["English", "Swahili"],
    recordsTip: "English hospital summaries are standard in major facilities.",
    medicationReality:
      "Specialty stock varies — plan a bridge supply with clinician advice.",
    specialistReality:
      "Advanced care clusters in Nairobi and a few centres.",
    continuityRisks: ["Supply variability", "Cost of private care"],
    practicalMustKnow: [
      "Ask about NHIF/insurance acceptance if relevant.",
      "Keep a personal archive of all results.",
    ],
    officialHint: "Confirm hospital requirements and insurance acceptance directly.",
  },
  {
    id: "israel",
    name: "Israel",
    aliases: ["israel", "tel aviv", "jerusalem", "haifa"],
    systemType: "Mandatory health fund (kupat holim) system",
    accessModel:
      "Residents join a health fund; specialty care is organised through that system, with private options available.",
    firstStepIn:
      "Arrange health-fund membership as applicable, then book specialty care with translated records.",
    firstStepOut:
      "Obtain detailed letters and imaging/pathology exports.",
    languages: ["Hebrew", "Arabic", "English commonly usable"],
    recordsTip: "English records are often usable; Hebrew helps administratively.",
    medicationReality:
      "Formulary/health-fund rules affect specialty drug access.",
    specialistReality:
      "Strong specialty capacity once inside a health fund pathway.",
    continuityRisks: ["Membership activation", "Formulary limits"],
    practicalMustKnow: [
      "Align therapy dates with health-fund activation.",
      "Bring prior clinical justification for specialty drugs.",
    ],
    officialHint: "Health-fund enrolment rules are official — verify for your status.",
  },
  {
    id: "russia",
    name: "Russia",
    aliases: ["russia", "moscow", "saint petersburg", "st petersburg", "novosibirsk"],
    systemType: "Compulsory medical insurance public system plus private clinics",
    accessModel:
      "Public polyclinic/hospital pathways exist; private clinics in major cities offer faster access for many specialties.",
    firstStepIn:
      "Clarify public insurance attachment vs private clinic route, then book with Russian/English records.",
    firstStepOut:
      "Collect epicrisis/discharge summaries and investigation copies.",
    languages: ["Russian", "English limited"],
    recordsTip: "Russian hospital epicrisis documents are key; translate for overseas moves.",
    medicationReality:
      "Local trade names differ; use INN/generic names.",
    specialistReality:
      "Tertiary capacity in major cities; bring complete history.",
    continuityRisks: ["Language", "Administrative attachment to local clinic"],
    practicalMustKnow: [
      "Request discharge/epicrisis papers before leaving.",
      "Photograph every stamped page.",
    ],
    officialHint: "Local attachment/insurance rules are status-specific.",
  },
  {
    id: "ukraine",
    name: "Ukraine",
    aliases: ["ukraine", "kyiv", "kiev", "lviv", "odesa", "odessa", "kharkiv"],
    systemType: "Reforming public system with private clinics; access affected by war disruption",
    accessModel:
      "Care availability varies by city and security situation. Private clinics and relocated services are important; bring all records with you.",
    firstStepIn:
      "Identify a currently operating clinic/hospital for your specialty in your city and confirm what they can provide now.",
    firstStepOut:
      "Travel with full physical/digital records and medication supply plan.",
    languages: ["Ukrainian", "Russian", "English variable"],
    recordsTip: "Keep multilingual copies if possible; never rely on a single hospital archive.",
    medicationReality:
      "Supply can be disrupted — plan buffers and alternatives with a clinician.",
    specialistReality:
      "Specialty availability is location-dependent; ask what is realistically available locally.",
    continuityRisks: [
      "Service disruption",
      "Displaced records",
      "Medication supply instability",
    ],
    practicalMustKnow: [
      "Carry your complete history on your person.",
      "Re-check facility operations close to travel dates.",
    ],
    officialHint:
      "Local service availability changes — confirm with the facility and official advisories.",
  },
];

export function detectCountry(
  city: string,
  country: string
): CountryHealthProfile | null {
  const blob = `${city} ${country}`.trim().toLowerCase();
  if (!blob) return null;

  // Prefer longer alias matches to avoid weak hits
  let best: { profile: CountryHealthProfile; score: number } | null = null;
  for (const profile of countryProfiles) {
    for (const alias of profile.aliases) {
      if (blob.includes(alias)) {
        const score = alias.length;
        if (!best || score > best.score) best = { profile, score };
      }
    }
  }
  return best?.profile ?? null;
}

export function listKnownCountries() {
  return countryProfiles.map((p) => p.name).sort();
}
