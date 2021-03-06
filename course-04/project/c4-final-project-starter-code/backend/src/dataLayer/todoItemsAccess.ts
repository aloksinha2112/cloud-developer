import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoAccess')
export class TodoItemAceess
{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly ToDoTable = process.env.TODOS_TABLE,
        private readonly ToDoIndex = process.env.INDEX_NAME) {
      }
      
      async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all Todos')
    
        const result = await this.docClient.query({
            TableName: this.ToDoTable,
            IndexName: this.ToDoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
              },
            ScanIndexForward: false,
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }
    
      async createTodo(todo: TodoItem): Promise<TodoItem> {
          
        await this.docClient.put({
          TableName: this.ToDoTable,
          Item: todo
        }).promise()
    
        return todo
      }
      async deleteTodoForUser(todoId: string, userId: string): Promise<void> {
        const todo = await this.docClient.query({
            TableName: this.ToDoTable,
            IndexName: this.ToDoIndex,
            KeyConditionExpression: 'userId = :userId and todoId = :todoId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':todoId': todoId
              },
            ScanIndexForward: false,
            Limit : 1
          }).promise()
          const createdAt = todo.Items[0].createdAt
          logger.info('Deleting todo item %s for user %s', todoId, userId)
          await this.docClient.delete({
            TableName: this.ToDoTable,
            Key: {
              userId,
              createdAt
            },
            ConditionExpression: "todoId = :todoId",
            ExpressionAttributeValues:{
              ":todoId": todoId
            },
          }).promise()
      }
      async updateTodoForUser(todoId: string, userId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
        logger.debug('Getting createdAt for todo: %s for user %s', todoId, userId)
        const todos = await this.docClient.query({
          TableName: this.ToDoTable,
          IndexName: this.ToDoIndex,
          KeyConditionExpression: 'userId = :userId and todoId = :todoId',
          ExpressionAttributeValues: {
              ':userId': userId,
              ':todoId': todoId
            },
          ScanIndexForward: false,
          Limit : 1
        }).promise()
      
        const createdAt = todos.Items[0].createdAt
        logger.info('Updating todo: %s for user %s', todoId, userId)
        await this.docClient.update({
            TableName: this.ToDoTable,
            Key: {
              userId,
              createdAt
            },
            ConditionExpression: "todoId = :todoId",
            UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues:{
              ":name": updatedTodo.name,
              ":dueDate": updatedTodo.dueDate,
              ":done": updatedTodo.done,
              ":todoId": todoId
            },
            ExpressionAttributeNames: {
                "#name": "name"
            },
          ReturnValues:"UPDATED_NEW"
        }).promise()
      }
    }
    
    function createDynamoDBClient() {
        if (process.env.IS_OFFLINE) {
          console.log('Creating a local DynamoDB instance')
          return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
          })
        }
      
        return new XAWS.DynamoDB.DocumentClient()
      }
