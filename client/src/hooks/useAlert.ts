import { create } from "zustand";

/**
 * Default duration for alerts.
 */
const DURATION = 4500;

export type Alert = {
  /**
   * The message to display in the alert.
   */
  message: string;
  /**
   * The type of alert.
   */
  type: "success" | "error" | "info" | "warning" | "static";
};

export type AlertStore = {
  /**
   * The current alert.
   */
  alert?: Alert;
  /**
   * Set the current alert.
   *
   * @param alert the new alert
   * @param duration the duration to display the alert in ms
   */
  setAlert: (alert: Alert, duration?: number) => void;
  /**
   * The timeout for the current alert.
   */
  timeout?: NodeJS.Timeout;
};

/**
 * A hook for displaying alerts.
 */
const useAlert = create<AlertStore>((set) => ({
  alert: undefined,
  timeout: undefined,
  setAlert: (alert: Alert, duration = DURATION) =>
    set((state) => {
      if (state.timeout) clearTimeout(state.timeout);
      const timeout = setTimeout(() => set({ alert: undefined }), duration);
      return { alert, timeout };
    }),
}));

export default useAlert;
