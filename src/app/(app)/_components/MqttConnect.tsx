"use client";
import { useApplication } from "@/contexts/application/application.context";
import { Connector } from "mqtt-react-hooks";
import { useEffect, useState } from "react";

export const MqttConnect = ({ children }: any) => {
  const { config } = useApplication();
  const [socketUrl, setSocketUrl] = useState(null);

  useEffect(() => {
    if (config?.socket_url) {
      setSocketUrl(config.socket_url);
    }
  }, [config?.socket_url]);

  if (!socketUrl) {
    return <>{children}</>;
  }

  return (
    <Connector
      brokerUrl={socketUrl}
      options={{
        path: "/mqtt",
      }}
    >
      {children}
    </Connector>
  );
};
