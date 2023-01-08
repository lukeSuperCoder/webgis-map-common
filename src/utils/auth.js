export const sessionSet = (key = "", val) => {
  return sessionStorage.setItem(key, val);
};
export const sessionGet = (key = "") => {
  return sessionStorage.getItem(key) || "";
};
export const sessionDel = (key = "") => {
  sessionStorage.removeItem(key);
};
export const sessionClear = () => {
  sessionStorage.clear();
};
