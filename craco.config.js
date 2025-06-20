module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings for react-datepicker
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('react-datepicker') &&
            warning.details &&
            warning.details.includes('source map')
          );
        },
      ];
      return webpackConfig;
    },
  },
}; 