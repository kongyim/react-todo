import { useState, useEffect } from 'react';

function App() {
  const [dueDate, setDueDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | completed | incomplete
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const filteredTodos = sortedTodos.filter((todo) => {
    const matchText = todo.text.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'incomplete' && !todo.completed);
    return matchText && matchStatus;
  });

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    setTodos([
      ...todos,
      {
        text: input,
        completed: false,
        dueDate, // <-- new
      },
    ]);
    setInput('');
    setDueDate('');
  };

  const handleDelete = (indexToDelete) => {
    setTodos(todos.filter((_, i) => i !== indexToDelete));
  };

  const handleToggle = (indexToToggle) => {
    const updatedTodos = todos.map((todo, index) =>
      index === indexToToggle ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xd space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">📝 My Todo List</h1>

        {/* Search + Filter */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="🔍 Search tasks"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-2 text-gray-700"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* Add Form */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            placeholder="Add a new task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTodo();
            }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="sm:w-[150px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTodo}
            className="sm:w-auto w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {filteredTodos.length === 0 ? (
            <li className="text-center text-gray-400">📭 No tasks found</li>
          ) : (
            filteredTodos.map((todo, index) => {
              const isOverdue =
                todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
              return (
                <li
                  key={index}
                  onClick={() => handleToggle(index)}
                  className={`group flex items-center gap-4 justify-between p-4 border rounded-xl transition cursor-pointer
                  ${
                    todo.completed
                      ? 'bg-green-50 text-gray-400 line-through'
                      : isOverdue
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-50 hover:bg-indigo-50'
                  }`}
                >
                  <span className="grow text-sm sm:text-base">
                    {todo.completed ? '✅' : '⬜'} {todo.text}
                  </span>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    Due: {todo.dueDate || 'No date'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="text-red-400 hover:text-red-600 invisible group-hover:visible transition"
                  >
                    ❌
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
