"use client";
import React, { createRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
  const recaptchaRef: any = createRef();
  const loginFormRef: any = createRef();

  const gCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY! || null;

  const onReCAPTCHAChange: any = async (captchaCode: string) => {
    if (!captchaCode) {
      return;
    }
    let formValues = loginFormRef.current.values;
    formValues.captchaCode = captchaCode;
    await onHandleLogin(formValues);
  };

  const onHandleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    const loadingToast = toast.loading("Loading...");
    try {
      const response = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        ...values,
      });

      if (response) {
        if (response.ok) {
          toast.success(`Login Successfully`, {
            id: loadingToast,
          });
          window.location.href = "/app/dashboard";
        } else {
          toast.error(`Incorrect Username And Password`, {
            id: loadingToast,
          });
        }
      }
    } catch (error) {
      toast.error(`Incorrect Username And Password`, {
        id: loadingToast,
      });
      console.log("ERROR", error);
    }

    loginFormRef?.current?.setSubmitting(false);
  };

  return (
    <Formik
      innerRef={loginFormRef}
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={(values) => {
        if (gCaptchaSiteKey) {
          recaptchaRef.current.execute();
        } else {
          onHandleLogin(values);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => {
        return (
          <Form>
            <div className="space-y-6">
              <Input
                label="Email"
                name="username"
                autoComplete="off"
                placeholder="you@example.com"
                onChange={handleChange}
                errorKey={errors.username}
                value={values.username}
              />
              <PasswordInput
                label="Password"
                name="password"
                autoComplete="off"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            {/* <div className="flex items-center justify-end my-2">
              <Link href="/reset/password">
                <Text size="xs" weight="semibold" color="primary">
                  {" "}
                  Forget Password ?
                </Text>
              </Link>
            </div> */}

            <div className="my-8">
              <Button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                className="w-full rounded-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Login
              </Button>
            </div>

            {gCaptchaSiteKey ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={onReCAPTCHAChange}
              />
            ) : null}

            <div className="w-full flex items-center justify-center gap-2">
              <Text size="sm">New to KWIC?</Text>
              <Link href="/register">
                <Text size="sm" weight="semibold" textColor="text-primary">
                  Signup
                </Text>
              </Link>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
