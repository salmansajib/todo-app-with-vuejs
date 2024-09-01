<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { nanoid } from "nanoid";
import { SquareX, Settings2 } from "lucide-vue-next";
import { toast } from "vue3-toastify";
import ParticlesEffect from "@/components/stunning/ParticlesEffect/Slim.vue";
import { FwbSpinner } from "flowbite-vue";
import { auth, provider } from "./firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import googleLogo from "@/assets/images/google-logo.png";

const todos = ref([]);
const name = ref("");
const inputContent = ref("");
const editingTodoId = ref(null);
const user = ref(null);
const isLoading = ref(true);

const todosAsc = computed(() =>
  todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt;
  })
);

// Google sign-in method
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userInfo = result.user;
    name.value = userInfo.displayName;
    toast("Logged in with Google successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    toast("Google sign-In failed: " + error.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

// Observe user authentication state
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser;
  isLoading.value = false;
  if (user.value) {
    name.value = localStorage.getItem("name") || "";
    todos.value = JSON.parse(localStorage.getItem("todos") || []);
  } else {
    name.value = "user";
    todos.value = [];
  }
});

// logout method
const logout = async () => {
  try {
    await signOut(auth);
    name.value = "";
    toast("Logged out successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    toast.error("Logout failed: " + error.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

// Add todo
const addTodo = () => {
  if (inputContent.value.trim() === "") {
    return;
  } else if (todos.value.length === 5) {
    toast("Can't add more then five todos", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return;
  }

  todos.value.push({
    id: nanoid(),
    content: inputContent.value,
    completed: false,
    createdAt: new Date().getTime(),
  });

  inputContent.value = "";

  toast("Added Succesfully!", {
    position: toast.POSITION.TOP_RIGHT,
  });
};

// delete todo
const deleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => {
    return todo.id !== id;
  });

  toast("Deleted Succesfully!", {
    position: toast.POSITION.TOP_RIGHT,
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

  toast("Updated Succesfully!", {
    position: toast.POSITION.TOP_RIGHT,
  });
};

// capitalize the first letter of a todo
const capitalizeFirstLetter = (sentence) => {
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
  <div class="h-screen w-screen overflow-hidden bg-slate-950">
    <!-- loader spinner -->
    <div
      v-if="isLoading"
      class="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <FwbSpinner size="12" color="purple" />
    </div>

    <!-- sign-in and main content -->
    <div v-else>
      <!-- sign-in -->
      <div
        v-if="!user"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <section>
          <h2 class="text-slate-100 text-xl mb-2 text-center">Sign In</h2>
          <button
            @click="signInWithGoogle"
            class="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-900 py-2 px-6 rounded-full transition-colors duration-200 ease-in-out"
          >
            <img class="size-5" :src="googleLogo" alt="google logo" />
            Sign in with Google
          </button>
        </section>
      </div>

      <main
        v-else
        class="text-slate-200 w-full py-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div class="max-w-[340px] sm:max-w-[600px] mx-auto px-3 space-y-5 grow">
          <!-- Header -->
          <section>
            <h2
              class="flex text-3xl font-semibold bg-gradient-to-r from-purple-300 to-rose-300 from-0% to-50% text-transparent bg-clip-text"
            >
              what's up, {{ name }}
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
                class="bg-slate-100/20 backdrop-blur-[2px] text-slate-100 text-lg grow p-2 rounded-[4px] placeholder:text-slate-500"
                type="text"
                placeholder="add todo here"
                v-model="inputContent"
              />
              <button
                class="bg-slate-100 hover:bg-slate-200 px-6 py-2 text-lg text-slate-900 font-medium rounded-[4px] cursor-pointer transition-color duration-200 ease-in-out"
                type="submit"
              >
                Add
              </button>
            </form>
          </section>

          <!-- All Todos and log out -->
          <section>
            <h3 class="text-2xl mt-14 mb-3 text-center font-semibold uppercase">
              Todo's
            </h3>

            <div v-if="todos.length === 0">
              <h3 class="text-lg font-medium text-lime-600 text-center">
                Your list is empty, Please add a todo.
              </h3>
            </div>

            <div v-else class="space-y-5">
              <div
                class="flex items-center gap-3 px-3 py-3 bg-slate-800 hover:bg-slate-700 rounded-[4px] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-md hover:shadow-slate-50/10 transition-all duration-300 ease-in-out"
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
                      class="text-lg leading-tight"
                      :class="{ 'line-through text-slate-400': todo.completed }"
                      >{{ capitalizeFirstLetter(todo.content) }}</span
                    >
                  </div>
                </div>

                <button
                  @click="editTodo(todo.id)"
                  class="ml-auto cursor-pointer"
                >
                  <Settings2
                    size="22"
                    class="text-slate-200 hover:text-blue-400"
                  />
                </button>
                <button
                  @click="deleteTodo(todo.id)"
                  class="ml-auto cursor-pointer"
                >
                  <SquareX
                    size="22"
                    class="text-slate-200 hover:text-red-400"
                  />
                </button>
              </div>
            </div>

            <!-- log out button -->
            <button
              @click="logout"
              class="w-full bg-blue-600 px-4 py-2 rounded-md mt-5 hover:bg-blue-700 transition-colors duration-200 ease-in-out"
            >
              Log Out
            </button>
          </section>
        </div>
      </main>
    </div>

    <!-- Background effect -->
    <div
      class="relative z-0 h-screen w-screen mt-[6rem] overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
    >
      <ParticlesEffect
        :density="1000"
        :size="1.5"
        :opacity="1"
        class="absolute inset-x-0 bottom-[20vh] md:bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
      />

      <div
        class="absolute hidden md:block inset-x-0 -bottom-[39.93vh] h-full w-full rounded-[100%] bg-gradient-to-b from-slate-100 to-slate-950"
      />
      <div
        class="absolute hidden md:block inset-x-0 -bottom-[40vh] h-full w-full rounded-[100%] bg-slate-950 shadow-[inset_0_2px_20px_#fff,0_-10px_50px_1px_#ffffff7d]"
      />
    </div>
  </div>
</template>
