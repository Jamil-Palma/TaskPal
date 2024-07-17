import React from 'react';
import { BackgroundImage } from './BackgroundImage';
import { WelcomeContent } from './WelcomeContent';

interface GeminiWelcomeProps {}

export const GeminiWelcome: React.FC<GeminiWelcomeProps> = () => {
  return (
    <main className="flex overflow-hidden relative flex-col justify-center items-start px-16 py-16 w-full min-h-[1042px] max-md:px-5 max-md:max-w-full">
      <BackgroundImage />
      <WelcomeContent />
    </main>
  );
};
