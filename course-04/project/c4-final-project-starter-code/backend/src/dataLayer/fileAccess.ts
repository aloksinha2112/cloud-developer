import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('getTodos')
const imagesBucket = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export class FileAccess {
    constructor(
        private readonly s3Client = createS3Client()) {
    }
    getAttachmentUploadUrl(todoId: string) {
        logger.debug('Creating a pre-signed url for todo %s', todoId)
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: imagesBucket,
            Key: todoId,
            Expires: urlExpiration
        })
    }
}

function createS3Client(){    
    return new AWS.S3({
        'signatureVersion': 'v4'
    })
}