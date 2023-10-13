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

    const existToollist = await prisma.toollist.findUnique({
      where: {
        id: id
      },
    });

    if (!existToollist) {
      res.status(400).json({
        message: 'The toollist using the provided code was not found.',
      });
      return;
    }

    await prisma.toollist.delete({
      where: {
        id: id
      }
    })

    const toollist = await prisma.toollist.findMany();
    res.status(200).json({
      toollist,
    });
  } catch (error) {
    console.error('[toollist API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
