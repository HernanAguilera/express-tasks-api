import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

type TokenPayload = {
  userId: number;
};

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export class AuthJWT {
  protected secret: string;
  protected expiresIn: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    this.secret = process.env.JWT_SECRET as string;
    this.expiresIn = (process.env.JWT_EXPIRES_IN as string) || "1h";
  }

  /**
   * Generates a JWT token
   * @param payload - The payload of the token
   * @returns The JWT token
   */
  generateToken(payload: TokenPayload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  /**
   * Verifies the JWT token
   * @param token - The JWT token
   * @returns The decoded token payload
   */
  verifyToken(token: string) {
    try {
      if (!token) {
        throw new Error("Token is not defined");
      }
      const decoded = jwt.verify(token, this.secret);
      return decoded as TokenPayload;
    } catch (error) {
      console.log({ "error verifying token": error, secret: this.secret });
      return {
        userId: null,
      };
    }
  }

  /**
   * Gets the payload from the JWT token
   * @param token - The JWT token
   * @returns The decoded token payload
   */
  getPayloadFromToken(token: string): TokenPayload {
    return this.verifyToken(token) as TokenPayload;
  }

  /**
   * Gets the user ID from the JWT token
   * @param token - The JWT token
   * @returns The user ID
   */
  getUserIdFromToken(token: string) {
    return this.getPayloadFromToken(token).userId;
  }

  /**
   * Refreshes the JWT token
   * @param token - The JWT token
   * @returns The refreshed JWT token
   */
  refreshToken(token: string) {
    const payload = {
      userId: this.getUserIdFromToken(token),
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }
}
