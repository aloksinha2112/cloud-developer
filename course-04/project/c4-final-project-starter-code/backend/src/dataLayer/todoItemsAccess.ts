import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoItemAceess
{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE ){
    }
    async getAllTodoItems(): Promise<TodoItem[]> {
        console.log('Getting all todoItems')

        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }  

    async deleteTodoItem(todoId: string) {
       const resrponse =  await this.docClient.delete({
            TableName: this.todosTable,
            Key: {todoId}
        }).promise()

        return resrponse
    }

    async updateTodoItem(todoId: string, name: string, duedate: string , done: boolean){
        const resrponse =  await this.docClient.update({
            TableName: this.todosTable,
            Key: {todoId},
            UpdateExpression: 'set name = :n, duedate = :dd, done = :d',
            ExpressionAttributeValues: {
                ':n' : name,
                ':dd' : duedate,
                ':d' : done
            }

        }).promise()

        return resrponse
    }
}

function createDynamoDBClient(){     
    return new XAWS.DynamoDB.DocumentClient()
}

