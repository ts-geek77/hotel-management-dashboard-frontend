export const PROFILE_TABS = {
  GENERAL: "general",
  SECURITY: "security",
} as const;

export type ProfileTab = typeof PROFILE_TABS[keyof typeof PROFILE_TABS];

export const INITIAL_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const INITIAL_SHOW_PASSWORDS = {
  old: false,
  new: false,
  confirm: false,
};
