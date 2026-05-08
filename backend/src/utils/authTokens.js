import jwt from "jsonwebtoken";

export function signToken(user, extraClaims = {}) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      ...extraClaims
    },
    process.env.JWT_SECRET || "change_this_secret",
    {
      expiresIn: "7d"
    }
  );
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}
