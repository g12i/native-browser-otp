const encoder = new TextEncoder('utf-8')

async function createHmac(
  secret: string,
  text: Uint8Array
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign", "verify"]
  );

  const hash = await crypto.subtle.sign("HMAC", key, text);

  return new Uint8Array(hash);
}

/**
 * As the output of the HMAC-SHA-1 calculation is 160 bits, we must
 * truncate this value to something that can be easily entered by a
 * user.
 *
 * The Truncate function performs the dynamic truncation and then
 * the reduction modulo 10^Digit.  The purpose of the dynamic
 * offset truncation technique is to extract a 4-byte dynamic
 * binary code from a 160-bit (20-byte) HMAC-SHA-1 result.
 *
 * See: https://datatracker.ietf.org/doc/html/rfc4226#section-5.4
 *
 * @param hash
 * @returns 20-byte has truncated to 4 bytes
 */
function truncate(hash: Uint8Array): number {
  const offset = hash[hash.length - 1] & 0xf;

  return (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  );
}

/**
 * The HOTP algorithm is based on an increasing counter value (C) and a
 * static symmetric key known only to the token and the validation
 * service (K). In order to create the HOTP value.
 *
 *  We can describe the operations in 3 distinct steps:
 *
 *  Step 1: Generate an HMAC-SHA-1 value Let HS = HMAC-SHA-1(K,C)  // HS
 *  is a 20-byte string
 *
 *  Step 2: Generate a 4-byte string (Dynamic Truncation) (see truncate() above)
 *
 *  Step 3: Compute an HOTP value
 *  Let Snum  = StToNum(Sbits)   // Convert S to a number in
 *                                   0...2^{31}-1
 *  Return D = Snum mod 10^Digit //  D is a number in the range
 *                                   0...10^{Digit}-1
 *
 * See: https://datatracker.ietf.org/doc/html/rfc4226
 *
 * @param secret - static symmetric key known only to the token and the validation
 * service
 * @param counter - an increasing counter value
 * @returns OTP
 */
export async function hotp(secret: string, counter: number): Promise<string> {
  const text = new Uint8Array(8);

  for (let i = text.length - 1; i >= 0; i--) {
    text[i] = counter & 0xff;
    counter >>= 8;
  }

  const hash = await createHmac(secret, new Uint8Array(text));

  const binary = truncate(hash);

  const otp = binary % 1000000;

  return String(otp).padStart(6, "0");
}

/**
 * TOTP is the time-based variant of this algorithm, where a value T,
 * derived from a time reference and a time step, replaces the counter C
 * in the HOTP computation.
 *
 * See: https://datatracker.ietf.org/doc/html/rfc6238
 *
 * @param secret - static symmetric key known only to the token and the validation
 * service
 * @returns OTP
 */
export async function totp(secret: string): Promise<string> {
  const code = await hotp(secret, Math.floor(Date.now() / 30000));

  return code;
}
