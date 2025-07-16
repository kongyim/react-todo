import { useState, useEffect } from 'react';

function App() {
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

  const filteredTodos = todos.filter((todo) => {
    const matchText = todo.text.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'incomplete' && !todo.completed);
    return matchText && matchStatus;
  });

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, completed: false }]);
    setInput('');
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
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
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
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTodo();
            }}
          />
          <button
            onClick={handleAddTodo}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {filteredTodos.length === 0 ? (
            <li className="text-center text-gray-400">📭 No tasks found</li>
          ) : (
            filteredTodos.map((todo, index) => (
              <li
                key={index}
                onClick={() => handleToggle(index)}
                className={`group flex items-center justify-between p-4 border rounded-xl transition cursor-pointer ${
                  todo.completed
                    ? 'bg-green-50 text-gray-400 line-through'
                    : 'bg-gray-50 hover:bg-indigo-50'
                }`}
              >
                <span className="text-sm sm:text-base">
                  {todo.completed ? '✅' : '⬜'} {todo.text}
                </span>
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
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
