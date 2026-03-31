/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClinicalFeatures, DiagnosticResult, ReasoningStep } from "../types";

export function evaluateSymbolicLogic(features: ClinicalFeatures, neuralReasoning: string): DiagnosticResult {
  const reasoning: ReasoningStep[] = [
    {
      type: 'neural',
      description: 'Feature Extraction',
      evidence: neuralReasoning,
      confidence: 0.92
    }
  ];

  let stage = "Unknown";
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  let recommendation = "Further clinical correlation required.";

  // Symbolic Rules (Simplified TNM-like logic)
  
  // Rule 1: Metastasis
  if (features.metastasis === 'M1') {
    stage = "Stage IV";
    riskLevel = "Critical";
    recommendation = "Immediate oncology consultation for systemic therapy and palliative assessment.";
    reasoning.push({
      type: 'symbolic',
      description: 'Metastasis Rule',
      evidence: 'Presence of distant metastasis (M1) automatically classifies as Stage IV.',
      confidence: 1.0
    });
  } 
  // Rule 2: Malignant Biopsy + Lymph Nodes
  else if (features.biopsyResult === 'Malignant') {
    if (features.lymphNodeInvolvement !== 'N0' && features.lymphNodeInvolvement !== 'Unknown') {
      stage = "Stage III";
      riskLevel = "High";
      recommendation = "Surgical oncology consultation and potential neoadjuvant therapy.";
      reasoning.push({
        type: 'symbolic',
        description: 'Lymph Node Rule',
        evidence: `Malignant biopsy with ${features.lymphNodeInvolvement} involvement indicates regional spread.`,
        confidence: 0.95
      });
    } else if (features.tumorSizeMm && features.tumorSizeMm > 20) {
      stage = "Stage II";
      riskLevel = "Moderate";
      recommendation = "Surgical assessment for primary tumor excision.";
      reasoning.push({
        type: 'symbolic',
        description: 'Tumor Size Rule',
        evidence: `Tumor size > 20mm (${features.tumorSizeMm}mm) with malignant biopsy indicates Stage II.`,
        confidence: 0.9
      });
    } else {
      stage = "Stage I";
      riskLevel = "Moderate";
      recommendation = "Localized treatment planning and monitoring.";
      reasoning.push({
        type: 'symbolic',
        description: 'Early Stage Rule',
        evidence: 'Localized malignant tumor without node involvement or large size.',
        confidence: 0.85
      });
    }
  }
  // Rule 3: Benign
  else if (features.biopsyResult === 'Benign') {
    stage = "Benign/Non-Cancerous";
    riskLevel = "Low";
    recommendation = "Routine follow-up as per standard screening guidelines.";
    reasoning.push({
      type: 'symbolic',
      description: 'Benign Rule',
      evidence: 'Biopsy confirmed benign pathology.',
      confidence: 0.98
    });
  }

  return {
    stage,
    riskLevel,
    recommendation,
    reasoning,
    features
  };
}
