import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }
    
    const query = req.query.query as string;

    const _toollists = await prisma.toollist.findMany({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      where: {
        name: {
          contains: query
        }
      }
    });

    const results: typeof _toollists = _toollists

    res.status(200).json({
      results,
    });
  } catch (error) {
    console.error('[toollist API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
