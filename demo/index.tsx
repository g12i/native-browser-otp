import { Card, Label, majorScale, Pane, TextInputField } from "evergreen-ui";
import React, { ChangeEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import QRCode from "react-qr-code";
import { useInterval } from "react-use";
import { totp, getTimeLeft } from "../lib";

function App() {
  const [secret, setSecret] = useState("S2HV2DTHMDVZ6WXRZ6AP35JBBAHSQPFD");
  const [code, setCode] = useState<string | Error>("");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useInterval(() => {
    setTimeLeft(getTimeLeft());
  }, 1000);

  useEffect(() => {
    totp(secret).then(setCode).catch(setCode);
  }, [secret, timeLeft]);

  return (
    <Card
      maxWidth={400}
      marginX="auto"
      marginY={majorScale(4)}
      padding={16}
      background="tint2"
      elevation={1}
      borderRadius={3}
    >
      <Pane marginBottom={majorScale(2)}>
        <Pane
          display="flex"
          justifyContent="center"
          backgroundColor="#fff"
          padding={majorScale(4)}
          marginBottom={majorScale(4)}
        >
          <QRCode
            value={`otpauth://totp/DEMO:foo@exmaple.com?secret=${secret}&issuer=DEMO`}
          />
        </Pane>
        <TextInputField
          label="Secret"
          value={secret}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSecret(e.target.value);
          }}
        />

        <Label>Code</Label>
        <Pane marginTop={majorScale(1)}>
          <code>
            {code instanceof Error ? (
              <>
                <strong>Error:</strong> {code.message}
              </>
            ) : (
              <>
                {code} ({timeLeft}s)
              </>
            )}
          </code>
        </Pane>
      </Pane>
    </Card>
  );
}

const root = createRoot(document.getElementById("app")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
