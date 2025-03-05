import { NextApiRequest, NextApiResponse } from 'next';

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
    // Logica para processar o upload dos arquivos
    
    return res.status(200).json({
      message: 'Atividades enviadas com sucesso',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error processing upload' });
  }
} 