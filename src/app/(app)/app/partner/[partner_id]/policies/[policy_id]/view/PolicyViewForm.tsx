"use client";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import { usePolicyByIdQuery } from "@/framework/iam/policies/get-policy-by-id";
import { useParams } from "next/navigation";
import ViewPolicyForm from "./ViewPolicyForm";

const TYPE = [{ name: "MANAGED" }, { name: "CUSTOM" }];

const PolicyViewSheet = () => {
  const { policy_id }: any = useParams();
  const { data, isLoading } = usePolicyByIdQuery(policy_id);

  return (
    <Formik
      initialValues={{
        name: data?.policy?.name || "",
        description: data?.policy?.description || "",
        type: data?.policy?.type || "",
        status: data?.policy?.status || "ACTIVE",
        limits: Array.isArray(data?.policy?.limits)
          ? data.policy.limits
          : Object.entries(data?.policy?.limits || {}).map(([key, value]) => ({
              key,
              value,
            })),
      }}
      onSubmit={async (values, { setErrors }) => {
      }}
      enableReinitialize
    >
      {({ values, errors, handleChange, setFieldValue }) => (
        <Form className="flex flex-1 flex-col justify-between h-full bg-scroll overflow-auto px-1">
           <div>
              <Text size="xl" weight="semibold">Policy</Text>
            </div>
          <div className="w-full h-full flex-1 flex flex-col space-y-4 bg-white py-4 rounded-md">
           

            <div className="w-full space-y-1">
              {isLoading ? (
                <div className="h-[48px] w-full bg-neutral-40 rounded-md animate-pulse"></div>
              ) : (
                <Input
                  name="name"
                  label="Name"
                  placeholder="Enter a Policy"
                  onChange={handleChange}
                  value={values?.name}
                  errorKey={errors?.name}
                />
              )}
            </div>

            <div className="w-full space-y-1">
              {isLoading ? (
                <div className="h-[48px] w-full bg-neutral-40 rounded-md animate-pulse"></div>
              ) : (
                <Input
                  name="description"
                  label="Description"
                  placeholder="Enter a description"
                  onChange={handleChange}
                  value={values?.description}
                  errorKey={errors?.description}
                />
              )}
            </div>

              {isLoading ? (
                <div className="h-[48px] w-full bg-neutral-40 rounded-md animate-pulse"></div>
              ) : (
                <div className="w-full space-y-1">
                <Text size="sm" tag="label" weight="medium">
                    Type
                  </Text>
                <Combobox
                  options={TYPE}
                  buttonClassname="w-full"
                  dropdownClassname="p-2"
                  placeholder="Select Type"
                  selectedOption={TYPE.find((o) => o.name === values.type)}
                  onSelectData={(type: any) => setFieldValue("type", type.name)}
                />
                 </div>
              )}
              
              {isLoading ? (
                <div className="h-[48px] w-full bg-neutral-40 rounded-md animate-pulse"></div>
              ) : (
                <ViewPolicyForm />
              )}
          
            {isLoading ? (
              <div className="h-[40px] w-full bg-neutral-40 rounded-md animate-pulse"></div>
            ) : (
              <div>
              <Text size="sm" weight="semibold" color="primary">
              Status
            </Text>
           
              <RadioGroup
                className="flex mt-2"
                value={values.status}
                onValueChange={(value) => setFieldValue("status", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="ACTIVE" value="ACTIVE" />
                  <label className="text-sm">Active</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="DISABLED" value="DISABLED" />
                  <label className="text-sm">Disabled</label>
                </div>
              </RadioGroup>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PolicyViewSheet;
