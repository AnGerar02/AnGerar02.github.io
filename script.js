const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = { x: undefined, y: undefined };

// Listener para detectar el mouse
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;

  // Generamos partículas en la posición del mouse
  for (let i = 0; i < 2; i++) {
    particlesArray.push(new Particle());
  }
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 4 + 2; // Tamaño visible
    this.speedX = Math.random() * 4 - 2; // Movimiento aleatorio
    this.speedY = Math.random() * 4 - 2;
    // Color: Variación de amarillos y dorados (HSL 40-60)
    this.hue = Math.random() * 20 + 40;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Reducimos el tamaño para que desaparezcan suavemente
    if (this.size > 0.1) this.size -= 0.1;
  }
  draw() {
    // TRUCO DE NEÓN RÁPIDO:
    // Dibujamos dos círculos: uno grande transparente y uno pequeño sólido.
    // Esto simula luz sin usar filtros pesados.

    // 1. Halo de luz (Grande y transparente)
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.2)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Núcleo brillante (Pequeño y sólido)
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles() {
  // 'lighter' suma los colores cuando se superponen, creando un efecto de brillo intenso
  // Es muy rápido de procesar para el navegador.
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    // Eliminar partículas invisibles
    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }

  // Restaurar modo normal
  ctx.globalCompositeOperation = "source-over";
}

function animate() {
  // Limpiar pantalla en cada cuadro
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleParticles();
  requestAnimationFrame(animate);
}

// Ajustar canvas si se cambia el tamaño de la ventana
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();
