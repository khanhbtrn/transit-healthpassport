"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  calculateReadiness,
  createEmptyState,
  createJourneyFromOnboarding,
  createMariaSeed,
  type OnboardingInput,
  type TransitState,
} from "@/lib/demo/seed";
import type { CorridorBrief } from "@/lib/corridor/knowledge";
import type {
  AgentMessage,
  AppointmentRequest,
  Condition,
  ContinuityRisk,
  DoctorCandidate,
  ExtractedFact,
  Handoff,
  MedicalDocument,
  Medication,
  RelocationTask,
  TaskStatus,
  TimelineEvent,
} from "@/lib/types";

interface TransitStore extends TransitState {
  startJourney: (input: OnboardingInput) => void;
  seedMariaJourney: () => void;
  resetJourney: () => void;
  setOnboarded: (value: boolean) => void;
  completeTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  setTasks: (tasks: RelocationTask[]) => void;
  setRisks: (risks: ContinuityRisk[]) => void;
  setDoctors: (doctors: DoctorCandidate[]) => void;
  setHandoff: (handoff: Handoff) => void;
  setTimeline: (timeline: TimelineEvent[]) => void;
  setCorridorBrief: (brief: CorridorBrief) => void;
  addCondition: (condition: Condition) => void;
  addMedication: (medication: Medication) => void;
  selectDoctor: (doctorId: string) => void;
  setAppointmentRequest: (request: AppointmentRequest) => void;
  approveAppointmentRequest: () => void;
  approveHandoff: () => void;
  setConversationCompleted: (value: boolean) => void;
  approveFacts: (facts: ExtractedFact[]) => void;
  addDocument: (document: MedicalDocument) => void;
  updateDocument: (id: string, patch: Partial<MedicalDocument>) => void;
  removeDocument: (id: string) => void;
  addMessage: (message: Omit<AgentMessage, "id" | "createdAt">) => void;
  setSpokenHandoffUrl: (url: string | null) => void;
  setSpecialistRequestDraft: (draft: string) => void;
  markTransitionComplete: () => void;
  refreshReadiness: () => void;
}

function withReadiness(state: TransitState): Pick<TransitState, "readinessPercent"> {
  return {
    readinessPercent: calculateReadiness({
      documentsCount: state.documents.filter(
        (d) => d.processingStatus === "complete"
      ).length,
      conversationCompleted: state.conversationCompleted,
      selectedDoctorId: state.selectedDoctorId,
      handoffApproved: state.handoffApproved,
      completedTaskIds: state.completedTaskIds,
      totalTasks: state.tasks.length,
      appointmentApproved:
        state.appointmentRequest?.status === "approved" ||
        state.appointmentRequest?.status === "prepared" ||
        state.appointmentRequest?.status === "simulated_sent",
      hasCondition: state.conditions.length > 0,
      transitionComplete: state.transitionComplete,
    }),
  };
}

