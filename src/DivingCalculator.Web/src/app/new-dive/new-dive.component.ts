import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectionListChange } from '@angular/material/list';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss'],
})
export class NewDiveComponent {
  constructor(
    private router: Router,
    private divePlanner: DivePlannerService
  ) {}

  standardGases: BreathingGas[] = this.divePlanner.getStandardGases();
  selectedStandardGas: BreathingGas = this.standardGases[0];
  gasType = 'standard';
  customGas: BreathingGas = BreathingGas.create(21, 0, 79);

  isMinDepthError(): boolean {
    return this.getSelectedGas().MinDepth > 0;
  }

  getSelectedGas() {
    if (this.gasType === 'standard') {
      return this.selectedStandardGas;
    } else {
      return this.customGas;
    }
  }

  getCustomGasDisabled() {
    return this.gasType === 'standard';
  }

  getStandardGasDisabled() {
    return this.gasType === 'custom';
  }

  onOxygenInput(): void {
    this.updateCustomGasNitrogen();
  }

  onHeliumInput(): void {
    this.updateCustomGasNitrogen();
  }

  updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
    this.customGas = BreathingGas.create(this.customGas.Oxygen, this.customGas.Helium, this.customGas.Nitrogen);
  }

  onStandardGasChange(event: MatSelectionListChange) {
    this.selectedStandardGas = event.options[0].value;
  }

  getGasTooltip(gas: BreathingGas): string {
    return `Max Depth (PO2): ${gas.MaxDepthPO2}m (${gas.MaxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.MaxDepthEND}m\nMin Depth (Hypoxia): ${gas.MinDepth}m`;
  }

  onSave() {
    this.divePlanner.startDive(this.getSelectedGas());
    this.router.navigate(['/dive-plan']);
  }
}
