import { WeekDays } from '../checkout.models';

const WorkingDays = {
  [WeekDays.MONDAY]: 'MON',
  [WeekDays.TUESDAYFRIDAY]: 'TUE - FRI',
  [WeekDays.SATURDAY]: 'SAT',
  [WeekDays.SUNDAY]: 'SUN',
};

export default WorkingDays;
