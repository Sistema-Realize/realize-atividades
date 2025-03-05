import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import formidable, { File } from 'formidable';
import { createReadStream } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormFields = {
  amount: string;
  difficulty: string | string[];
}

type FormFiles = {
  Files: File | File[];
}

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

    const { sub: userId } = session.user;

    const form = formidable({ multiples: true });
    const [fields, files] = await new Promise<[FormFields, FormFiles]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        // Cast the parsed fields and files to our expected types
        const typedFields = {
          amount: Array.isArray(fields.amount) ? fields.amount[0] : fields.amount || '',
          difficulty: fields.difficulty?.reduce((accumulator, item)=>!!accumulator ? `${accumulator},"${item}"` : `"${item}"`, "") as string | string[]
        };
        const typedFiles = {
          Files: files.Files as File | File[]
        };
        resolve([typedFields, typedFiles]);
      });
    });

    const n8nFormData = new FormData();
    
    const fileArray = Array.isArray(files.Files) ? files.Files : [files.Files];
    fileArray.forEach((file) => {
      if (file && file.filepath) {
        n8nFormData.append('Files', createReadStream(file.filepath), {
          filename: file.originalFilename || 'unnamed_file'
        });
      }
    });

    // Add other fields
    n8nFormData.append('amount', fields.amount);
    if (Array.isArray(fields.difficulty)) {
      fields.difficulty.forEach((diff) => {
        n8nFormData.append('difficulty', diff);
      });
    } else if (fields.difficulty) {
      n8nFormData.append('difficulty', fields.difficulty);
    }
    n8nFormData.append('type', '"Multiple choice"');
    n8nFormData.append('external_reference', userId);

    const url = new URL(`${process.env.N8N_WEBHOOK_URL!}/create-activities`);
    
    const n8nResponse = await fetch(url, {
      method: 'POST',
      body: n8nFormData,
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          `${process.env.N8N_SERVICE_USER}:${process.env.N8N_SERVICE_PASSWORD}`
        ).toString('base64'),
      },
    });

    if (!n8nResponse.ok) {
      throw new Error(`N8N API responded with status: ${n8nResponse.status}`);
    }

    return res.status(200).json({
      message: 'Atividades enviadas com sucesso',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error processing upload' });
  }
} 