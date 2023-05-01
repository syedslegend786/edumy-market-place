import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import formidable from 'express-formidable'
import { S3 } from "@/lib/aws";
import { v4 as uuid } from 'uuid'
import { readFileSync } from 'fs'
import { ManagedUpload } from "aws-sdk/clients/s3";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { db } from "@/lib/db";
import { Lesson } from "@prisma/client";
const handler = nc({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    .use(formidable())
    .post(async (req, res) => {
        // @ts-ignore
        const { description, name, courseId } = req.fields as Pick<Lesson, "name" | "description" | "courseId">
        // @ts-ignore
        const { video, } = req.files

        const data: null | ManagedUpload.SendData = await new Promise((resolve, reject) => {
            S3.upload({
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: `${uuid().toString()}.${video.type.split("/")[1]}`,
                Body: readFileSync(video.path),
                ACL: "public-read",
                ContentType: video.type
            }, (err: Error, data: ManagedUpload.SendData) => {
                if (err) {
                    resolve(null)
                }
                if (data) {
                    resolve(data)
                }
            })
        })
        if (!data) {
            return ErrorResponse({
                error: "Failed to upload",
                res,
                status: 400
            })
        }
        await db.lesson.create({
            data: {
                description,
                name,
                video: data.Location,
                courseId,
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