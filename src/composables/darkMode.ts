import { ref, watchEffect } from 'vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true'); // Inicializa con el valor de localStorage

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

// Sincroniza con localStorage cada vez que cambia el estado
watchEffect(() => {
  localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
});

// Inicializa el modo oscuro si es necesario al cargar la página
if (isDarkMode.value) {
  document.documentElement.classList.add('dark');
}

export { isDarkMode, toggleDarkMode };
