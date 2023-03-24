export const authUtil = (() => {
  let _accessToken;
  let _headers = {};

  const setAccessToken = val => {
    _accessToken = val;
    _headers = {
      Authorization: `Bearer ${_accessToken}`,
    };
  };

  const getAccessToken = () => _accessToken;
  const getAuthHeaders = () => _headers;

  return { getAccessToken, setAccessToken, getAuthHeaders };
})();

export const updateAccessToken = async getAccessTokenSilently => {
  const accessToken = await getAccessTokenSilently({
    audience: window.appConfig.auth0Audience,
  });

  authUtil.setAccessToken(accessToken);

  return accessToken;
};
