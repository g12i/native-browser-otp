# native-browser-otp

A lightweight library for generating TOTP (Time-based One-Time Password) and HOTP (HMAC-based One-Time Password) codes using the browser's native Web Cryptography API. Perfect for implementing two-factor authentication (2FA) in web applications.

[![npm version](https://img.shields.io/npm/v/native-browser-otp.svg)](https://www.npmjs.com/package/native-browser-otp)
[![bundle size](https://img.shields.io/bundlephobia/min/native-browser-otp)](https://bundlephobia.com/package/native-browser-otp)
[![license](https://img.shields.io/npm/l/native-browser-otp)](https://github.com/g12i/native-browser-otp/blob/main/LICENSE)

## Features

- 🔒 Secure: Uses native Web Cryptography API
- 📦 Lightweight: Only 1.02 KiB / 0.59 KiB gzip
- 🚀 Minimal dependencies (just base32-decode)
- ⚡ Fast: Native browser implementation
- 📱 Works in all modern browsers (see [caniuse.com/cryptography](https://caniuse.com/cryptography))

## Installation

```bash
# npm
npm install native-browser-otp

# pnpm
pnpm install native-browser-otp

# yarn
yarn add native-browser-otp
```

## Usage

### TOTP (Time-based One-Time Password)

```javascript
import { totp, timeLeft } from "native-browser-otp";

// Generate a TOTP code
const code = await totp("JBSWY3DPEHPK3PXP"); // Your base32-encoded secret

// Get remaining seconds until next code
const secondsLeft = timeLeft();
```

### HOTP (HMAC-based One-Time Password)

```javascript
import { hotp } from "native-browser-otp";

// Generate an HOTP code with a counter
const code = await hotp("JBSWY3DPEHPK3PXP", 123); // Secret and counter
```

## API Reference

### `totp(secret: string): Promise<string>`

Generates a time-based one-time password.

- `secret`: Base32-encoded secret key
- Returns: Promise resolving to a 6-digit OTP code

### `hotp(secret: string, counter: number): Promise<string>`

Generates an HMAC-based one-time password.

- `secret`: Base32-encoded secret key
- `counter`: Counter value
- Returns: Promise resolving to a 6-digit OTP code

### `timeLeft(): number`

Returns the number of seconds remaining until the next TOTP code is generated.

- Returns: Number of seconds (0-29)

## Browser Support

This library requires the Web Cryptography API. See [caniuse.com/cryptography](https://caniuse.com/cryptography) for detailed browser support information.

## Demo

[Try it out](https://g12i.github.io/native-browser-otp/) in your browser!

## License

ISC © [Wojciech Grzebieniowski](https://github.com/g12i)
