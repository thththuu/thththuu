let clientX = -100;
let clientY = -100;
let lastX = 0;
let lastY = 0;
const cursor = document.querySelector(".cursor");


const initCursor = () => {
	document.addEventListener("mousemove", (e) => {
		clientX = e.clientX;
		clientY = e.clientY;
	});

	const render = () => {
		lastX = lerp(lastX, clientX, 0.08);
		lastY = lerp(lastY, clientY, 0.08);
		cursor.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;

		requestAnimationFrame(render);
	};
	requestAnimationFrame(render);
};

initCursor();

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end;
}


if (document.body.animate) {
  document.querySelector("body").addEventListener("click", particlePop);
}

function particlePop(e) {
  for (let i = 0; i < 12; i++) {
    createParticle(e.clientX, e.clientY);
  }
  cursor.classList.remove("cursor--clicked");

  cursor.classList.add("cursor--clicked");

  setTimeout(function () {
    cursor.classList.remove("cursor--clicked");
  }, 500);
}

function createParticle(x, y) {
  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  const size = Math.floor(Math.random() * 50 + 20);
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.background = `hsl(${Math.round(177)}, 100%, 27%)`;
  const destinationX = x + (Math.random() - 0.5) * 2 * 125;
  const destinationY = y + (Math.random() - 0.5) * 2 * 125;

  const animation = particle.animate(
    [
      {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        opacity: 1
      },
      {
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 1,
        width: 0,
        height: 0
      }
    ],
    {
      duration: Math.random() * 1500 + 750,
      easing: "cubic-bezier(0, .9, .57, 1)",
      delay: Math.random() * 100
    }
  );

  animation.onfinish = () => {
    particle.remove();
  };
}
