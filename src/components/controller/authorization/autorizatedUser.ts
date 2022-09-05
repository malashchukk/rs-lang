type authorizedUser = {
  message: "Authenticated";
  name: string;
  refreshToken: string;
  token: string;
  userId: string;
};
export default authorizedUser;
