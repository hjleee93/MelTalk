import { Request, Response } from 'express';
import testService from '../services/testService';

export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await testService.getTests();
    res.json(tests);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
