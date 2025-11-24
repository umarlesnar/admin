import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import productItemModelSchema from "@/models/product-item-model-schema";
import {
  yupProductSchema,
  yupProductSortQuery,
} from "@/validation-schema/api/yup-product-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const { partner_id } = params;

    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Invalid partner ID",
          data: {},
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
    const query = await getServerSearchParams(req);

    let ProductQueryValidation: any = {};
    try {
      ProductQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: " ",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    let searchQuery: any = {};

    if (ProductQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${ProductQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            type: {
              $regex: `.*${ProductQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            plan_type: {
              $regex: `.*${ProductQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (ProductQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        ProductQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (ProductQueryValidation.sort != "") {
      const _lstry: any = ProductQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupProductSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      domain: partner.domain,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: ProductQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: ProductQueryValidation.page,
    };

    const totalCount = await productItemModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      ProductQueryValidation.page > 0
        ? (ProductQueryValidation.page - 1) * ProductQueryValidation.per_page
        : 0;
    let Products = await productItemModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = Products;
    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const { partner_id } = params;
    const body = await req.json();

    let ProductValidateBody: any = {};

    //step 1
    try {
      ProductValidateBody = yupProductSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Body Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
  
    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Invalid partner ID",
          data: {},
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    //step 2

 
      // const alreadyExist = await productItemModelSchema.findOne({
      //   name: ProductValidateBody?.name,
      //   domain: partner.domain,
      // });

      // if (alreadyExist) {
      //   return NextResponse.json(
      //     {
      //       status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
      //       message: "Validation Error",
      //       data: {
      //         name: "Product Already Exist",
      //       },
      //     },
      //     {
      //       status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
      //     }
      //   );
      // }
    try {
      if (ProductValidateBody.plan_type === "paug") {
        const existingPaug = await productItemModelSchema.findOne({
          domain: partner.domain,
          plan_type: "paug",
          status: "ENABLE", 
        });

        if (existingPaug) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
              message: "Validation Error",
              data: {
                plan_type:
                  "An active PAUG plan already exists for this domain.",
              },
            },
            { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
          );
        }
      }

      const price = ProductValidateBody.price || 0;
      const tax_percentage = ProductValidateBody.tax_percentage || 0;
      const tax = (price * tax_percentage) / 100;
      const total_price = price + tax;

      const newProduct = new productItemModelSchema({
        ...ProductValidateBody,
        domain: partner.domain,
        total_price,
        tax,
        status: "ENABLE",
      });

      await newProduct.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newProduct,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
