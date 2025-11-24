"use client";
import React, { ReactNode, useReducer, useRef } from "react";
import { State, applicationReducer, initialState } from "./application.reducer";

interface ApplicationProviderState extends State {
  setPermissions: (query: any) => void;
  setApp: (query: any) => void;
  setUserParams: (query: any) => void;
  setHeaderVisible: (query: any) => void;
  playNewNotification: () => void;
  playCurrentChatNotification: () => void;
}

export const ApplicationContext = React.createContext<
  ApplicationProviderState | undefined
>(undefined);
ApplicationContext.displayName = "ApplicationContext";

export const useApplication = () => {
  const context = React.useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(`useApplication must be used within a ApplicationProvider`);
  }
  return context;
};

interface BaseLayoutProps {
  children?: ReactNode;
}

export const ApplicationProvider: React.FC<BaseLayoutProps> = (props) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const audioPlayer: any = useRef(null);
  const audioPlayer_2: any = useRef(null);

  const setPermissions = (query: any) => {
    dispatch({
      type: "SET_USER_PERMISSION",
      payload: query,
    });
  };

  const setApp = (query: any) => {
    dispatch({
      type: "SET_APP",
      payload: query,
    });
  };

  const setUserParams = (query: any) => {
    dispatch({
      type: "SET_USER_PARAMS",
      payload: query,
    });
  };
  const setHeaderVisible = (query: any) => {
    dispatch({
      type: "SET_HEADER_VISIBLE",
      payload: query,
    });
  };

  const playNewNotification = () => {
    if (audioPlayer) {
      audioPlayer.current?.play();
    }
  };

  const playCurrentChatNotification = () => {
    if (audioPlayer_2) {
      audioPlayer_2.current?.play();
    }
  };

  const value = React.useMemo(
    () => ({
      ...state,
      setPermissions,
      setApp,
      setUserParams,
      setHeaderVisible,
      playNewNotification,
      playCurrentChatNotification,
    }),
    [state]
  );

  return (
    <>
      <audio
        ref={audioPlayer}
        src={"/assets/notification/notification_sound-1.mp3"}
      />
      <audio
        ref={audioPlayer_2}
        src={"/assets/notification/current-chat-notification.mp3"}
      />
      <ApplicationContext.Provider value={value} {...props} />
    </>
  );
};
