export const routes = [
  // Todos:
  await import("./routes/get_todos"),
  await import("./routes/create_todo"),
  await import("./routes/set_todo-as-done"),
] as const;
