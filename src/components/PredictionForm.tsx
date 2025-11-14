import React from 'react';
import { useForm } from 'react-hook-form';
import { PredictionFormData } from '../types';

interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => void;
  isLoading?: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, watch } = useForm<PredictionFormData>({
    defaultValues: {
      age: 35,
      education: 'Bachelors',
      occupation: 'Prof-specialty',
      hoursPerWeek: 40,
      region: 'Urban-Med',
      expectedMinSalary: 700000, // 7 Lac
      expectedMaxSalary: 1500000 // 15 Lac
    }
  });

  const ageValue = watch('age');
  const hoursValue = watch('hoursPerWeek');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Age: {ageValue}
          </label>
          <input
            type="range"
            min="16"
            max="90"
            {...register('age', { valueAsNumber: true })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>16</span>
            <span>90</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Education
          </label>
          <select
            {...register('education')}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="Doctorate">Doctorate</option>
            <option value="Masters">Masters</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Some-college">Some College</option>
            <option value="HS-grad">High School Graduate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Occupation
          </label>
          <select
            {...register('occupation')}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="Exec-managerial">Executive/Managerial</option>
            <option value="Prof-specialty">Professional Specialty</option>
            <option value="Sales">Sales</option>
            <option value="Tech-support">Tech Support</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Hours per Week: {hoursValue}
          </label>
          <input
            type="range"
            min="1"
            max="99"
            {...register('hoursPerWeek', { valueAsNumber: true })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>1</span>
            <span>99</span>
          </div>
        </div>



        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Region
          </label>
          <select
            {...register('region')}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="Urban-High">Major City (High Cost)</option>
            <option value="Urban-Med">Urban Area (Medium Cost)</option>
            <option value="Urban-Low">Urban Area (Low Cost)</option>
            <option value="Suburban">Suburban Area</option>
            <option value="Rural">Rural Area</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Expected Salary Range (INR per year)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                {...register('expectedMinSalary', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="300000">₹3 Lac</option>
                <option value="500000">₹5 Lac</option>
                <option value="700000">₹7 Lac</option>
                <option value="1000000">₹10 Lac</option>
                <option value="1500000">₹15 Lac</option>
                <option value="2000000">₹20 Lac</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Minimum</p>
            </div>
            <div>
              <select
                {...register('expectedMaxSalary', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="500000">₹5 Lac</option>
                <option value="700000">₹7 Lac</option>
                <option value="1000000">₹10 Lac</option>
                <option value="1500000">₹15 Lac</option>
                <option value="2000000">₹20 Lac</option>
                <option value="3000000">₹30 Lac</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Maximum</p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Predict Income'}
      </button>
    </form>
  );
};
