import { Combobox } from "@/components/ui/combobox";
import { Listbox } from "@/components/ui/listbox";
import Text from "@/components/ui/text";
// import { useWhatsappPaymentConfigQuery } from "@/framework/whatsapp/get-payment-configurations";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

type Props = {};

const productType = [
  {
    name: "Physical Goods",
    value: "physical-goods",
  },
  {
    name: "Digital Goods",
    value: "digital-goods",
  },
];

const OrderDetailsConfig = (props: Props) => {
  const { values, setFieldValue }: any = useFormikContext();
  const [options, setOptions] = useState([]);
  // const { data, isLoading } = useWhatsappPaymentConfigQuery();

  // useEffect(() => {
  //   if (data?.length > 0 && data[0]?.payment_configurations) {
  //     const config = data[0]?.payment_configurations?.map((item: any) => {
  //       return {
  //         name: item?.configuration_name,
  //         ...item,
  //       };
  //     });

  //     setOptions(config);
  //   }
  // }, [data]);
  return (
    <div className="w-full flex items-center gap-2">
      <div className="space-y-2 w-full">
        <Text size="sm" weight="medium">
          Payment Config
        </Text>
        <Combobox
          options={options || []}
          buttonClassname={`w-full`}
          selectedOption={options?.find((o: any) => {
            return (
              o.configuration_name ==
              values?.payment_settings?.configuration_name
            );
          })}
          placeholder={"Select account"}
          onSelectData={(selected: any) => {
            setFieldValue(`payment_settings`, selected);
          }}
        />
      </div>
      <div className="space-y-2 w-full">
        <Text size="sm" weight="medium">
          Product Type
        </Text>

        <Listbox
          options={productType || []}
          buttonClassname={`w-full `}
          dropdownClassname={`z-50 overflow-hidden`}
          selectedOption={productType?.find((o: any) => {
            return o.value == values?.product_type;
          })}
          onSelectData={(selected: any) => {
            setFieldValue(`product_type`, selected?.value);
          }}
        />
      </div>
    </div>
  );
};

export default OrderDetailsConfig;
