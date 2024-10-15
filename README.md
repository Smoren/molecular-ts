# MolecuLarva — Molecular Simulation

This project is an experiment that visualizes the behavior of particles
in 2D and 3D space:

* Collisions and rebounds of particles upon contact.
* Simulation of forces of attraction and repulsion between particles.
* Building connections between particles and the influence of other particles on these connections.
* The influence of temperature and other environmental factors on the behavior of particles.

Particles of different types are visualized in different colors. Their properties, presented in the configuration of the world, depend on the type of particle:

1. **Gravity coefficient matrix for unlinked particles** shows whether a particle of one type will attract or repel a particle of another type in the case when they are not linked to each other, and with what force.
2. **Gravity coefficient matrix for linked particles** shows whether a particle of one type will attract or repel a particle of another type in the case when they are linked to each other, and with what force.
3. **Connection limit map** shows the maximum number of links for particles of each type.
4. **Connection limit matrix** shows the maximum number of connections that particles of each type can have with particles of different types.
5. **Connection weight matrix** shows the weight occupied by the link between a particle of type A and a particle of type B in the overall limit on the number of bonds of a particle of type A (in Connection limit map).
6. **Tensor of influence on neighbors links length** shows how particles of type A affect the maximum link lengths of particles of type B with particles of type C.
7. **Tensor of influence on neighbors links elastic force** shows how particles of type A affect the elastic force of links between particles of type B and type C.

The main goal of this project is to study self-organizing systems and explore configurations in which conditions for 
spontaneous emergence of artificial life will be present.

## Demo

Live demo: https://smoren.github.io/molecular-ts/

![Demo](docs/demo.gif)

## Controls
### 3D
* `↑`, `↓`, `←`, `→` — move forward, backward, left, right.
* Rotations are done by dragging.

### 2D
* `Wheel` — move up and down.
* `Shift + Wheel` — move left and right.
* `Ctrl + Wheel` — zoom.
* `Mouse down + Mouse move` — move arbitrarily.
* `Ctrl + Mouse down + Mouse move` (on a particle) — drag it arbitrarily.

### Adding new particles
* `Numeric key down + Click` — add a particle with the type corresponding to the number of the key.
* `1 + click` — add a particle of the first type.
* `2 + click` — add a particle of the second type.
* ...

## Research

Play with the simulation hyperparameters in the [live demo](https://smoren.github.io/molecular-ts/) and share links
to interesting worlds obtained in the app in the [special issue](https://github.com/Smoren/molecular-ts/issues/1).

## Install

```bash
npm i
npm run dev
```

## Inspiration

This project was inspired by the [ParticleAutomataJS](https://github.com/artemonigiri/ParticleAutomataJS) 
developed by [ArtemOnigiri](https://github.com/artemonigiri).

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request on the 
[GitHub repository](https://github.com/Smoren/molecular-ts).

## License

MolecuLarva is licensed under the MIT License.
