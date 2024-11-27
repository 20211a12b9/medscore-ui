import ReactGA from 'react-ga4';

export const initializeAnalytics = () => {
  ReactGA.initialize('G-5T20DYN1Q0');
};

export const trackPageView = (path) => {
  ReactGA.send('pageview', path);
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
};