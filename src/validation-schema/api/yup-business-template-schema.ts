import * as Yup from "yup";

export const yupBisnessTemplateSchema = Yup.object().shape({
   category: Yup.string().required(),
   status:Yup.string().required(),
  });


