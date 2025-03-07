import { NextApiRequest, NextApiResponse } from 'next';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { ActivitySet } from '@/types/activities';
import { getSession } from '@auth0/nextjs-auth0';

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
    
    const activitySet: ActivitySet = req.body;

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Relatório de Atividades",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),

          // Content Goal
          new Paragraph({
            text: "\nObjetivo do Conteúdo",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: activitySet.content_goal,
          }),

          // Competencies
          new Paragraph({
            text: "\nCompetências",
            heading: HeadingLevel.HEADING_2,
          }),
          ...activitySet.competencies.map(comp => [
            new Paragraph({
              text: comp.name,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              text: comp.description,
            }),
          ]).flat(),

          // Activities
          new Paragraph({
            text: "\nAtividades",
            heading: HeadingLevel.HEADING_2,
          }),
          ...(activitySet.activities || []).map((activity, index) => [
            new Paragraph({
              text: `\nAtividade ${index + 1}`,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              text: "Contexto:",
              heading: HeadingLevel.HEADING_4,
            }),
            new Paragraph({
              text: activity.context,
            }),
            new Paragraph({
              text: "\nPergunta:",
              heading: HeadingLevel.HEADING_4,
            }),
            new Paragraph({
              text: activity.text,
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Alternativa")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Feedback")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Resposta Correta")],
                    }),
                  ],
                }),
                ...activity.alternatives.map(alt => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(alt.alternative)],
                      }),
                      new TableCell({
                        children: [new Paragraph(alt.feedback)],
                      }),
                      new TableCell({
                        children: [new Paragraph(alt.correct_answer ? "Sim" : "Não")],
                      }),
                    ],
                  })
                ),
              ],
            }),
            new Paragraph({
              text: `\nCompetência Avaliada: ${activity.competence}`,
            }),
          ]).flat(),
        ],
      }],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=atividades.docx');
    res.setHeader('Content-Length', buffer.length);

    // Send the file
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Error generating document' });
  }
} 