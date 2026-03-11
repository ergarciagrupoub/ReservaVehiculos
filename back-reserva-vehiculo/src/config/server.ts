export const getPort = () => {
  return process.env.HTTP_PLATFORM_PORT || process.env.PORT || '3001';
};

export const getHost = () => {
  return process.env.SERVER_HOST || process.env.HOST || '0.0.0.0';
};
