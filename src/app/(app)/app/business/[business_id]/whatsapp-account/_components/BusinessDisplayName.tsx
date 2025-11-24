import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDisplayNameUpdateMutation } from "@/framework/business/whatsapp/business-display-name";
import { Form, Formik } from "formik";
import { toast } from "sonner";

const BusinessDisplayName = () => {
  const { mutateAsync } = useDisplayNameUpdateMutation();

  return (
    <Formik
      initialValues={{ display_name: "" }}
      onSubmit={async (values) => {
        console.log("submitted values", values);
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            display_name: values?.display_name,
          });
          toast.success("Display Name Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);

          toast.error("Fail to update display name", {
            id: loadingToast,
          });
        }
      }}
    >
      {({ values, handleSubmit, handleChange }) => {
        return (
          <Form>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="display_name"
                  label="Business Display Name"
                  placeholder="Enter business display name"
                  onChange={handleChange}
                  value={values.display_name || ""}
                  className="w-full"
                  defaultValue={values.display_name}
                />
              </div>
              <div className="flex items-end pb-1 justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BusinessDisplayName;
