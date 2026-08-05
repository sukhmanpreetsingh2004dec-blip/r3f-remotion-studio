import { Composition } from 'remotion';
import { GlobeZoom } from './compositions/GlobeZoom';
import { RussianForest } from './compositions/RussianForest';

/**
 * RemotionRoot — registers all video compositions.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Composition 1: Pakistan Globe Zoom (6s) */}
      <Composition
        id="GlobeZoom"
        component={GlobeZoom}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />

      {/* Composition 2: Russian Forest Motorcade Drone Shot (8s) */}
      <Composition
        id="RussianForest"
        component={RussianForest}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
