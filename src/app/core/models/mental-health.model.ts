// HU09: Realizar testeo de salud mental
export interface MentalHealthTest {
  id: number;
  userId: number;
  testType: 'GAD-7' | 'PHQ-9' | 'DASS-21' | 'otro';
  score: number;
  maxScore: number;
  result: 'normal' | 'leve' | 'moderado' | 'severo';
  recommendedActions: string[];
  completedAt: Date;
  needsProfessionalHelp: boolean;
}

export interface MentalHealthTestRequest {
  testType: 'GAD-7' | 'PHQ-9' | 'DASS-21' | 'otro';
  answers: number[]; // scores de cada pregunta
}

export interface MentalHealthTestQuestion {
  id: number;
  question: string;
  options: MentalHealthOption[];
}

export interface MentalHealthOption {
  label: string;
  score: number;
}
