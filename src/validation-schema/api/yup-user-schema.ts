import { profile } from "console";
import * as Yup from "yup";
const regexp = /[A-E]/gi;
const indiaPhoneNumberRegex = /^[6-9]\d{9}$/;
const uaePhoneNumberRegex = /^[5-9]\d{8}$/;

export const yupUserFormRegistrationValidation = Yup.object().shape({
  profile: Yup.object().shape({
    first_name: Yup.string()
      .required()
      .min(2, "Too Short!")
      .max(15, "Too Long!")
      .matches(/^[a-z-A-Z-0-9- _]*$/, "Invalid Format")
      .label("First Name"),

    last_name: Yup.string().max(15, "Too Long!").label("Last Name"),
  }),
  email: Yup.object()
    .shape({
      email_id: Yup.string()
        .email()
        .required("Email must be a valid email")
        .typeError("Email must be a valid email")
        .label("Email"),
    })
    .required(),
  phone: Yup.object().shape({
    dial_code: Yup.number().positive().required(),
    mobile_number: Yup.string()
      .required("Phone number is required")
      //@ts-ignore
      .when("dial_code", {
        is: 91,
        then: Yup.string().matches(
          indiaPhoneNumberRegex,
          "Invalid phone number"
        ),
      })
      //@ts-ignore
      .when("dial_code", {
        is: 971,
        then: Yup.string().matches(uaePhoneNumberRegex, "Invalid phone number"),
      })
      .label("Phone Number")
      .min(6)
      .max(15)
      .required()
      .label("Phone Number"),
  }),
  new_password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required()
    .label("Password"),
  confirm_password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    //@ts-ignore
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is a required")
    .label("confirm Password "),
  agree: Yup.boolean().oneOf([true]).required(),
});
export const yupUserAccountSchema = Yup.object().shape({
  profile: Yup.object().shape({
    first_name: Yup.string()
      .required()
      .min(2, "Too Short!")
      .max(15, "Too Long!")
      .matches(/^[a-z-A-Z-0-9- _]*$/, "Invalid Format")
      .label("First Name"),

    last_name: Yup.string().max(15, "Too Long!").label("Last Name"),
  }),
  // email: Yup.object()
  //   .shape({
  //     email_id: Yup.string()
  //       .email()
  //       .required("Email must be a valid email")
  //       .typeError("Email must be a valid email")
  //       .label("Email"),
  //   })
  //   .required(),
  // phone: Yup.object().shape({
  //   dial_code: Yup.number().positive().required(),
  //   mobile_number: Yup.string()
  //     .required("Phone number is required")
  //     //@ts-ignore
  //     .when("dial_code", {
  //       is: 91,
  //       then: Yup.string().matches(
  //         indiaPhoneNumberRegex,
  //         "Invalid phone number"
  //       ),
  //     })
  //     //@ts-ignore
  //     .when("dial_code", {
  //       is: 971,
  //       then: Yup.string().matches(uaePhoneNumberRegex, "Invalid phone number"),
  //     })
  //     .label("Phone Number")
  //     .min(6)
  //     .max(15)
  //     .required()
  //     .label("Phone Number"),
  // }),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
export const yupUserSchema = Yup.object().shape({
  profile: Yup.object().shape({
    first_name: Yup.string()
      .required()
      .label("First Name"),

    last_name: Yup.string(),
  }),
  email: Yup.array().of(
    Yup.object().shape({
      email_id: Yup.string()
        .email()
        .label("Email"),
    })
  ),
  phone: Yup.array().of(
    Yup.object().shape({
      dial_code: Yup.number(),
      mobile_number: Yup.string()
        .required("Phone number is required"),
    })
  ),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),

})
 export const yupUserSortSchema = Yup.object().shape({
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
 })

export const yupResetPasswordInviteSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Email must be a valid email")
    .typeError("Email must be a valid email")
    .label("Email"),
});
export const yupResetPasswordSchema = Yup.object().shape({
  email: Yup.object().shape({
    email_id: Yup.string()
      .email()
      .required("Email must be a valid email")
      .typeError("Email must be a valid email")
      .label("Email"),
  }),
});
