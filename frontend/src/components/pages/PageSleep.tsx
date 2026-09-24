import React from 'react';
import { SleepScreen } from '../SleepScreen';

interface PageSleepProps {
  onWakeUp: () => void;
  lang: string;
  isPersonPresent: boolean;
  cameraActive?: boolean;
  onSimulateApproach?: () => void;
}

export const PageSleep: React.FC<PageSleepProps> = ({
  onWakeUp,
  lang,
  isPersonPresent,
  cameraActive,
  onSimulateApproach,
}) => {
  return (
    <div className="page-stage page-sleep">
      <SleepScreen
        onWake={onWakeUp}
        lang={lang}
        isPersonPresent={isPersonPresent}
        cameraActive={cameraActive}
        onSimulateApproach={onSimulateApproach}
      />
    </div>
  );
};
