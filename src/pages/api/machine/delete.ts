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

    const existMachine = await prisma.machine.findUnique({
      where: {
        id: id
      },
    });

    if (!existMachine) {
      res.status(400).json({
        message: 'The machine using the provided code was not found.',
      });
      return;
    }

    await prisma.machine.delete({
      where: {
        id: id
      }
    })

    const machine = await prisma.machine.findMany();
    res.status(200).json({
      machine,
    });
  } catch (error) {
    console.error('[machine API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
