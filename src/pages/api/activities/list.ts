import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import fetch from 'node-fetch';
import { ActivityResponse } from '@/types/activities';

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

    const data: ActivityResponse[] = await n8nResponse.json();
    return res.status(200).json(data[0]);
  } catch (error) {
    console.error('List activities error:', error);
    return res.status(500).json({ error: 'Error fetching activities' });
  }
} 