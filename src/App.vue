<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { nanoid } from "nanoid";
import { SquareX } from "lucide-vue-next";
import { Settings2 } from "lucide-vue-next";

const todos = ref([]);
const name = ref("");
const inputContent = ref("");
const editingTodoId = ref(null);

const todosAsc = computed(() =>
  todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt;
  })
);

// Add todo
const addTodo = () => {
  if (inputContent.value.trim() === "") {
    return;
  }

  todos.value.push({
    id: nanoid(),
    content: inputContent.value,
    completed: false,
    createdAt: new Date().getTime(),
  });

  inputContent.value = "";
};

// delete todo
const deleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => {
    return todo.id !== id;
  });
};

// Edit todo
const editTodo = (id) => {
  if (editingTodoId.value === id) {
    editingTodoId.value = null;
  } else {
    editingTodoId.value = id;
  }
};

const finishEditing = () => {
  editingTodoId.value = null;
};

watch(
  todos,
  (newVal) => {
    localStorage.setItem("todos", JSON.stringify(newVal));
  },
  { deep: true }
);

watch(name, (newVal) => {
  localStorage.setItem("name", newVal);
});

onMounted(() => {
  name.value = localStorage.getItem("name") || "";
  todos.value = JSON.parse(localStorage.getItem("todos") || []);
});
</script>

<template>
  <main
    class="bg-slate-900 text-slate-200 min-h-screen py-5 flex items-center justify-center"
  >
    <div
      class="max-w-[340px] sm:max-w-[500px] md:max-w-[630px] mx-auto px-3 space-y-5 grow"
    >
      <!-- Header -->
      <section>
        <h2 class="flex text-3xl font-semibold">
          what's up,
          <input
            :class="name !== '' ? ' cursor-default' : 'cursor-text'"
            class="ml-[0.5rem] bg-transparent min-w-0 grow shrink basis-0 border-none outline-none"
            type="text"
            placeholder="Name here"
            v-model="name"
          />
        </h2>
      </section>

      <!-- Adding Todos -->
      <section class="space-y-1">
        <h3 class="text-xl">Create A Todo</h3>
        <form @submit.prevent="addTodo">
          <input
            class="bg-slate-700 mt-2 px-2 py-2 text-lg w-full rounded-[4px] placeholder:text-slate-400"
            type="text"
            placeholder="e.g. make a video"
            v-model="inputContent"
          />
          <button
            class="bg-blue-300 hover:bg-blue-400 text-lg text-slate-900 font-medium w-full py-2 rounded-[4px] mt-3 cursor-pointer transition-color duration-300 ease-in-out"
            type="submit"
          >
            Add Todo
          </button>
        </form>
      </section>

      <!-- All Todos -->
      <section>
        <h3 class="text-2xl mt-14 mb-3 text-center font-semibold">Todo's</h3>

        <div v-if="todos.length === 0">
          <h3 class="text-lg font-medium text-green-600 text-center">
            Your list is empty, Please add a todo.
          </h3>
        </div>

        <div v-else class="space-y-3">
          <div
            class="flex items-center gap-3 p-2 bg-slate-800 rounded-[4px]"
            v-for="todo in todosAsc"
            :key="todo.id"
          >
            <input
              class="cursor-pointer"
              type="checkbox"
              v-model="todo.completed"
            />

            <div class="grow">
              <div v-if="editingTodoId === todo.id">
                <input
                  class="w-full bg-transparent border border-green-400 px-2 rounded-md outline-none text-lg text-inherit"
                  type="text"
                  v-model="todo.content"
                  @blur="finishEditing"
                  @keyup.enter="finishEditing"
                />
              </div>
              <div
                v-else
                class="text-lg"
                :class="todo.completed ? 'line-through text-slate-400' : ''"
              >
                {{ todo.content }}
              </div>
            </div>

            <button @click="editTodo(todo.id)" class="ml-auto cursor-pointer">
              <Settings2 size="22" class="text-slate-200 hover:text-blue-400" />
            </button>
            <button @click="deleteTodo(todo.id)" class="ml-auto cursor-pointer">
              <SquareX size="22" class="text-slate-200 hover:text-red-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
