import { BusinessInfo, PremiumSuggestion } from '../../types';
import * as tf from '@tensorflow/tfjs';

// Simple neural network for premium suggestions
async function createModel() {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [10]
  }));
  
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError'
  });

  return model;
}

function preprocessBusinessData(data: BusinessInfo) {
  // Extract relevant numerical features
  const features = [
    data.yearsInBusiness,
    data.locations.length,
    data.payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0),
    data.payrollInfo.reduce((sum, info) => sum + info.annualPayroll, 0),
    data.lossHistory.length,
    data.lossHistory.reduce((sum, loss) => sum + loss.amount, 0),
    data.safetyPrograms.length,
    data.riskControls.length,
    data.workforceMetrics.turnoverRate,
    data.workforceMetrics.trainingHoursPerYear
  ];

  return tf.tensor2d([features], [1, 10]);
}

export async function generatePremiumSuggestions(data: BusinessInfo): Promise<PremiumSuggestion[]> {
  try {
    const model = await createModel();
    const inputData = preprocessBusinessData(data);
    
    // Generate base prediction
    const prediction = await model.predict(inputData) as tf.Tensor;
    const basePremium = prediction.dataSync()[0];

    // Generate variations
    const suggestions: PremiumSuggestion[] = [
      {
        premium: basePremium,
        confidence: 0.85,
        adjustments: [],
        reasoning: "Base premium calculation based on current risk factors"
      },
      {
        premium: basePremium * 0.9,
        confidence: 0.75,
        adjustments: [
          "Implement additional safety training",
          "Install workplace monitoring systems"
        ],
        reasoning: "10% reduction possible with enhanced safety measures"
      },
      {
        premium: basePremium * 1.1,
        confidence: 0.8,
        adjustments: [],
        reasoning: "Conservative estimate accounting for industry trends"
      }
    ];

    return suggestions;
  } catch (error) {
    console.error('Premium Suggestion Error:', error);
    return [];
  }
}