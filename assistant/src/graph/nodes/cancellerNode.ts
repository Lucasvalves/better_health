import type { AppointmentService } from '../../services/appointmentService.ts'
import type { GraphState } from '../graph.ts'

export function createCancellerNode(_appointmentService: AppointmentService) {
  return async (_state: GraphState): Promise<Partial<GraphState>> => {
    return {
      actionSuccess: false,
      actionError: 'Cancellation failed',
    }
  }
}
