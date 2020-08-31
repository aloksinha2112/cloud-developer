import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { createTodoItem } from '../../businessLogic/todoItems'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.TODO_TABLE
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  //const authorization = event.headers.Authorization
  //const split = authorization.split(' ')
  //const jwtToken = split[1]

  //const newItem = await createTodoItem(newTodo, jwtToken)

  //return {
    //statusCode: 201,
   // headers: {
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Credentials': true
  //  },
  //  body: JSON.stringify({
  //    newItem
    // })


    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const userId = getUserId(event)
    const newItem = {
      userId,
      todoId,
      createdAt,
      done: false,
      ...newTodo
    }
    await docClient.put({
      TableName: ToDoTable,
      Item: newItem
    }).promise()
  
    delete newItem.userId
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }  
}
