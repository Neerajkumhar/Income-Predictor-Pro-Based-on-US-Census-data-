// Salary ranges and multipliers for different factors
const EDUCATION_MULTIPLIERS: Record<string, number> = {
  'Doctorate': 1.8,
  'Masters': 1.6,
  'Bachelors': 1.4,
  'Some-college': 1.2,
  'HS-grad': 1.0,
  'Other': 0.9
};

const OCCUPATION_BASE_SALARIES: Record<string, number> = {
  'Exec-managerial': 85000,
  'Prof-specialty': 75000,
  'Tech-support': 65000,
  'Sales': 55000,
  'Craft-repair': 45000,
  'Other': 40000
};

const AGE_MULTIPLIERS: Record<string, number> = {
  'entry': 0.8,    // < 25
  'early': 0.9,    // 25-34
  'mid': 1.0,      // 35-44
  'peak': 1.1,     // 45-54
  'late': 1.0,     // 55-64
  'senior': 0.9    // 65+
};

const HOURS_MULTIPLIERS = {
  part_time: 0.6,  // < 35 hours
  full_time: 1.0,  // 35-45 hours
  over_time: 1.2   // > 45 hours
};

// Geographic cost of living adjustments (example multipliers)
const REGION_MULTIPLIERS: Record<string, number> = {
  'Urban-High': 1.3,   // High cost cities
  'Urban-Med': 1.1,    // Medium cost cities
  'Urban-Low': 1.0,    // Low cost cities
  'Suburban': 0.95,    // Suburban areas
  'Rural': 0.85       // Rural areas
};

export interface DetailedPrediction {
  baseSalary: number;
  totalSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  factors: {
    education: number;
    occupation: number;
    experience: number;
    hours: number;
    region: number;
    capitalGains: number;
  };
  breakdown: string[];
}

export function predictDetailedIncome(data: {
  age: number;
  education: string;
  occupation: string;
  hoursPerWeek: number;
  region: string;
  expectedMinSalary?: number;
  expectedMaxSalary?: number;
}): DetailedPrediction {
  // Get base salary from occupation
  const baseSalary = OCCUPATION_BASE_SALARIES[data.occupation] || OCCUPATION_BASE_SALARIES['Other'];
  
  // Calculate multipliers
  const educationMultiplier = EDUCATION_MULTIPLIERS[data.education] || EDUCATION_MULTIPLIERS['Other'];
  
  // Age/experience multiplier
  let ageMultiplier;
  if (data.age < 25) ageMultiplier = AGE_MULTIPLIERS.entry;
  else if (data.age < 35) ageMultiplier = AGE_MULTIPLIERS.early;
  else if (data.age < 45) ageMultiplier = AGE_MULTIPLIERS.mid;
  else if (data.age < 55) ageMultiplier = AGE_MULTIPLIERS.peak;
  else if (data.age < 65) ageMultiplier = AGE_MULTIPLIERS.late;
  else ageMultiplier = AGE_MULTIPLIERS.senior;
  
  // Hours multiplier
  let hoursMultiplier;
  if (data.hoursPerWeek < 35) hoursMultiplier = HOURS_MULTIPLIERS.part_time;
  else if (data.hoursPerWeek <= 45) hoursMultiplier = HOURS_MULTIPLIERS.full_time;
  else hoursMultiplier = HOURS_MULTIPLIERS.over_time;
  
  // Region multiplier
  const regionMultiplier = REGION_MULTIPLIERS[data.region] || REGION_MULTIPLIERS['Urban-Med'];
  
  // Calculate initial total salary
  const adjustedBaseSalary = baseSalary * educationMultiplier;
  const experienceAdjusted = adjustedBaseSalary * ageMultiplier;
  const hoursAdjusted = experienceAdjusted * hoursMultiplier;
  const regionAdjusted = hoursAdjusted * regionMultiplier;
  let initialSalary = regionAdjusted;

  // Adjust based on expected salary range if provided
  if (data.expectedMinSalary && data.expectedMaxSalary) {
    const expectedRange = data.expectedMaxSalary - data.expectedMinSalary;
    const normalizedScore = (initialSalary - OCCUPATION_BASE_SALARIES['Other']) / 
                          (OCCUPATION_BASE_SALARIES['Exec-managerial'] - OCCUPATION_BASE_SALARIES['Other']);
    
    // Scale the salary within the expected range based on calculated factors
    initialSalary = data.expectedMinSalary + (expectedRange * normalizedScore);
  }

  const totalSalary = Math.round(initialSalary);

  // Calculate salary range (±10% variation)
  const salaryRange = {
    min: Math.round(totalSalary * 0.9),
    max: Math.round(totalSalary * 1.1)
  };

  // Generate breakdown of factors
  const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  const breakdown = [
    `Base salary for ${data.occupation}: ${formatINR(baseSalary)}`,
    `Education (${data.education}): ${((educationMultiplier - 1) * 100).toFixed(0)}% adjustment`,
    `Experience (Age ${data.age}): ${((ageMultiplier - 1) * 100).toFixed(0)}% adjustment`,
    `Hours (${data.hoursPerWeek}hr/week): ${((hoursMultiplier - 1) * 100).toFixed(0)}% adjustment`,
    `Region (${data.region}): ${((regionMultiplier - 1) * 100).toFixed(0)}% adjustment`
  ].filter(Boolean) as string[];

  return {
    baseSalary,
    totalSalary,
    salaryRange,
    factors: {
      education: educationMultiplier,
      occupation: 1.0,
      experience: ageMultiplier,
      hours: hoursMultiplier,
      region: regionMultiplier
    },
    breakdown
  };
}