import { Composition } from 'remotion';
import { GlobeZoom } from './compositions/GlobeZoom';

/**
 * RemotionRoot registers all video compositions.
 * Width: 1280, Height: 720 (720p HD), FPS: 30, Duration: 6 seconds = 180 frames
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GlobeZoom"
        component={GlobeZoom}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
