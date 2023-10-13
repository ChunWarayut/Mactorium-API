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

    const existMachineType = await prisma.machinetype.findUnique({
      where: {
        id: id
      },
    });

    if (!existMachineType) {
      res.status(400).json({
        message: 'The machinetype using the provided code was not found.',
      });
      return;
    }

    await prisma.machinetype.delete({
      where: {
        id: id
      }
    })

    const machinetype = await prisma.machinetype.findMany();
    res.status(200).json({
      machinetype,
    });
  } catch (error) {
    console.error('[machinetype API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
