# Molecular simulation

This project is an experiment that visualizes the behavior of particles
in two-dimensional and three-dimensional space:

* Collisions and rebounds of particles upon contact.
* Simulation of forces of attraction and repulsion between particles.
* Building connections between particles and the influence of other particles on these connections.
* The influence of temperature and other environmental factors on the behavior of particles.

Particles of different types are visualized in different colors. Their properties, presented in the configuration of the world, depend on the type of particle:

1. **Gravity coefficient matrix for unlinked particles** shows whether a particle of one type will attract or repel a particle of another type in the case when they are not linked to each other, and with what force.
2. **Gravity coefficient matrix for linked particles** shows whether a particle of one type will attract or repel a particle of another type in the case when they are linked to each other, and with what force.
3. **Connection limit map** shows the maximum number of links for particles of each type.
4. **Connection limit matrix** shows the maximum number of connections that particles of each type can have with particles of different types.
5. **Matrix of influence on neighbors links** shows how particles of each type affect the maximum length of links of neighboring particles of different types.

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

### Adding new particles
* `Numeric key down + Click` — add a particle with the type corresponding to the number of the key.
* `1 + click` — add a particle of the first type.
* `2 + click` — add a particle of the second type.
* ...

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

Molecular TS is licensed under the MIT License.
