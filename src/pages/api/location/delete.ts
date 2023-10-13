import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { id } = req.body;

    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }

    const existLocation = await prisma.location.findUnique({
      where: {
        id: id
      },
    });

    if (!existLocation) {
      res.status(400).json({
        message: 'The location using the provided code was not found.',
      });
      return;
    }

    await prisma.location.delete({
      where: {
        id: id
      }
    })

    const location = await prisma.location.findMany();
    res.status(200).json({
      location,
    });
  } catch (error) {
    console.error('[location API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
