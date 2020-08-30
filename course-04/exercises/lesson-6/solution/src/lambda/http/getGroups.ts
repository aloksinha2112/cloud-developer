import 'source-map-support/register'
import { getAllGroups } from '../../businessLogic/groups';
import * as cors from 'cors'
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const app = express()
app.use(cors())
app.get('/groups', async (_req, res) => {
  const groups = await getAllGroups()

  res.json({
    items: groups
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
