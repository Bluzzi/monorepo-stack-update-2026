import type { Route } from "./+types/home";
import type { BackendResourcesProvidedForPath, BackendResourcesInvalidatedForPath } from "@core-service/backend";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@core-package/ui-kit/ui";
import { dehydrate, HydrationBoundary, QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "#src/utils/api.client.js";
import { apiServer } from "#src/utils/api.server.js";
import { useState } from "react";

export const meta = (_: Route.MetaArgs) => {
  return [
    { title: "Stack Update" },
    { name: "description", content: "The 2026 stack update!" },
  ];
};

export const loader = async (_: Route.LoaderArgs) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todo"] satisfies BackendResourcesProvidedForPath<"/get_todos">,
    queryFn: async () => apiServer("/get_todos", {}),
  });

  return { dehydratedState: dehydrate(queryClient) };
};

const PageComponent = () => {
  // States:
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Queries:
  const { data } = useQuery({
    queryKey: ["todo"] satisfies BackendResourcesProvidedForPath<"/get_todos">,
    queryFn: async () => apiClient("/get_todos", {}),
  });

  // Mutations:
  const createTodo = useMutation({
    mutationKey: ["todo"] satisfies BackendResourcesInvalidatedForPath<"/create_todo">,
    mutationFn: async () => apiClient("/create_todo", {
      title: title,
      description: description || null,
    }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
    },
    onError: () => {
      alert("Error");
    },
  });

  const setTodoAsDone = useMutation({
    mutationKey: ["todo"] satisfies BackendResourcesInvalidatedForPath<"/set_todo-as-done">,
    mutationFn: async (id: string) => apiClient("/set_todo-as-done", { id: id }),
    onError: () => {
      alert("Error");
    },
  });

  // Render:
  return (
    <main className="flex flex-col items-center gap-4 justify-center py-10">
      <div className="w-xl space-y-4">
        <Input
          placeholder="Title of the todo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <InputGroup>
          <InputGroupTextarea
            placeholder="Write a description..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="ml-auto">0/280</InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <Button
          className="w-full"
          size="lg"
          disabled={title.length === 0}
          onClick={() => createTodo.mutate()}
        >
          Create Todo
        </Button>
      </div>

      <div className="w-xl space-y-4">
        {data?.todos.map((todo) => (
          <Item key={todo.id} variant="outline">
            <ItemContent>
              <ItemTitle>{todo.title}</ItemTitle>
              {todo.description && (
                <ItemDescription>
                  {todo.description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm" onClick={() => setTodoAsDone.mutate(todo.id)}>
                Done
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </main>
  );
};

const Page = ({ loaderData }: Route.ComponentProps) => (
  <HydrationBoundary state={loaderData.dehydratedState}>
    <PageComponent />
  </HydrationBoundary>
);

export default Page;
