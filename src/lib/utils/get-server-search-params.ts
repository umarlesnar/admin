import { AppNextApiRequest } from "@/types/interface";

export const getServerSearchParams = async (req: AppNextApiRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    let query: any = {};

    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    return query;
  } catch (error) {
    return {};
  }
};
