import React from 'react';
import { Logo } from './Logo';

interface WelcomeContentProps {}

export const WelcomeContent: React.FC<WelcomeContentProps> = () => {
  return (
    <section className="flex relative flex-col mb-44 ml-20 max-w-full w-[751px] max-md:mb-10">
      <Logo />
      <h1 className="mt-60 text-7xl font-semibold bg-clip-text leading-[90px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
        Welcome to Google Gemini! 2
      </h1>
      <p className="mt-8 text-base leading-6 text-white text-opacity-60 max-md:max-w-full">
        Discover a vibrant community of creators on Google Gemini! Connect with thousands of like-minded individuals on Discord or the web and unleash your imagination through collaborative storytelling. From vivid worlds to unforgettable characters, bring your short text descriptions to life in new and exciting ways. Join Serendipity today and embark on a journey of endless creativity!
      </p>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b6aadf3240656937ff71c1fcfbcef15d9515264e50c104f8e0838851feb54421?apiKey=85ed67fc5e9240cebf026c7e934f100c&"
        alt="Decorative icon"
        className="mt-5 ml-2.5 w-14 aspect-square"
      />
    </section>
  );
};