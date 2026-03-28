import { User } from "./types";
import { mockCurrentUser } from "./mockData";

const STORAGE_KEY = "mock_logged_in";

const authListeners = new Set<() => void>();

function notifyAuthListeners() {
  authListeners.forEach((fn) => fn());
}

/** For useSyncExternalStore — re-render when login/logout changes localStorage. */
export function subscribeAuth(onStoreChange: () => void) {
  authListeners.add(onStoreChange);
  return () => {
    authListeners.delete(onStoreChange);
  };
}

/** First client paint matches SSR; after queueMicrotask reads localStorage safely (hydration-safe). */
let clientReady = false;
const readyListeners = new Set<() => void>();

export function subscribeClientReady(onStoreChange: () => void) {
  readyListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    queueMicrotask(() => {
      if (!clientReady) {
        clientReady = true;
        readyListeners.forEach((fn) => fn());
      }
    });
  }
  return () => {
    readyListeners.delete(onStoreChange);
  };
}

export function getClientReadySnapshot(): boolean {
  return clientReady;
}

export function getServerReadySnapshot(): boolean {
  return false;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function login(_email: string, _password: string): { success: boolean; error?: string } {
  if (_email === "test@example.com" && _password === "password123") {
    localStorage.setItem(STORAGE_KEY, "true");
    notifyAuthListeners();
    return { success: true };
  }
  return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
}

export function signup(_email: string, _password: string): { success: boolean; error?: string } {
  if (_email === "test@example.com") {
    return { success: false, error: "이미 가입된 이메일입니다." };
  }
  if (!_password.trim()) {
    return { success: false, error: "비밀번호를 입력해주세요." };
  }
  localStorage.setItem(STORAGE_KEY, "true");
  notifyAuthListeners();
  return { success: true };
}

export function logout(): void {
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_KEY);
    notifyAuthListeners();
  }
}

export function getCurrentUser(): User | null {
  if (!isLoggedIn()) return null;
  return mockCurrentUser;
}
