import { interpolate, Easing } from 'remotion';

/**
 * Smooth ease-out cubic interpolation helper.
 * Use with useCurrentFrame() for frame-accurate animations.
 */
export function easeOut(
  frame: number,
  startFrame: number,
  endFrame: number,
  fromValue: number,
  toValue: number,
): number {
  return interpolate(frame, [startFrame, endFrame], [fromValue, toValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
}

/**
 * Smooth ease-in-out interpolation helper.
 */
export function easeInOut(
  frame: number,
  startFrame: number,
  endFrame: number,
  fromValue: number,
  toValue: number,
): number {
  return interpolate(frame, [startFrame, endFrame], [fromValue, toValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.76, 0, 0.24, 1),
  });
}

/**
 * Spring-like overshoot easing.
 */
export function springOvershoot(
  frame: number,
  startFrame: number,
  endFrame: number,
  fromValue: number,
  toValue: number,
): number {
  return interpolate(frame, [startFrame, endFrame], [fromValue, toValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
}

/**
 * Fade opacity from 0 to 1 over given frame range.
 */
export function fadeIn(frame: number, startFrame: number, durationFrames: number): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
}

/**
 * Fade opacity from 1 to 0 over given frame range.
 */
export function fadeOut(frame: number, startFrame: number, durationFrames: number): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
}
