import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.TODOS_TABLE
const ToDoIndex = process.env.INDEX_NAME
//import { getAllTodoItems } from '../../businessLogic/todoItems'
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  //console.log('Processing event: ', event)
 // const todos = getAllTodoItems
  //return {
  //  statusCode: 200,
  //  headers: {
  //    'Access-Control-Allow-Origin': '*',
   //   'Access-Control-Allow-Credentials': true
   // },
  //  body: JSON.stringify({
   //   todos
   // })
 // }
 console.log('Processing event: ', event)
 const userId = getUserId(event)
 const result = await docClient.query({
     TableName: ToDoTable,
     IndexName: ToDoIndex,
     KeyConditionExpression: 'userId = :userId',
     ExpressionAttributeValues: {
         ':userId': userId
       },
     ScanIndexForward: false,
   }).promise()

 const items = result.Items
 items.forEach((item) => {
     delete item.userId
 })

 return {
 statusCode: 200,
 headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true
 },
 body: JSON.stringify({
     items
 })
 }
}
