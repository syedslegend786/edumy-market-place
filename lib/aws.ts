import AWS from 'aws-sdk'

AWS.config.update({
    apiVersion: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
})


export const S3 = new AWS.S3()
