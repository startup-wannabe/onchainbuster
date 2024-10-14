import type React from 'react';
import { Spring, animated } from 'react-spring';

const AnimatedComponent = {
  OpacityFadeInDiv: ({
    children,
    delay,
    style,
  }: {
    children: React.ReactElement;
    delay: number;
    style?: React.CSSProperties;
  }) => (
    <Spring
      delay={delay}
      from={{
        opacity: 0,
      }}
      to={{
        opacity: 1,
      }}
    >
      {(styles: any) => (
        <animated.div style={{ ...styles, ...style }}>{children}</animated.div>
      )}
    </Spring>
  ),
};

export default AnimatedComponent;
