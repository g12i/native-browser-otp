# native-browser-otp

Generate TOTP and HOTP with browser's native Web Cryptography.

Very lightweight, 1.02 KiB / 0.59 KiB gzip with just one dependency.

See [caniuse.com/cryptography](https://caniuse.com/cryptography) for Browser support.

## Demo

[See here](https://g12i.github.io/native-browser-otp/).

## Quick start

```bash
npm install native-browser-otp
```

```bash
pnpm install native-browser-otp
```

```bash
yarn add native-browser-otp
```

```jsx
import { totp, getTimeLeft } from "native-browser-otp";

const code = await totp(BASE_32_SECRET);
const timeLeft = getTimeLeft();
```
