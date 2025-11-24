"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { getBrandSetting } from "@/lib/utils/partner/get-brand-setting";
import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";
import { UploadIcon } from "@/components/ui/icons/UploadIcon";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";

const BrandSettingsForm = () => {
  const { partner_id } = useParams();
  const logoWithNameRef = useRef<HTMLInputElement | null>(null);
  const logoWithName2Ref = useRef<HTMLInputElement | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    contact_email: "",
    logo_with_name: "",
    logo_with_name2:"",
    logo: "",
    dark: "",
    light: "",
    primary: "",
    primary_50: "",
    primary_100: "",
    primary_200: "",
    primary_300: "",
    primary_400: "",
    primary_500: "",
    primary_600: "",
    primary_700: "",
    primary_800: "",
    primary_900: "",
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync: updatePartner } = usePartnerMutation();
  const { mutateAsync: uploadMedia } = useMediaUploadMutation();
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoWithNamePreview, setLogoWithNamePreview] = useState<string>("");
  const [logoWithName2Preview, setLogoWithName2Preview] = useState<string>("");

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "logo" | "logo_with_name" | "logo_with_name2",
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const loadingToast = toast.loading("Uploading image...");

    try {
      const uploadResponse = await uploadMedia({
        payload: file,
        file_path_type: "partner/assets",
      });

      if (!uploadResponse?.public_url || !uploadResponse?.file_path) {
        throw new Error("Invalid upload response");
      }

      // Save only file_path in Formik
      setFieldValue(fieldName, uploadResponse.file_path);

      // Save public_url separately for preview
      if (fieldName === "logo") {
        setLogoPreview(uploadResponse.public_url);
      } else if (fieldName === "logo_with_name") {
        setLogoWithNamePreview(uploadResponse.public_url);
      }else if (fieldName === "logo_with_name2") {
        setLogoWithName2Preview(uploadResponse.public_url);
      }

      toast.success("Image uploaded successfully", { id: loadingToast });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Upload failed",
        { id: loadingToast }
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const loadingToast = toast.loading("Updating brand settings...");

    try {
      const existingSetting = await getPartnerSettingValue(
        partner_id as string,
        "brand"
      );

      const getFilePathFromUrl = (url: string) => {
        return url.replace(/^https?:\/\/[^/]+/, "");
      };

      const updatedValues = {
        ...values,
        logo: getFilePathFromUrl(values.logo),
        logo_with_name: getFilePathFromUrl(values.logo_with_name),
        logo_with_name2: getFilePathFromUrl(values.logo_with_name2),
      };

      const payload = {
        partner_id,
        settings_key: "brand",
        method: existingSetting ? "PUT" : "POST",
        payload: {
          setting_key: "brand",
          setting_value: updatedValues,
          value_type: "object",
          setting_category: "SYSTEM",
          is_private: true,
          is_core_setting: true,
          domain: data?.domain,
          partner_id,
        },
      };

      await updatePartner(
        //@ts-ignore
        payload
      );
      toast.success("Brand Settings Updated", { id: loadingToast });
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update brand settings", { id: loadingToast });
    }
  };

  useEffect(() => {
    (async () => {
      const brandSettings = await getBrandSetting(partner_id as string);
      if (brandSettings) {
        setInitialValues({
          name: brandSettings?.name ?? "",
          contact_email: brandSettings?.contact_email ?? "",
          logo: brandSettings?.logo ?? "",
          logo_with_name: brandSettings?.logo_with_name ?? "",
          logo_with_name2: brandSettings?.logo_with_name2 ?? "",
          dark: brandSettings?.dark ?? "",
          light: brandSettings?.light ?? "",
          primary: brandSettings?.primary ?? "",
          primary_50: brandSettings?.primary_50 ?? "",
          primary_100: brandSettings?.primary_100 ?? "",
          primary_200: brandSettings?.primary_200 ?? "",
          primary_300: brandSettings?.primary_300 ?? "",
          primary_400: brandSettings?.primary_400 ?? "",
          primary_500: brandSettings?.primary_500 ?? "",
          primary_600: brandSettings?.primary_600 ?? "",
          primary_700: brandSettings?.primary_700 ?? "",
          primary_800: brandSettings?.primary_800 ?? "",
          primary_900: brandSettings?.primary_900 ?? "",
        });
      }
      setLogoPreview(brandSettings?.logo ?? "");
      setLogoWithNamePreview(brandSettings?.logo_with_name ?? "");
      setLogoWithName2Preview(brandSettings?.logo_with_name2 ?? "");
    })();
  }, [partner_id]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form
            className="space-y-4 px-2 h-[78vh] overflow-y-scroll"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center mt-1 w-full">
              <Text weight="semibold" size="sm" className="w-[220px]">
                Name
              </Text>
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Enter name"
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  value={values.name}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex items-center mt-1 w-full">
              <Text weight="semibold" size="sm" className="w-[220px]">
                Contact Email
              </Text>
              <div className="w-full">
                <Input
                  name="contact_email"
                  placeholder="Enter Contact Email"
                  onChange={(e) =>
                    setFieldValue("contact_email", e.target.value)
                  }
                  value={values.contact_email}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex w-full justify-between gap-4 items-center ">
              <div className="flex items-center w-full">
                <Text weight="semibold" size="sm" className="w-[180px]">
                  Logo
                </Text>
                <input
                  type="file"
                  ref={logoRef}
                  onChange={(e) => handleImageUpload(e, "logo", setFieldValue)}
                  style={{ display: "none" }}
                  accept="image/png,image/jpeg,image/webp"
                />
                <div className="space-y-3">
                  {logoPreview ? (
                    <div className="relative ">
                      <img
                        src={logoPreview}
                        alt="logo"
                        loading="eager"
                        className=" object-contain w-16 h-16"
                      />
                      <div
                        className="absolute -top-2 -right-4 p-1.5 bg-white rounded-full shadow cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFieldValue("logo", "");
                          setLogoPreview("");
                        }}
                      >
                        <CloseIcon className="w-3 h-3 text-red-500" />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="h-full"
                      leftIcon={<UploadIcon className="w-4 h-4 mr-[6px]" />}
                      onClick={() => logoRef.current?.click()}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center w-full">
                <Text weight="semibold" size="sm" className="w-[180px]">
                  Logo With Name
                </Text>
                <input
                  type="file"
                  ref={logoWithNameRef}
                  onChange={(e) =>
                    handleImageUpload(e, "logo_with_name", setFieldValue)
                  }
                  style={{ display: "none" }}
                  accept="image/png,image/jpeg,image/webp"
                />
                <div className="space-y-3">
                  {logoWithNamePreview ? (
                    <div className="relative w-28 h-28">
                      <img
                        src={logoWithNamePreview}
                        alt="logo-with-name"
                        loading="eager"
                        className=" object-contain w-28 h-28"
                      />
                      <div
                        className="absolute top-2 -right-4 p-1.5 bg-white rounded-full shadow cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFieldValue("logo_with_name", "");
                          setLogoWithNamePreview("");
                        }}
                      >
                        <CloseIcon className="w-3 h-3 text-red-500" />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="h-full"
                      leftIcon={<UploadIcon className="w-4 h-4 mr-[6px]" />}
                      onClick={() => logoWithNameRef.current?.click()}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center w-full">
                <Text weight="semibold" size="sm" className="w-[180px]">
                  Logo With Name Black
                </Text>
                <input
                  type="file"
                  ref={logoWithName2Ref}
                  onChange={(e) =>
                    handleImageUpload(e, "logo_with_name2", setFieldValue)
                  }
                  style={{ display: "none" }}
                  accept="image/png,image/jpeg,image/webp"
                />
                <div className="space-y-3">
                  {logoWithName2Preview ? (
                    <div className="relative w-28 h-28">
                      <img
                        src={logoWithName2Preview}
                        alt="logo-with-name-black"
                        loading="eager"
                        className=" object-contain w-28 h-28"
                      />
                      <div
                        className="absolute top-2 -right-4 p-1.5 bg-white rounded-full shadow cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFieldValue("logo_with_name2", "");
                          setLogoWithName2Preview("");
                        }}
                      >
                        <CloseIcon className="w-3 h-3 text-red-500" />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="h-full"
                      leftIcon={<UploadIcon className="w-4 h-4 mr-[6px]" />}
                      onClick={() => logoWithName2Ref.current?.click()}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-1 w-full">
              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Dark Mode
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="dark"
                    placeholder="#000000"
                    onChange={(e) => setFieldValue("dark", e.target.value)}
                    value={values.dark}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="dark"
                    onChange={(e) => setFieldValue("dark", e.target.value)}
                    value={values.dark}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Light Mode
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="light"
                    placeholder="#000000"
                    onChange={(e) => setFieldValue("light", e.target.value)}
                    value={values.light}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="light"
                    onChange={(e) => setFieldValue("light", e.target.value)}
                    value={values.light}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary"
                    placeholder="#000000"
                    onChange={(e) => setFieldValue("primary", e.target.value)}
                    value={values.primary}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary"
                    onChange={(e) => setFieldValue("primary", e.target.value)}
                    value={values.primary}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 50
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_50"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_50", e.target.value)
                    }
                    value={values.primary_50}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_50"
                    onChange={(e) =>
                      setFieldValue("primary_50", e.target.value)
                    }
                    value={values.primary_50}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 100
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_100"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_100", e.target.value)
                    }
                    value={values.primary_100}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_100"
                    onChange={(e) =>
                      setFieldValue("primary_100", e.target.value)
                    }
                    value={values.primary_100}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 200
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_200"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_200", e.target.value)
                    }
                    value={values.primary_200}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_200"
                    onChange={(e) =>
                      setFieldValue("primary_200", e.target.value)
                    }
                    value={values.primary_200}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 300
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_300"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_300", e.target.value)
                    }
                    value={values.primary_300}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_300"
                    onChange={(e) =>
                      setFieldValue("primary_300", e.target.value)
                    }
                    value={values.primary_300}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 400
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_400"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_400", e.target.value)
                    }
                    value={values.primary_400}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_400"
                    onChange={(e) =>
                      setFieldValue("primary_400", e.target.value)
                    }
                    value={values.primary_400}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 500
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_500"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_500", e.target.value)
                    }
                    value={values.primary_500}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_500"
                    onChange={(e) =>
                      setFieldValue("primary_500", e.target.value)
                    }
                    value={values.primary_500}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 600
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_600"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_600", e.target.value)
                    }
                    value={values.primary_600}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_600"
                    onChange={(e) =>
                      setFieldValue("primary_600", e.target.value)
                    }
                    value={values.primary_600}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 700
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_700"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_700", e.target.value)
                    }
                    value={values.primary_700}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_700"
                    onChange={(e) =>
                      setFieldValue("primary_700", e.target.value)
                    }
                    value={values.primary_700}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 800
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_800"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_800", e.target.value)
                    }
                    value={values.primary_800}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_800"
                    onChange={(e) =>
                      setFieldValue("primary_800", e.target.value)
                    }
                    value={values.primary_800}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="sm" className="w-[220px]">
                  Primary 900
                </Text>
                <div className="w-full flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_900"
                    placeholder="#000000"
                    onChange={(e) =>
                      setFieldValue("primary_900", e.target.value)
                    }
                    value={values.primary_900}
                    className="w-full"
                  />
                  <Input
                    type="color"
                    name="primary_900"
                    onChange={(e) =>
                      setFieldValue("primary_900", e.target.value)
                    }
                    value={values.primary_900}
                    className="w-12 h-10 cursor-pointer border-none p-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex bg-white sticky bottom-0 justify-end pb-1 pr-2">
              <Button type="submit" size="default" className="px-6 py-5">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BrandSettingsForm;
