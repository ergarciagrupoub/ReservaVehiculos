export const getPort = () => {
  return process.env.HTTP_PLATFORM_PORT || process.env.PORT || '3001';
};