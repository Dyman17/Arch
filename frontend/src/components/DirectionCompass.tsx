import React from 'react';
import { Navigation } from 'lucide-react';

interface DirectionCompassProps {
  bearingDeg: number;
  kioskHeadingDeg: number;
  directionText: string;
  distanceM: number;
  durationMin: number;
  lang: string;
}

export const DirectionCompass: React.FC<DirectionCompassProps> = ({
  bearingDeg,
  kioskHeadingDeg,
  directionText,
  distanceM,
  durationMin,
  lang,
}) => {
  // Relative angle compared to the physical kiosk front
  const relativeAngle = (bearingDeg - kioskHeadingDeg + 360) % 360;

  let relativeDescription = '';
  if (relativeAngle >= 340 || relativeAngle <= 20) {
    relativeDescription = lang === 'kk' ? 'Тура алға' : lang === 'en' ? 'Straight ahead' : 'Прямо перед вами';
  } else if (relativeAngle > 20 && relativeAngle < 70) {
    relativeDescription = lang === 'kk' ? 'Алға оңға қарай' : lang === 'en' ? 'Slightly to your right' : 'Впереди правее';
  } else if (relativeAngle >= 70 && relativeAngle <= 110) {
    relativeDescription = lang === 'kk' ? 'Оң жаққа бұрылыңыз' : lang === 'en' ? 'Turn right' : 'Направо от экрана';
  } else if (relativeAngle > 110 && relativeAngle < 160) {
    relativeDescription = lang === 'kk' ? 'Артқа оңға' : lang === 'en' ? 'Back to your right' : 'Сзади справа';
  } else if (relativeAngle >= 160 && relativeAngle <= 200) {
    relativeDescription = lang === 'kk' ? 'Артқа қарай жүріңіз' : lang === 'en' ? 'Behind the kiosk' : 'Позади стелы';
  } else if (relativeAngle > 200 && relativeAngle < 250) {
    relativeDescription = lang === 'kk' ? 'Артқа солға' : lang === 'en' ? 'Back to your left' : 'Сзади слева';
  } else if (relativeAngle >= 250 && relativeAngle <= 290) {
    relativeDescription = lang === 'kk' ? 'Сол жаққа бұрылыңыз' : lang === 'en' ? 'Turn left' : 'Налево от экрана';
  } else {
    relativeDescription = lang === 'kk' ? 'Алға солға қарай' : lang === 'en' ? 'Slightly to your left' : 'Впереди левее';
  }

  return (
    <div className="editorial-compass-card">
      <div className="compass-rotor-cell">
        <div className="compass-dial-ring">
          <div className="compass-tick-marks">
            <span className="c-tick n">0°</span>
            <span className="c-tick e">90°</span>
            <span className="c-tick s">180°</span>
            <span className="c-tick w">270°</span>
          </div>

          <div className="kiosk-screen-marker">
            <span>ЭКРАН</span>
          </div>

          <div
            className="compass-needle-rotor"
            style={{ transform: `rotate(${relativeAngle}deg)` }}
          >
            <div className="needle-head">
              <Navigation className="needle-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="compass-narrative-cell">
        <div className="compass-relative-callout">
          {relativeDescription}
        </div>

        <div className="compass-metrics-row">
          <div className="metric-unit">
            <span className="unit-number">{distanceM} м</span>
            <span className="unit-label">{lang === 'kk' ? 'Қашықтық' : lang === 'en' ? 'Distance' : 'Расстояние'}</span>
          </div>
          <div className="metric-separator" />
          <div className="metric-unit">
            <span className="unit-number">{durationMin} мин</span>
            <span className="unit-label">{lang === 'kk' ? 'Жаяу' : lang === 'en' ? 'Walking' : 'Пешком'}</span>
          </div>
        </div>

        <p className="compass-step-guidance">{directionText}</p>
      </div>
    </div>
  );
};
