import { jwtVerify } from "jose";

type ValidateTokenResult =
  | { authenticated: true; payload: any }
  | { authenticated: false; reason: "missing" | "invalid" | "expired" };

/**
 * Validates a JWT token using a secret key.
 * 
 * @param token - The JWT token to validate.
 * @param secret - The secret key used for verification.
 * @returns A promise that resolves to a ValidateTokenResult.
 */
export async function validateAuthToken(
  token: string | undefined,
  secret: string
): Promise<ValidateTokenResult> {
  if (!token) {
    return { authenticated: false, reason: "missing" };
  }

  try {
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey);

    return {
      authenticated: true,
      payload,
    };
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return { authenticated: false, reason: "expired" };
    }

    return { authenticated: false, reason: "invalid" };
  }
}
