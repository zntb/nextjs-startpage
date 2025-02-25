import classes from './parallax-visualization.module.css';

function ParallaxVisualization() {
  return (
    <svg
      className={classes.waves}
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className={classes.parallax}>
        <use href="#gentle-wave" x="48" y="0" fill="rgba(55, 90, 95, 0.7)" />
        <use href="#gentle-wave" x="48" y="3" fill="rgba(55, 90, 95, 0.5)" />
        <use href="#gentle-wave" x="48" y="5" fill="rgba(77, 125, 132, 0.3)" />
        <use href="#gentle-wave" x="48" y="7" fill="rgba(77, 125, 132, 0.7)" />
      </g>
    </svg>
  );
}

export default ParallaxVisualization;
