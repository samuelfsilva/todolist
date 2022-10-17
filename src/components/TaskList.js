import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";

import Task from "./Task";

const TaskList = (props) => {
  const { items, deleteTask } = props;
  
  return (
    <View style={styles.tasksWrapper}>
      {
        <FlatList
          data={items}
          renderItem={
            ({ item: task }) => 
              <Task 
                key={task._id} 
                conteudo={task} 
                deleteTask={event => deleteTask(event)}
              />
          }
          keyExtractor={task => task._id}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  tasksWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default TaskList;