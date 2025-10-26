export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';
  return apiUrl.replace('/api', '');
};

export const getAvatarUrl = (avatarPath, defaultPath = '/uploads/avatars/def_avatar.png') => {
  const baseUrl = getBaseUrl();
  return avatarPath ? `${baseUrl}${avatarPath}` : `${baseUrl}${defaultPath}`;
};

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  const baseUrl = getBaseUrl();
  return `${baseUrl}${assetPath}`;
};