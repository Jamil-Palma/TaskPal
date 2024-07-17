import React from 'react';

interface LogoProps {}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2c7c8f93ae23b715f31b08846de1ce531a824852afa345c6d2b5e6c7f7823d8?apiKey=85ed67fc5e9240cebf026c7e934f100c&"
      alt="Google Gemini Logo"
      className="max-w-full aspect-[7.69] fill-[linear-gradient(86deg,#CC51D6_-11.43%,rgba(90,104,232,0.60)_24.88%,#E1B1FF_54.79%),linear-gradient(97deg,#FFF_-11.56%,rgba(255,255,255,0.50)_82.45%),linear-gradient(97deg,#FFF_-11.56%,rgba(255,255,255,0.50)_82.45%)] w-[174px]"
    />
  );
};
