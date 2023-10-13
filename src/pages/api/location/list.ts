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
    
    const _location = await prisma.location.findMany({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
    })

    res.status(200).json({
      locations: _location,
    });
  } catch (error) {
    console.error('[location API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