export const useTransitStore = create<TransitStore>()(
  persist(
    (set, get) => ({
      ...createEmptyState(),

      startJourney: (input) => {
        const seed = createJourneyFromOnboarding(input);
        set({ ...seed, ...withReadiness(seed) });
      },

      seedMariaJourney: () => {
        const seed = createMariaSeed();
        set({ ...seed, ...withReadiness(seed) });
      },

      resetJourney: () => {
        set(createEmptyState());
      },

      setOnboarded: (value) => set({ onboarded: value }),

      completeTask: (taskId) => {
        const state = get();
        const tasks = state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: "complete" as const } : task
        );
        const completedTaskIds = Array.from(
          new Set([...state.completedTaskIds, taskId])
        );
        const next = { ...state, tasks, completedTaskIds };
        set({ tasks, completedTaskIds, ...withReadiness(next) });
      },

      updateTaskStatus: (taskId, status) => {
        const tasks = get().tasks.map((task: RelocationTask) =>
          task.id === taskId ? { ...task, status } : task
        );
        const completedTaskIds =
          status === "complete"
            ? Array.from(new Set([...get().completedTaskIds, taskId]))
            : get().completedTaskIds.filter((id) => id !== taskId);
        const next = { ...get(), tasks, completedTaskIds };
        set({ tasks, completedTaskIds, ...withReadiness(next) });
      },

      setTasks: (tasks) => {
        const completedTaskIds = tasks
          .filter((task) => task.status === "complete")
          .map((task) => task.id);
        const next = { ...get(), tasks, completedTaskIds };
        set({ tasks, completedTaskIds, ...withReadiness(next) });
      },

      setRisks: (risks) => set({ risks }),

      setDoctors: (doctors) => set({ doctors }),

      setHandoff: (handoff) => set({ handoff }),

      setTimeline: (timeline) => set({ timeline }),

      setCorridorBrief: (brief) => set({ corridorBrief: brief }),

      addCondition: (condition) => {
        const conditions = [...get().conditions, condition];
        const next = { ...get(), conditions };
        set({ conditions, ...withReadiness(next) });
      },

      addMedication: (medication) => {
        const medications = [...get().medications, medication];
        const next = { ...get(), medications };
        set({ medications, ...withReadiness(next) });
      },

      selectDoctor: (doctorId) => {
        const journeySteps = get().journeySteps.map((step) =>
          step.id === "specialist_selection"
            ? { ...step, status: "complete" as const }
            : step
        );
        const next = { ...get(), selectedDoctorId: doctorId, journeySteps };
        set({
          selectedDoctorId: doctorId,
          journeySteps,
          ...withReadiness(next),
        });
      },

      setAppointmentRequest: (request) => {
        const next = { ...get(), appointmentRequest: request };
        set({ appointmentRequest: request, ...withReadiness(next) });
      },

      approveAppointmentRequest: () => {
        const request = get().appointmentRequest;
        if (!request) return;
        const appointmentRequest = {
          ...request,
          status: "approved" as const,
        };
        const next = { ...get(), appointmentRequest };
        set({ appointmentRequest, ...withReadiness(next) });
      },

      approveHandoff: () => {
        const handoff = {
          ...get().handoff,
          approvedAt: new Date().toISOString(),
        };
        const journeySteps = get().journeySteps.map((step) =>
          step.id === "clinical_handoff"
            ? { ...step, status: "complete" as const }
            : step
        );
        const next = {
          ...get(),
          handoff,
          handoffApproved: true,
          journeySteps,
        };
        set({
          handoff,
          handoffApproved: true,
          journeySteps,
          ...withReadiness(next),
        });
      },

      setConversationCompleted: (value) => {
        const next = { ...get(), conversationCompleted: value };
        set({ conversationCompleted: value, ...withReadiness(next) });
      },

      approveFacts: (facts) => {
        const approvedFactIds = Array.from(
          new Set([...get().approvedFactIds, ...facts.map((f) => f.id)])
        );
        const journeySteps = get().journeySteps.map((step) =>
          step.id === "health_profile" || step.id === "records_collected"
            ? { ...step, status: "in_progress" as const }
            : step
        );
        const next = {
          ...get(),
          approvedFactIds,
          conversationCompleted: true,
          journeySteps,
        };
        set({
          approvedFactIds,
          conversationCompleted: true,
          journeySteps,
          ...withReadiness(next),
        });
      },

      addDocument: (document) => {
        const documents = [document, ...get().documents];
        const journeySteps = get().journeySteps.map((step) =>
          step.id === "records_collected"
            ? {
                ...step,
                status: "in_progress" as const,
                description: `${documents.length} document(s) collected`,
              }
            : step
        );
        const next = { ...get(), documents, journeySteps };
        set({ documents, journeySteps, ...withReadiness(next) });
      },

      updateDocument: (id, patch) => {
        const documents = get().documents.map((doc) =>
          doc.id === id ? { ...doc, ...patch } : doc
        );
        const next = { ...get(), documents };
        set({ documents, ...withReadiness(next) });
      },

      removeDocument: (id) => {
        const documents = get().documents.filter((doc) => doc.id !== id);
        const next = { ...get(), documents };
        set({ documents, ...withReadiness(next) });
      },

      addMessage: (message) => {
        const entry: AgentMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set({ messages: [...get().messages, entry] });
      },

      setSpokenHandoffUrl: (url) => set({ spokenHandoffUrl: url }),

      setSpecialistRequestDraft: (draft) =>
        set({ specialistRequestDraft: draft }),

      markTransitionComplete: () => {
        const next = { ...get(), transitionComplete: true };
        set({ transitionComplete: true, ...withReadiness(next) });
      },

      refreshReadiness: () => {
        set(withReadiness(get()));
      },
    }),
    {
      name: "transit-user-v2",
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<TransitState>;
        return {
          ...current,
          ...p,
          profile: {
            ...current.profile,
            ...p.profile,
            heightCm: p.profile?.heightCm ?? "",
            weightKg: p.profile?.weightKg ?? "",
            sex: p.profile?.sex ?? "",
            reasonForMove: p.profile?.reasonForMove ?? "",
          },
          transitionComplete: p.transitionComplete ?? false,
          spokenHandoffUrl: p.spokenHandoffUrl ?? null,
          specialistRequestDraft: p.specialistRequestDraft ?? "",
        };
      },
      partialize: (state) => ({
        onboarded: state.onboarded,
        readinessPercent: state.readinessPercent,
        profile: state.profile,
        conditions: state.conditions,
        medications: state.medications,
        allergies: state.allergies,
        monitoring: state.monitoring,
        specialists: state.specialists,
        documents: state.documents,
        timeline: state.timeline,
        tasks: state.tasks,
        risks: state.risks,
        doctors: state.doctors,
        handoff: state.handoff,
        journeySteps: state.journeySteps,
        unresolvedQuestions: state.unresolvedQuestions,
        continuityPriorities: state.continuityPriorities,
        appointmentRequest: state.appointmentRequest,
        messages: state.messages,
        selectedDoctorId: state.selectedDoctorId,
        handoffApproved: state.handoffApproved,
        conversationCompleted: state.conversationCompleted,
        approvedFactIds: state.approvedFactIds,
        completedTaskIds: state.completedTaskIds,
        isDemo: state.isDemo,
        corridorBrief: state.corridorBrief,
        transitionComplete: state.transitionComplete,
        spokenHandoffUrl: state.spokenHandoffUrl,
        specialistRequestDraft: state.specialistRequestDraft,
      }),
    }
  )
);
