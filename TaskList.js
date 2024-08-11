// src/TaskList.js
import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ task: '', priority: 'baixa', due_date: '', status: 'pendente' });

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Erro ao carregar tarefas:', error));
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewTask({ task: '', priority: 'baixa', due_date: '', status: 'pendente' });
      } else {
        console.error('Erro ao adicionar tarefa:', await response.json());
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  const handleChangeStatus = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      const updatedStatus = taskToUpdate.status === 'pendente' ? 'concluída' : 'pendente';

      try {
        const response = await fetch(`http://localhost:5000/todos/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: updatedStatus }),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? updatedTask : task))
          );
        } else {
          console.error('Erro ao mudar o status da tarefa:', await response.json());
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        console.error('Erro ao excluir tarefa:', await response.json());
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Tarefas</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
          required
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          required
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task} - {task.priority} - {task.due_date} - {task.status}
            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            <button className="update-status-button" onClick={() => handleChangeStatus(task.id)}>
              Mudar Status para {task.status === 'pendente' ? 'Concluída' : 'Pendente'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
