export const TaskSchema = {
  name: "Task",
  properties: {
    _id: "string",
    name: "string",
    status: "string?",
  },
  primaryKey: "_id",
}