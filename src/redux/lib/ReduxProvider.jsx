"use client";
import { persistor, store } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

export default function ReduxProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex-center h-[75vh]">
            <section className="loader">
              <div className="slider" style={{ "--i": 0 }}></div>
              <div className="slider" style={{ "--i": 1 }}></div>
              <div className="slider" style={{ "--i": 2 }}></div>
              <div className="slider" style={{ "--i": 3 }}></div>
              <div className="slider" style={{ "--i": 4 }}></div>
            </section>
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
