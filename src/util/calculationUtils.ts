import { Calculation, ComparisonValues, EnergyAndCarbon } from "../types";
import { SimulationResult } from "./simulations";

const zeroCarbonAndEnergy: EnergyAndCarbon = {
  carbonGrams: 0,
  totalEnergyConsumptionWh: 0,
};

export const combineCalculations = (
  calculations: Calculation[]
): Calculation => {
  return calculations.reduce<Calculation>(
    (result, calc) => {
      return {
        comparisonValues: {
          drivingKMPetrolCar:
            result.comparisonValues.drivingKMPetrolCar +
            calc.comparisonValues.drivingKMPetrolCar,
          lightBulbDurationSeconds:
            result.comparisonValues.lightBulbDurationSeconds +
            calc.comparisonValues.lightBulbDurationSeconds,
        },
        dataTransferEnergyConsumption: {
          carbonGrams:
            result.dataTransferEnergyConsumption.carbonGrams +
            calc.dataTransferEnergyConsumption.carbonGrams,
          totalEnergyConsumptionWh:
            result.dataTransferEnergyConsumption.totalEnergyConsumptionWh +
            calc.dataTransferEnergyConsumption.totalEnergyConsumptionWh,
        },
        energyOfUse: {
          carbonGrams:
            result.energyOfUse.carbonGrams + calc.energyOfUse.carbonGrams,
          totalEnergyConsumptionWh:
            result.energyOfUse.totalEnergyConsumptionWh +
            calc.energyOfUse.totalEnergyConsumptionWh,
        },
        networkEnergyConsumption: {
          carbonGrams:
            result.networkEnergyConsumption.carbonGrams +
            calc.networkEnergyConsumption.carbonGrams,
          totalEnergyConsumptionWh:
            result.networkEnergyConsumption.totalEnergyConsumptionWh +
            calc.networkEnergyConsumption.totalEnergyConsumptionWh,
        },
        serverEnergyConsumption: {
          carbonGrams:
            result.serverEnergyConsumption.carbonGrams +
            calc.serverEnergyConsumption.carbonGrams,
          totalEnergyConsumptionWh:
            result.serverEnergyConsumption.totalEnergyConsumptionWh +
            calc.serverEnergyConsumption.totalEnergyConsumptionWh,
        },
        total: {
          carbonGrams: result.total.carbonGrams + calc.total.carbonGrams,
          totalEnergyConsumptionWh:
            result.total.totalEnergyConsumptionWh +
            calc.total.totalEnergyConsumptionWh,
        },
      };
    },
    {
      comparisonValues: {
        drivingKMPetrolCar: 0,
        lightBulbDurationSeconds: 0,
      },
      dataTransferEnergyConsumption: zeroCarbonAndEnergy,
      energyOfUse: zeroCarbonAndEnergy,
      networkEnergyConsumption: zeroCarbonAndEnergy,
      serverEnergyConsumption: zeroCarbonAndEnergy,
      total: zeroCarbonAndEnergy,
    }
  );
};

const multiplyEnergyAndCarbon = (
  energyAndCarbon: EnergyAndCarbon,
  users: number
): EnergyAndCarbon => {
  return {
    carbonGrams: energyAndCarbon.carbonGrams * users,
    totalEnergyConsumptionWh: energyAndCarbon.totalEnergyConsumptionWh * users,
  };
};

export const multiplyCalculation = (
  calculation: Calculation,
  users: number
): Calculation => ({
  comparisonValues: {
    drivingKMPetrolCar: calculation.comparisonValues.drivingKMPetrolCar * users,
    lightBulbDurationSeconds:
      calculation.comparisonValues.lightBulbDurationSeconds * users,
  },
  dataTransferEnergyConsumption: multiplyEnergyAndCarbon(
    calculation.dataTransferEnergyConsumption,
    users
  ),
  networkEnergyConsumption: multiplyEnergyAndCarbon(
    calculation.networkEnergyConsumption,
    users
  ),
  energyOfUse: multiplyEnergyAndCarbon(calculation.energyOfUse, users),
  serverEnergyConsumption: multiplyEnergyAndCarbon(
    calculation.serverEnergyConsumption,
    users
  ),
  total: multiplyEnergyAndCarbon(calculation.total, users),
});

export const getCarbonKg = (
  simulationResults: SimulationResult[],
  type: keyof SimulationResult["impacts"]
) => {
  return (
    simulationResults.reduce(
      (result, curr) => result + curr.impacts[type].total.carbonGrams,
      0
    ) / 1000
  );
};

export const getTotalComparisons = (simulationResults: SimulationResult[]) => {
  return simulationResults.reduce<ComparisonValues>(
    (result, simulation) => {
      return {
        drivingKMPetrolCar:
          result.drivingKMPetrolCar +
          simulation.impacts.totalImpact.comparisonValues.drivingKMPetrolCar,
        lightBulbDurationSeconds:
          result.lightBulbDurationSeconds +
          simulation.impacts.totalImpact.comparisonValues
            .lightBulbDurationSeconds,
      };
    },
    {
      drivingKMPetrolCar: 0,
      lightBulbDurationSeconds: 0,
    }
  );
};
