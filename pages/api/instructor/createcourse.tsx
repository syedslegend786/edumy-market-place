
import { NextApiRequest, NextApiResponse, NextConfig } from "next";
import nc from "next-connect";
import multer from 'multer'
import { CreateCourseDto } from "@/services/api";
import { S3 } from "@/lib/aws";
import { v4 as uuid } from 'uuid'
import { ManagedUpload } from "aws-sdk/clients/s3";
import { db } from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const handler = nc({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    .use(upload.single("imagePreview"))

    .post(async (req, res) => {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            return ErrorResponse({
                error: "kindly login",
                res,
                status: 400
            })
        }
        const { category, description, name, paid, price } = req.body as CreateCourseDto
        // @ts-ignore
        const imagePreview = req.file
        // image/png
        const imageType = imagePreview.mimetype as string
        let uploadedImage: string = "";
        await new Promise((resolve, reject) => {
            S3.upload({
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Body: imagePreview.buffer,
                Key: `${uuid().toString()}.${imageType.split("/")[1]}`,
                ContentType: imageType
            },
                (err: Error, data: ManagedUpload.SendData) => {
                    if (err) {
                        reject(err)
                    }
                    if (data) {
                        uploadedImage = data.Location
                        resolve(data)
                    }
                }
            )
        })
        if (!uploadedImage) {
            return ErrorResponse({
                error: "Image not uploaded successfully.",
                res,
                status: 400
            })
        }
        await db.course.create({
            data: {
                category,
                description,
                imagePreview: uploadedImage,
                name,
                // @ts-ignore
                paid: paid === "true" ? true : false,
                price: Number(price),
                userId: session.user.id
            }
        })
        return SuccessResponse({
            res,
            data: {},
            msg: "okay"
        })
    })

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
}