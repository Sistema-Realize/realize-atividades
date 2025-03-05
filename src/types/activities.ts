export interface Activity {
  context: string;
  text: string;
  type: string;
  difficulty: string;
  alternatives: {
    alternative: string;
    feedback: string;
    correct_answer: boolean;
  }[];
  competence: string;
}

export interface Competency {
  name: string;
  description: string;
}

export interface ActivitySet {
  content_goal: string;
  competencies: Competency[];
  activities: Activity[] | null;
  activitiesPerCompetence: number;
}

export interface ActivityRequest {
  id: number;
  external_reference: string;
  amount: number;
  activities: ActivitySet;
  created_at: string;
  status: 'requested' | 'finished';
  updated_at: string | null;
}

export interface ActivityResponse {
  data: ActivityRequest[];
} 