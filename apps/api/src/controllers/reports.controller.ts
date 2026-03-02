import { Request, Response, NextFunction } from 'express'
import { ReportsService } from '../services/reports.service'

export const ReportsController = {
  async getSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await ReportsService.getSummary()
      res.json({ data: summary })
    } catch (error) {
      next(error)
    }
  }
}