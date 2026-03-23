// Seleccionamos los elementos del DOM asegurando sus tipos
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

// Interfaz para estructurar los datos de autenticación
interface LoginData {
    email: string;
    password: string;
}

// Manejador del evento de envío del formulario
if (loginForm) {
    loginForm.addEventListener('submit', (event: Event) => {
        event.preventDefault(); // Evitamos que la página se recargue

        const data: LoginData = {
            email: emailInput.value,
            password: passwordInput.value
        };

        // Aquí es donde harías la petición Fetch o Axios hacia tu backend de FastAPI
        console.log('Iniciando sesión con los siguientes datos:', data);
        
        // Simulación de carga visual en el botón
        const submitBtn = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}