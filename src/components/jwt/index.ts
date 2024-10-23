import jwt from "jsonwebtoken";

export const jwtDecode = (token: string) => {
  return jwt.decode(token, { complete: true });
};
