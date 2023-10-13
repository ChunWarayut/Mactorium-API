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
    
    const _toollist = await prisma.toollist.findMany({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
    })

    res.status(200).json({
      toollists: _toollist,
    });
  } catch (error) {
    console.error('[toollist API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
