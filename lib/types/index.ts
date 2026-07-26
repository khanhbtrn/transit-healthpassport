export type VerificationStatus =
  | "verified"
  | "high_confidence"
  | "needs_confirmation"
  | "patient_reported"
  | "ai_extracted";

export type Confidence = "high" | "medium" | "low";

export type SourceType =
  | "specialist_letter"
  | "prescription"
  | "lab_report"
  | "doctor_conversation"
  | "patient_reported"
  | "colonoscopy"
  | "vaccination"
  | "medication_history"
  | "ai_generated"
  | "official_source"
  | "provider_source";

export type TaskStatus =
  | "complete"
  | "in_progress"
  | "waiting"
  | "needs_review"
  | "ready"
  | "not_started";

export type TaskPhase =
  | "before_departure"
  | "before_arrival"
  | "first_week"
  | "first_30_days"
  | "ongoing";

export type Priority = "critical" | "high" | "medium" | "low";

export type DocumentProcessingStatus =
  | "pending"
  | "uploading"
  | "reading"
  | "extracting"
  | "comparing"
  | "flagging"
  | "updating_timeline"
  | "complete"
  | "error";

export type JourneyStepId =
  | "health_profile"
  | "records_collected"
  | "medication_review"
  | "healthcare_registration"
  | "specialist_selection"
  | "clinical_handoff"
  | "arrival_readiness";

/** Why the user opened Transit — drives Home workflow. */
export type JourneyIntent =
  | "second_look"
  | "set_up_care"
  | "rebuild_history"
  | "continue_treatment";

export type CareBudget = "tight" | "moderate" | "flexible" | "insured";

export interface CarePreferences {
  budget: CareBudget | "";
  languages: string;
  notes: string;
}

export interface Profile {
  id: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  currentCountry: string;
  destinationCountry: string;
  currentCity: string;
  destinationCity: string;
  moveDate: string;
  preferredLanguage: string;
  destinationDoctorLanguage: string;
  insuranceRoute: string;
  primaryConcern: string;
  avatarInitials: string;
  /** Optional vitals / demographics used in clinical packs */
  heightCm: string;
  weightKg: string;
  sex: string;
  reasonForMove: string;
  journeyIntent: JourneyIntent;
  carePreferences: CarePreferences;
}

export interface Condition {
  id: string;
  name: string;
  diagnosedAt: string;
  status: string;
  notes: string;
  confidence: Confidence;
  verificationStatus: VerificationStatus;
  source: SourceType;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: "current" | "previous" | "stopped";
  reasonStopped?: string;
  prescribingSpecialist?: string;
  confidence: Confidence;
  verificationStatus: VerificationStatus;
  source: SourceType;
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severity: string;
  verificationStatus: VerificationStatus;
  source: SourceType;
}

export interface ExtractedFact {
  id: string;
  category: string;
  value: string;
  sourceText?: string;
  confidence: Confidence;
  verificationStatus: VerificationStatus;
  source: SourceType;
  documentId?: string;
  approved?: boolean;
}

export interface MedicalDocument {
  id: string;
  title: string;
  documentType: string;
  filePath?: string;
  sourceProvider: string;
  documentDate: string;
  language: string;
  processingStatus: DocumentProcessingStatus;
  verificationStatus: VerificationStatus;
  facts: ExtractedFact[];
  previewText: string;
}

export interface TimelineEvent {
  id: string;
  eventDate: string;
  approximateDate: boolean;
  eventType: string;
  title: string;
  description: string;
  sourceType: SourceType;
  sourceId?: string;
  confidence: Confidence;
  verificationStatus: VerificationStatus;
}

export interface RelocationTask {
  id: string;
  phase: TaskPhase;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  owner: string;
  dueDate: string;
  sourceStatus: string;
  actionType: string;
  explanation: string;
}

export interface ContinuityRisk {
  id: string;
  title: string;
  description: string;
  severity: Priority;
  sourceStatus: string;
}

export interface DoctorCandidate {
  id: string;
  doctorName: string;
  organization: string;
  specialty: string;
  languages: string[];
  location: string;
  distanceMinutes: number;
  careRoute: string;
  availabilityText: string;
  expertise: string[];
  matchScore: number;
  matchReason: string;
  preparationRequirements: string[];
  fictional: boolean;
  recommended?: boolean;
}

export interface AppointmentRequest {
  patientIntroduction: string;
  reasonForReferral: string;
  clinicalSummary: string;
  requestedTiming: string;
  attachedDocuments: string[];
  preferredLanguage: string;
  status: "draft" | "prepared" | "approved" | "simulated_sent";
}

export interface Handoff {
  id: string;
  language: string;
  clinicalSummary: string;
  detailedSummary: string;
  patientSummary: string;
  spanishSummary: string;
  catalanSummary: string;
  unresolvedQuestions: string[];
  continuityPriorities: string[];
  supportingDocuments: string[];
  generatedAt: string;
  approvedAt?: string;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  whyItMatters?: string;
  nextAction?: string;
  sourceStatus?: string;
  actions?: AgentAction[];
  createdAt: string;
}

export interface AgentAction {
  id: string;
  label: string;
  type: string;
  href?: string;
}

/** Something Transit needs from the patient before/while it works. */
export type AgentNeedKind =
  | "upload_doc"
  | "talk_to_person"
  | "confirm_info"
  | "bring_item";

export type AgentNeedStatus = "open" | "done" | "skipped";

export interface AgentNeed {
  id: string;
  kind: AgentNeedKind;
  title: string;
  detail: string;
  status: AgentNeedStatus;
  href?: string;
  priority: Priority;
}

/** Work Transit drafted that the patient must approve before any real send. */
export type ApprovalKind =
  | "specialist_request"
  | "clinic_application"
  | "appointment_request"
  | "handoff_letter"
  | "document_pack";

export type ApprovalStatus =
  | "needs_approval"
  | "approved"
  | "rejected"
  | "simulated_sent";

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  title: string;
  summary: string;
  detail: string;
  status: ApprovalStatus;
  createdAt: string;
}

/** Log of actions the agent completed (drafted/researched/matched). */
export interface AgentDoneItem {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
}

export interface JourneyStep {
  id: JourneyStepId;
  title: string;
  status: TaskStatus;
  description: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: "doctor" | "patient";
  speakerName: string;
  text: string;
  timestampSeconds: number;
}

export interface LiveFact {
  id: string;
  label: string;
  value: string;
  confidence: Confidence;
}

export interface ConsentRecord {
  id: string;
  consentType: string;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
}

export interface MonitoringRequirement {
  id: string;
  title: string;
  frequency: string;
  lastCompleted?: string;
  notes: string;
  source: SourceType;
  verificationStatus: VerificationStatus;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  organization: string;
  location: string;
  relationship: string;
}

export interface AppState {
  onboarded: boolean;
  readinessPercent: number;
  selectedDoctorId: string | null;
  appointmentRequest: AppointmentRequest | null;
  handoffApproved: boolean;
  recordingConsent: boolean;
  conversationCompleted: boolean;
  approvedFactIds: string[];
  completedTaskIds: string[];
  uploadSimulationActive: boolean;
}
