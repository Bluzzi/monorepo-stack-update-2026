import type { Route } from "./+types/home";
import type { BackendResourcesProvidedForPath, BackendResourcesInvalidatedForPath } from "@core-service/backend";
import { AlertCircleIcon } from "@core-package/ui-kit/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  ItemGroup,
  ItemTitle,
  Skeleton,
  toast,
} from "@core-package/ui-kit/ui";
import { render } from "@core-package/ui-kit/utils";
import { useForm } from "@tanstack/react-form";
import { dehydrate, HydrationBoundary, QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "#src/utils/api.client.js";
import { apiServer } from "#src/utils/api.server.js";
import { useRef } from "react";
import { z } from "zod";

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
  // Refs:
  const titleRef = useRef<HTMLInputElement>(null);

  // Queries:
  const { data, status } = useQuery({
    queryKey: ["todo"] satisfies BackendResourcesProvidedForPath<"/get_todos">,
    queryFn: async () => apiClient("/get_todos", {}),
  });

  // Mutations:
  const createTodo = useMutation({
    mutationKey: ["todo"] satisfies BackendResourcesInvalidatedForPath<"/create_todo">,
    mutationFn: async (data: { title: string; description: string }) => {
      return apiClient("/create_todo", {
        title: data.title,
        description: data.description || null,
      });
    },
    onError: () => {
      toast.error("Something went wrong while creating the task. Please try again.");
    },
  });

  const setTodoAsDone = useMutation({
    mutationKey: ["todo"] satisfies BackendResourcesInvalidatedForPath<"/set_todo-as-done">,
    mutationFn: async (data: { id: string }) => {
      return apiClient("/set_todo-as-done", { id: data.id });
    },
    onError: () => {
      toast.error("Something went wrong while creating the task. Please try again.");
    },
  });

  // Form:
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: z.object({
        title: z.string().min(3, { error: "The title must be at least 3 characters long." }),
        description: z.string().max(280, { error: "The description must be no longer than 280 characters." }),
      }),
    },
    onSubmit: ({ value }) => {
      createTodo.mutate(value);
      form.reset();
      titleRef.current?.focus();
    },
  });

  // Render:
  return (
    <main className="flex flex-col items-center gap-4 justify-center py-10">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          await form.handleSubmit();
        }}
        className="w-xl space-y-4"
      >
        <form.Field
          name="title"
          children={(field) => (
            <div className="space-y-1">
              <Input
                placeholder="Title of the task"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                ref={titleRef}
              />

              {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm">{field.state.meta.errors[0]?.message}</p>
              )}
            </div>
          )}
        />

        <InputGroup>
          <form.Field
            name="description"
            children={((field) => (
              <>
                <InputGroupTextarea
                  placeholder="Add more details about the task (optional)"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  className="min-h-8"
                />

                {!field.state.meta.isValid && (
                  <p className="text-red-500 text-sm">{field.state.meta.errors[0]?.message}</p>
                )}
              </>
            ))}
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="ml-auto">
              <form.Subscribe
                selector={(state) => state.values.description}
                children={(description) => description.length}
              />
              /280
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <Button type="submit" className="w-full" size="lg" disabled={createTodo.isPending}>
          Create task
        </Button>
      </form>

      {render(() => {
        if (status === "error") return (
          <Alert variant="destructive" className="w-full max-w-xl">
            <AlertCircleIcon />
            <AlertTitle>Loading error</AlertTitle>
            <AlertDescription>
              An error occurred while loading the data. Please try again.
            </AlertDescription>
          </Alert>
        );

        if (status === "pending") return (
          <div className="space-y-4 w-full max-w-xl ">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        );

        return (
          <ItemGroup role="list" className="w-full max-w-xl space-y-4">
            {data.todos.map((todo) => (
              <Item key={todo.id} role="listitem" variant="outline">
                <ItemContent>
                  <ItemTitle>{todo.title}</ItemTitle>
                  {todo.description && (
                    <ItemDescription>
                      {todo.description}
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTodoAsDone.mutate({ id: todo.id })}
                    disabled={setTodoAsDone.isPending}
                  >
                    Done
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        );
      })}
    </main>
  );
};

const Page = ({ loaderData }: Route.ComponentProps) => (
  <HydrationBoundary state={loaderData.dehydratedState}>
    <PageComponent />
  </HydrationBoundary>
);

export default Page;
