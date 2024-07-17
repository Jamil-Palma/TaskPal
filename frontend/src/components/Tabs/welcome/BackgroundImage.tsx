import React from 'react';

interface BackgroundImageProps {}

export const BackgroundImage: React.FC<BackgroundImageProps> = () => {
  return (
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/54bd6441838424d01293d348e6ca34b40ad539a813bae2124c4190df1de52429?apiKey=85ed67fc5e9240cebf026c7e934f100c&"
      alt=""
      className="object-cover absolute inset-0 size-full"
    />
  );
};