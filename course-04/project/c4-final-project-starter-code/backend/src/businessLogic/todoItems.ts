import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoItemAceess } from '../dataLayer/todoItemsAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoItemAccess = new TodoItemAceess()

export async function getAllTodoItems(): Promise<TodoItem[]> {
  return todoItemAccess.getAllTodoItems()
}

export async function deleteToDoItem(todoId: string)
{
    return todoItemAccess.deleteTodoItem(todoId)
}
export async function updateToDoItem(todoId: string, updateTodoRequest: UpdateTodoRequest)
{
    return todoItemAccess.updateTodoItem(todoId, updateTodoRequest.name, updateTodoRequest.dueDate, updateTodoRequest.done)
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoItemAccess.createTodoItem({
    userId: userId,
    todoId:todoId,
    createdAt: new Date().toISOString(),    
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: true
  })
}