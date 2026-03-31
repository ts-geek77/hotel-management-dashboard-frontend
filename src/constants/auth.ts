import * as Yup from "yup";

export const LOGIN_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const REGISTER_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export const FORGOT_PASSWORD_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords don't match")
    .required("Confirm your password"),
});

export const INITIAL_LOGIN_VALUES = {
  email: "",
  password: "",
};

export const INITIAL_REGISTER_VALUES = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export const INITIAL_FORGOT_PASSWORD_VALUES = {
  email: "",
  newPassword: "",
  confirmPassword: "",
};
