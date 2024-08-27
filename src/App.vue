<script setup>
import { ref, onMounted, computed, watch } from "vue";
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

// capitalize the first letter of a todo
const capitalizeFirstWord = (sentence) => {
  if (!sentence) return "";
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
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
  <h1
    class="absolute text-5xl sm:text-7xl lg:text-8xl text-slate-800/40 font-bold left-1/2 -translate-x-1/2 top-14 z-0"
  >
    TaskTrack
  </h1>
  <main
    class="bg-slate-900 text-slate-200 min-h-screen py-5 flex items-center justify-center"
  >
    <div
      class="max-w-[340px] sm:max-w-[500px] md:max-w-[630px] mx-auto px-3 space-y-5 grow"
    >
      <!-- Header -->
      <section>
        <h2
          class="flex text-3xl font-semibold bg-gradient-to-r from-purple-400 to-rose-400 from-0% to-50% text-transparent bg-clip-text"
        >
          what's up,
          <input
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
        <form
          class="flex items-center justify-center gap-3 pt-3"
          @submit.prevent="addTodo"
        >
          <input
            class="bg-slate-300 text-slate-900 text-lg grow p-2 rounded-[4px] placeholder:text-slate-500"
            type="text"
            placeholder="e.g. make a video"
            v-model="inputContent"
          />
          <button
            class="bg-blue-600 px-5 py-2 hover:bg-blue-700 text-lg text-slate-100 font-medium rounded-[4px] cursor-pointer transition-color duration-300 ease-in-out"
            type="submit"
          >
            ADD
          </button>
        </form>
      </section>

      <!-- All Todos -->
      <section>
        <h3 class="text-2xl mt-14 mb-3 text-center font-semibold uppercase">
          Todo's
        </h3>

        <div v-if="todos.length === 0">
          <h3 class="text-lg font-medium text-green-600 text-center">
            Your list is empty, Please add a todo.
          </h3>
        </div>

        <div v-else class="space-y-5">
          <div
            class="flex items-center gap-3 h-[3rem] px-3 bg-slate-800 hover:bg-slate-700 rounded-[4px] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-md hover:shadow-slate-50/5 transition-all duration-300 ease-in-out"
            v-for="todo in todosAsc"
            :key="todo.id"
          >
            <input
              class="cursor-pointer size-[15px]"
              type="checkbox"
              v-model="todo.completed"
            />

            <div class="grow">
              <div v-if="editingTodoId === todo.id">
                <input
                  class="w-full bg-transparent border border-blue-300 px-2 rounded-sm outline-none text-lg text-inherit"
                  type="text"
                  v-model="todo.content"
                  @blur="finishEditing"
                  @keyup.enter="finishEditing"
                />
              </div>
              <div v-else>
                <span
                  class="text-lg"
                  :class="todo.completed ? 'line-through text-slate-400' : ''"
                  >{{ capitalizeFirstWord(todo.content) }}</span
                >
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
