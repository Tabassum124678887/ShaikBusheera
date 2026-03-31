/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClinicalFeatures {
  tumorSizeMm: number | null;
  lymphNodeInvolvement: 'N0' | 'N1' | 'N2' | 'N3' | 'Unknown';
  metastasis: 'M0' | 'M1' | 'Unknown';
  biopsyResult: 'Benign' | 'Malignant' | 'Inconclusive' | 'Pending';
  biomarkers: {
    name: string;
    value: string;
    status: 'Positive' | 'Negative' | 'Normal' | 'Abnormal';
  }[];
  symptoms: string[];
}

export interface ReasoningStep {
  type: 'neural' | 'symbolic';
  description: string;
  evidence: string;
  confidence: number;
}

export interface DiagnosticResult {
  stage: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  recommendation: string;
  reasoning: ReasoningStep[];
  features: ClinicalFeatures;
}

export interface Rule {
  id: string;
  condition: (features: ClinicalFeatures) => boolean;
  consequence: string;
  stage: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
}
