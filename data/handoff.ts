import type { Handoff } from "@/lib/types";

export const mariaHandoff: Handoff = {
  id: "handoff-maria-1",
  language: "en",
  clinicalSummary:
    "Maria Santos, 34, with ileocolonic Crohn's disease diagnosed in 2018. Currently stable on adalimumab 40 mg every two weeks since February 2021. Azathioprine discontinued in 2020 due to persistent nausea and elevated liver enzymes. Penicillin allergy. Latest blood tests (May 2026) satisfactory. Requires continued three-monthly monitoring. Priority: avoid interruption of biologic therapy during international relocation to Barcelona.",
  detailedSummary:
    "Patient: Maria Santos (DOB 18 March 1992).\n\nDiagnosis: Crohn's disease (2018), currently stable.\n\nCurrent treatment: Adalimumab 40 mg subcutaneous every two weeks since February 2021, with good clinical response under Dr. Amelia Reed at Thames Valley Gastroenterology Clinic, London.\n\nPrevious treatment: Azathioprine 2019–2020, discontinued due to persistent nausea and elevated liver enzymes.\n\nAllergy: Penicillin (rash and swelling).\n\nMonitoring: Blood tests every three months; latest results May 2026 satisfactory.\n\nSupporting investigations: Colonoscopy September 2024 showed mild ileal inflammation, no strictures.\n\nRelocation context: Moving from London to Barcelona on 14 September 2026. Continuity of biologic therapy is the primary clinical priority. Destination care route not yet confirmed.\n\nOpen questions: Signed final specialist letter pending; remaining medication supply duration needs confirmation; local prescription oversight pathway unconfirmed.",
  patientSummary:
    "You have Crohn's disease that has been stable on adalimumab since 2021. A previous medicine, azathioprine, did not suit you because of nausea and abnormal liver tests. Your latest blood tests look satisfactory, and you still need checks every three months. The most important thing for your move is making sure your adalimumab treatment is not interrupted. Transit has prepared your history, a destination plan, and a clinical handoff for your new doctor — but every medical decision must still be confirmed by a clinician.",
  spanishSummary:
    "Maria Santos, 34 años, con enfermedad de Crohn ileocolónica diagnosticada en 2018. Actualmente estable con adalimumab 40 mg cada dos semanas desde febrero de 2021. La azatioprina se suspendió en 2020 por náuseas persistentes y elevación de enzimas hepáticas. Alergia a la penicilina. Últimos análisis de sangre (mayo de 2026) satisfactorios. Requiere monitorización cada tres meses. Prioridad: no interrumpir el tratamiento biológico durante el traslado internacional a Barcelona.",
  catalanSummary:
    "Maria Santos, 34 anys, amb malaltia de Crohn ileocolònica diagnosticada el 2018. Actualment estable amb adalimumab 40 mg cada dues setmanes des del febrer de 2021. L'azatioprina es va suspendre el 2020 per nàusees persistents i elevació d'enzims hepàtics. Al·lèrgia a la penicil·lina. Darreres anàlisis de sang (maig de 2026) satisfactòries. Requereix monitoratge cada tres mesos. Prioritat: no interrompre el tractament biològic durant el trasllat internacional a Barcelona.",
  unresolvedQuestions: [
    "Has the final specialist letter been signed by Dr. Reed?",
    "How many adalimumab doses remain after arrival?",
    "Which Spanish healthcare route will be used?",
    "Who will provide local prescription oversight?",
  ],
  continuityPriorities: [
    "Do not interrupt adalimumab",
    "Document azathioprine intolerance clearly",
    "Maintain three-monthly blood monitoring",
    "Confirm destination medication oversight before supply ends",
  ],
  supportingDocuments: [
    "Gastroenterology summary",
    "Adalimumab prescription",
    "Blood test results",
    "Colonoscopy report",
    "NHS medication history",
    "Doctor conversation extract",
  ],
  generatedAt: "2026-07-20T10:00:00.000Z",
};
