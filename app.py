# src/app.py
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)

# Habilitando CORS
CORS(app)

# Verifica se o arquivo todos.json existe, senão cria um vazio
if not os.path.exists('todos.json'):
    with open('todos.json', 'w') as file:
        json.dump([], file)

# Função para ler as tarefas do arquivo todos.json
def read_todos():
    try:
        with open('todos.json', 'r') as file:
            todos = json.load(file)
        return todos
    except json.JSONDecodeError:
        return []
    except FileNotFoundError:
        return []

# Função para escrever as tarefas no arquivo todos.json
def write_todos(todos):
    try:
        with open('todos.json', 'w') as file:
            json.dump(todos, file)
    except IOError as e:
        print("Erro ao escrever no arquivo:", e)
        return False
    return True

# Rota para obter tarefas (sem autenticação)
@app.route('/todos', methods=['GET'])
def get_todos():
    todos = read_todos()
    
    status = request.args.get('status')
    order_by = request.args.get('order_by')

    if status:
        todos = [todo for todo in todos if todo.get('status') == status]

    if order_by == 'priority':
        todos.sort(key=lambda x: x.get('priority', 'low'))
    elif order_by == 'due_date':
        todos.sort(key=lambda x: datetime.strptime(x.get('due_date', '9999-12-31'), '%Y-%m-%d'))

    return jsonify(todos), 200

# Rota para adicionar uma tarefa (sem autenticação)
@app.route('/todos', methods=['POST'])
def add_todo():
    new_todo = request.json
    print("Dados recebidos:", new_todo)
    
    if 'task' not in new_todo or 'priority' not in new_todo or 'due_date' not in new_todo:
        return jsonify({'error': 'task, priority e due_date são obrigatórios!'}), 400

    new_todo['id'] = len(read_todos()) + 1  # Gerar ID único
    new_todo['status'] = 'pendente'  # Adicionando status padrão

    todos = read_todos()
    if not isinstance(todos, list):
        return jsonify({'error': 'Dados de tarefas inválidos!'}), 500

    todos.append(new_todo)
    write_todos(todos)
    
    return jsonify({'msg': 'Tarefa adicionada com sucesso!', 'todo': new_todo}), 201

# Rota para atualizar uma tarefa (sem autenticação)
@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    updated_todo = request.json
    if 'task' not in updated_todo or 'priority' not in updated_todo or 'due_date' not in updated_todo:
        return jsonify({'error': 'task, priority e due_date são obrigatórios!'}), 400

    todos = read_todos()
    todo_found = False
    
    for todo in todos:
        if todo['id'] == todo_id:
            todo.update(updated_todo)
            todo_found = True
            write_todos(todos)
            return jsonify(todo), 200
    
    if not todo_found:
        return jsonify({'error': 'Tarefa não encontrada!'}), 404

# Rota para atualizar o status de uma tarefa (sem autenticação)
@app.route('/todos/<int:todo_id>', methods=['PATCH'])
def update_todo_status(todo_id):
    todos = read_todos()
    status = request.json.get('status')
    
    if not status:
        return jsonify({'error': 'O campo status é obrigatório!'}), 400
    
    todo_found = False
    
    for todo in todos:
        if todo['id'] == todo_id:
            todo['status'] = status
            todo_found = True
            write_todos(todos)
            return jsonify(todo), 200
    
    if not todo_found:
        return jsonify({'error': 'Tarefa não encontrada!'}), 404

# Rota para deletar uma tarefa (sem autenticação)
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todos = read_todos()
    todos_after_deletion = [todo for todo in todos if todo['id'] != todo_id]

    if len(todos) == len(todos_after_deletion):
        return jsonify({'error': 'Tarefa não encontrada!'}), 404

    write_todos(todos_after_deletion)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
