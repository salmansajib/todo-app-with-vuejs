<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { nanoid } from "nanoid";
import { CopyX } from "lucide-vue-next";

const todos = ref([]);
const name = ref("");

const inputContent = ref("");
// const inputCategory = ref(null);

const todosAsc = computed(() =>
  todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt;
  })
);

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

const deleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => {
    return todo.id !== id;
  });
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
  <main class="bg-gray-200 min-h-screen">
    <div class="max-w-[500px] mx-auto px-3 space-y-5">
      <section>
        <h2 class="flex text-[1.5rem] font-semibold">
          what's up,
          <input
            class="ml-[0.5rem] bg-transparent min-w-0 grow shrink basis-0 border-none outline-none"
            type="text"
            placeholder="Name here"
            v-model="name"
          />
        </h2>
      </section>

      <section class="space-y-3">
        <h3>Create A Todo</h3>
        <form @submit.prevent="addTodo">
          <h4>What's on your todo list?</h4>
          <input
            class="mt-2 px-2 py-2 w-full rounded-[4px]"
            type="text"
            placeholder="e.g. make a video"
            v-model="inputContent"
          />
          <!-- <h4>Pick a category</h4> -->
          <input
            class="bg-blue-500 w-full py-2 rounded-[4px] mt-3 cursor-pointer"
            type="submit"
            value="Add Todo"
          />
        </form>
      </section>

      <section>
        <h3>Todo's</h3>
        <div class="space-y-3">
          <div
            class="flex gap-3 p-2 bg-green-50 rounded-[4px]"
            v-for="todo in todosAsc"
            :key="todo.id"
          >
            <label>
              <input type="checkbox" v-model="todo.completed" />
            </label>
            <div class="grow">
              <input
                class="w-full bg-transparent outline-none"
                :class="todo.completed ? 'line-through' : ''"
                type="text"
                v-model="todo.content"
              />
            </div>
            <button @click="deleteTodo(todo.id)" class="ml-auto cursor-pointer">
              <CopyX color="red" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
