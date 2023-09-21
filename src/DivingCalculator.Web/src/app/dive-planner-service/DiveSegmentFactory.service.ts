import { Injectable } from '@angular/core';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { DiveSegment } from './DiveSegment';
import { BreathingGas } from './BreathingGas';

@Injectable({
  providedIn: 'root',
})
export class DiveSegmentFactoryService {
  constructor(private humanDurationPipe: HumanDurationPipe) {}

  private readonly DESCENT_RATE = 3; // seconds per meter
  private readonly ASCENT_RATE = 6; // seconds per meter

  createEndDiveSegment(startTime: number, depth: number, gas: BreathingGas): DiveSegment {
    const ascentTime = this.getTravelTime(depth, 0);
    const ascentTimeDuration = this.humanDurationPipe.transform(ascentTime);
    const endTime = startTime + ascentTime;

    return new DiveSegment(startTime, endTime, 'Surface', `Ascent time: ${ascentTimeDuration} @ 10m/min`, depth, 0, gas);
  }

  createStartDiveSegment(gas: BreathingGas): DiveSegment {
    return new DiveSegment(0, 0, 'Start Dive', gas.getDescription(), 0, 0, gas);
  }

  createDepthChangeSegment(startTime: number, previousDepth: number, newDepth: number, duration: number, gas: BreathingGas) {
    const descentTime = this.getTravelTime(previousDepth, newDepth);
    const endTime = startTime + descentTime + duration;
    const title = newDepth > previousDepth ? `Descend to ${newDepth}m` : `Ascend to ${newDepth}m`;
    const description =
      newDepth > previousDepth
        ? `Descent time: ${this.humanDurationPipe.transform(descentTime)} @ 20m/min`
        : `Ascent time: ${this.humanDurationPipe.transform(descentTime)} @ 10m/m`;

    return new DiveSegment(startTime, endTime, title, description, previousDepth, newDepth, gas);
  }

  createGasChangeSegment(startTime: number, newGas: BreathingGas, duration: number, depth: number) {
    const endTime = startTime + duration;
    const title = 'Switch Gas';
    const description = newGas.getDescription();

    return new DiveSegment(startTime, endTime, title, description, depth, depth, newGas);
  }

  getTravelTime(previousDepth: number, newDepth: number): number {
    if (newDepth > previousDepth) {
      return (newDepth - previousDepth) * this.DESCENT_RATE;
    } else {
      return (previousDepth - newDepth) * this.ASCENT_RATE;
    }
  }
}
