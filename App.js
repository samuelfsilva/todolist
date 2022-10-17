import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';

import InputTask from './src/components/InputTask';
import TaskList from './src/components/TaskList';

import { getRealm } from './src/databases/realm';
import uuid from 'react-native-uuid';

export default function App() {
  const [ refresh, setRefresh ] = useState(true);
  const [ tasks, setTasks ] = useState([]);

  const fetchTasks = async() => {
    if (!refresh) return;

    const realm = await getRealm();
    
    try {
      const response = realm.objects("Task").toJSON();
      setTasks(response);
    } finally {
      setRefresh(false);
    }
  }

  const handleAddTask = (taskName) => {
    if (!taskName) return;

    addTask(taskName);
    activeRefresh();
  }

  const addTask = async (name) => {
    const realm = await getRealm();

    try {
      realm.write(() => {
        realm.create("Task", {
          _id: uuid.v4().toString(),
          name: name,
          status: 'open',
        });
        
        activeRefresh();
        
        //Alert.alert("Concluído", "Tarefa salva com sucesso.");
      });
    } catch(e) {
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    }
  }

  const deleteTask = async(id) => {
    const realm = await getRealm();
    try {
      realm.write(() => {
        realm.delete(realm.objectForPrimaryKey("Task", id));
      });

      activeRefresh();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const activeRefresh = () => {
    setRefresh(true);
  }

  const desactiveRefresh = () => {
    setRefresh(false);
  }

  return (
    <View style={styles.containerApp}>
      <View style={styles.sectionTitle}>
        <Text style={styles.titleText}>Tarefas do dia</Text>
      </View>
      <View style={styles.content}>
        { !tasks.length ?
          <View style={styles.noTasks}>
            <Text style={styles.noTasksText}>Nenhuma tarefa definida.</Text>
          </View> :
          <TaskList items={tasks} 
            desactiveRefresh={event => desactiveRefresh()}
            deleteTask={event => deleteTask(event)}
          />
        }
      </View>
      <InputTask handleAddTask={event => handleAddTask(event)}/>      
    </View>
  );
}

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
    backgroundColor: '#E8EAED',
    flexDirection: 'column',
  },
  sectionTitle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
    marginVertical: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
  },
  content: {
    flex: 8,
  },
  noTasks: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTasksText: {
    color: '#34495e',
  },
});
