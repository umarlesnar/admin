import businessAccountModelSchema from "@/models/business-account-model-schema";

export const generateImgRepoId = async () => {
  const randomPart = [...Array(5)]
    .map(() => Math.random().toString(36).charAt(2))
    .join("");

  const businessAccountExist = await businessAccountModelSchema.findOne({
    img_repo_id: randomPart.toLowerCase(),
  });

  if (businessAccountExist) {
    generateImgRepoId();
  }

  return randomPart.toLowerCase();
};
