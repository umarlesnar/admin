import { FB_ALLOWED_FILE_FORMAT, SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mediaFile from "@/models/media-file";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "16mb", // Set desired value here
//     },
//   },
// };

type Data = {
  name?: string;
  message?: any;
  upload_url?: any;
  file_path?: any;
  status?: any;
  data?: any;
  public_url?: any;
  file_name?: any;
  media_id?: any;
};

const AWSconfig: any = {
  region: process.env.AWS_DEFAULT_REGION,
};

const client = new S3Client(AWSconfig);

const createPresignedUrlWithClient = async ({
  bucket,
  key,
  ContentType,
  size,
}: any) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: ContentType,
    ContentLength: size,
  });
  // await the signed URL and return it
  return await getSignedUrl(client, command, {
    expiresIn: 600,
    // signableHeaders: new Set(["content-type"]),
  });
};

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const { user } = req;
      const query = params;
      const body = await req.json();

      let validateMediaBody: any = {};
      try {
        validateMediaBody = body;
      } catch (error) {
        let ErrorFormObject = yupToFormErrorsServer(error);

        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: ErrorFormObject,
            message: "Body Validation Error",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      let { name, type, size, content_type, file_path_type } =
        validateMediaBody;

      if (!FB_ALLOWED_FILE_FORMAT.includes(content_type)) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "File format not supported!",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const file_info = new mediaFile({
        img_repo_id: "admin",
        type: type,
        content_type: content_type,
        size,
        status: "PENDING",
        // created_by: user.user_id,
      });

      await file_info.save();
      var ext = name.split(".").pop();
      let file_name = `${file_info._id}.${ext}`;
      let file_path;
      file_path = `${file_path_type}/${file_name}`;

      file_info.file_path = file_path;
      file_info.name = file_name;
      const success = await file_info.save();

      const url = await createPresignedUrlWithClient({
        bucket: process.env.S3_BUCKET_NAME,
        key: file_path,
        ContentType: type,
      });

      return NextResponse.json(
        {
          upload_url: url,
          file_path: "/" + file_path,
          public_url: process.env.STATIC_IMAGE_ENDPOINT + "/" + file_path,
          file_name: file_name,
          media_id: file_info._id,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: err },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });
export default router;
