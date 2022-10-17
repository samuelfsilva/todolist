import { Realm } from '@realm/react';
import { TaskSchema } from "./schemas/TaskSchema";

export const getRealm = async () => await Realm.open({
  path: "tasks--app",
  schema: [TaskSchema],
});