import { useEffect } from 'react';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ProgressBarStyle } from './components/ProgressBar';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import ThemeColorPresets from './components/ThemeColorPresets';
import useSettings from './hooks/useSettings';
import NajvaScript from './NajvaScript';

// ----------------------------------------------------------------------

export default function App() {
  const { onChangeDirection } = useSettings();
  useEffect(() => {
    onChangeDirection('rtl');
  }, []);

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <RtlLayout>
          <MotionLazyContainer>
            <ProgressBarStyle />
            <ScrollToTop />
            <NajvaScript />
            <Router />
          </MotionLazyContainer>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
