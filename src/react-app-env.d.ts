/// <reference types="react-scripts" />

// Suppress source map warnings for react-datepicker
declare module 'react-datepicker/src/*' {
  const content: any;
  export default content;
}
