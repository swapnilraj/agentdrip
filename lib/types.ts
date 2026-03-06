export interface PipelineContext {
  style: string;
  urls: string[];
  corpusDir: string;
  skillPath: string;
  testPagesDir: string;
  screenshotsDir: string;
  state: PipelineState;
}

export interface PipelineState {
  currentStep: string;
  completedSteps: string[];
  analysis?: DesignAnalysis;
  skillGenAttempts: number;
  pageGenAttempts: number;
  reviewIterations: number;
  errors: string[];
}

export interface DesignAnalysis {
  colors: { name: string; hex: string; usage: string }[];
  typography: { element: string; family: string; size: string; weight: string; lineHeight: string }[];
  spacing: { baseUnit: string; maxWidth: string; sectionSpacing: string };
  layout: string[];
  philosophy: string;
  signatureTechniques: string[];
}

export interface ReviewIssue {
  severity: 'critical' | 'warning' | 'suggestion';
  section: string;
  description: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const STEPS = ['collect', 'analyze', 'generate-skill', 'generate-pages', 'screenshot', 'review', 'refine', 'validate'] as const;
export type StepName = typeof STEPS[number];
