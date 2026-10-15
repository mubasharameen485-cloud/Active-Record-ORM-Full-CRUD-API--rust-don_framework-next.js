"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, name } : user
        )
      );
      setEditId(null);
    } else {
      setUsers([...users, { id: Date.now(), name }]);
    }

    setName("");
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEditId(user.id);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Simple CRUD App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? "Update" : "Add"}
        </button>
      </form>

      <h2>Users List</h2>

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <span>{user.name} </span>

          <button onClick={() => handleEdit(user)}>
            Edit
          </button>

          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}