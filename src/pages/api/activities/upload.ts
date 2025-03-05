import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    //const { sub: userId } = session.user;

    // Logica para processar o upload dos arquivos
    
    return res.status(200).json({
      message: 'Atividades enviadas com sucesso',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error processing upload' });
  }
} 