import React from 'react';

import { MappedWorkingHours } from '../../../../../../../models/checkout.models';
import WorkingDays from '../../../../../../../models/constants/checkout';
import { getWorkingHours } from '../../../../../../helpers/checkoutHelpers';
import styles from './workingTimetable.module.scss';

type WorkingTimetablePropsType = {
  hours: MappedWorkingHours[];
};

const WorkingTimetable = ({ hours }: WorkingTimetablePropsType) => {
  return (
    <div className={styles.wrapper}>
      {hours.map((hour) => {
        return (
          <p className={styles.line} key={hour.pickupDay}>
            <span className={styles.day}>{WorkingDays[hour.pickupDay]}</span>
            <span>{hour.isClosed ? 'Closed' : getWorkingHours(hour.startTime, hour.endTime)}</span>
          </p>
        );
      })}
    </div>
  );
};

export default WorkingTimetable;
