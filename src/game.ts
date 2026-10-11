const canvas = document.getElementById('juego') as HTMLCanvasElement;
const puntajeElemento = document.getElementById('puntaje') as HTMLElement;
const ctx = canvas.getContext('2d')!;

const TAMANIO_CELDA = 20;
const CANTIDAD_CELDAS = canvas.width / TAMANIO_CELDA;

interface Punto {
    x: number;
    y: number;
}

let serpiente: Punto[] = [{ x: 10, y: 10}];
let direccion: Punto = { x: 0, y: 0};
let juegoTerminado = false;
let comida: Punto = generarComida();

function generarComida(): Punto {
    return {
        x: Math.floor(Math.random() * CANTIDAD_CELDAS),
        y: Math.floor(Math.random() * CANTIDAD_CELDAS),
    }
}

function hayColision(cabeza: Punto): boolean {
  const chocaBorde =
    cabeza.x < 0 || cabeza.x >= CANTIDAD_CELDAS ||
    cabeza.y < 0 || cabeza.y >= CANTIDAD_CELDAS;

  const chocaCuerpo = serpiente.some(
    segmento => segmento.x === cabeza.x && segmento.y === cabeza.y
  );

  return chocaBorde || chocaCuerpo;
}

function reiniciarJuego() {
  clearInterval(loop);
  loop = 0;
  juegoTerminado = false;
  serpiente = [{ x: 10, y: 10 }];
  direccion = { x: 0, y: 0 };
  comida = generarComida();
  puntajeElemento.textContent = '0';
  dibujar();
}

function dibujar() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#4CAF50';
  for (const segmento of serpiente) {
    dibujarCirculo(segmento.x, segmento.y);
  }

  ctx.fillStyle = '#e74c3c';
  dibujarCirculo(comida.x, comida.y);
}

function dibujarCirculo(celdaX: number, celdaY: number) {
  const centroX = celdaX * TAMANIO_CELDA + TAMANIO_CELDA / 2;
  const centroY = celdaY * TAMANIO_CELDA + TAMANIO_CELDA / 2;
  const radio = TAMANIO_CELDA / 2 - 1;

  ctx.beginPath();
  ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
  ctx.fill();
}

function actualizar() {
  const cabeza: Punto = {
    x: serpiente[0].x + direccion.x,
    y: serpiente[0].y + direccion.y,
  };

  if (hayColision(cabeza)) {
  clearInterval(loop);
  loop = 0;
  juegoTerminado = true;
  alert(`Game Over! Puntaje: ${serpiente.length}`);
  return;
}

  serpiente.unshift(cabeza);

  if (cabeza.x === comida.x && cabeza.y === comida.y) {
  comida = generarComida();
  puntajeElemento.textContent = String(serpiente.length);
} else {
  serpiente.pop();
}

  dibujar();
}

document.addEventListener('keydown', (evento) => {
  iniciarJuego();

  let nuevaDireccion: Punto | null = null;

  switch (evento.key) {
    case 'ArrowUp':
      nuevaDireccion = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      nuevaDireccion = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      nuevaDireccion = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      nuevaDireccion = { x: 1, y: 0 };
      break;
    case 'r':
      reiniciarJuego();
      return;
  }

  if (nuevaDireccion) {
    const esOpuesta =
      nuevaDireccion.x === -direccion.x && nuevaDireccion.y === -direccion.y;

    if (!esOpuesta) {
      direccion = nuevaDireccion;
    }
  }
});

let loop: number;

function iniciarJuego() {
  if (!loop && !juegoTerminado) {
    loop = setInterval(actualizar, 150);
  }
}

dibujar();