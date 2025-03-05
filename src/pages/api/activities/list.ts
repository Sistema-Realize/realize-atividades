import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import fetch from 'node-fetch';

interface Activity {
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

interface Competency {
  name: string;
  description: string;
}

interface ActivitySet {
  content_goal: string;
  competencies: Competency[];
  activities: Activity[] | null;
  activitiesPerCompetence: number;
}

interface ActivityRequest {
  id: number;
  external_reference: string;
  amount: number;
  activities: ActivitySet;
  created_at: string;
  status: 'requested' | 'finished';
  updated_at: string | null;
}

interface ActivityResponse {
  data: ActivityRequest[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { sub: userId } = session.user;

    const url = new URL(`${process.env.N8N_WEBHOOK_URL!}/list-activities`);
    url.searchParams.set('external_reference', userId);
    
    const n8nResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          `${process.env.N8N_SERVICE_USER}:${process.env.N8N_SERVICE_PASSWORD}`
        ).toString('base64'),
      },
    });

    if (!n8nResponse.ok) {
      throw new Error(`N8N API responded with status: ${n8nResponse.status}`);
    }

    const data: ActivityResponse = await n8nResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('List activities error:', error);
    return res.status(500).json({ error: 'Error fetching activities' });
  }
} 