import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from "aws-lambda";
import { TodoItem } from '../models/TodoItem'
import { TodoItemAceess } from '../dataLayer/todoItemsAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getUserId } from "../lambda/utils";

const todoItemAccess = new TodoItemAceess()

export async function createTodo(
  newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const createdAt = new Date().toISOString()
  const imagesBucket = process.env.TODOS_S3_BUCKET
  const attachmentUrl = `https://${imagesBucket}.s3.amazonaws.com/${todoId}`
  return await todoItemAccess.createTodo({
      userId,
      todoId,
      createdAt,
      done: false,
      attachmentUrl: attachmentUrl,
      ...newTodo
  })
}

export async function updateTodo(
  todoId: string,
  updatedTodo: UpdateTodoRequest, event: APIGatewayProxyEvent): Promise<void> {
  const userId = getUserId(event)
  return await todoItemAccess.updateTodoForUser(todoId, userId, updatedTodo)
}

export async function deleteTodo(
  todoId: string,
  event: APIGatewayProxyEvent
): Promise<void> {
  const userId = getUserId(event)
  return await todoItemAccess.deleteTodoForUser(todoId, userId)
}

export async function getAllTodos(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  const userId = getUserId(event)
  const allTodos = todoItemAccess.getAllTodosForUser(userId)
  return allTodos
}