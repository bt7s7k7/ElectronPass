spawnList.push({
	prototype: new EntityPrototype({
		draw(entity) {
			polygon(entity.pos, [
				[Math.PI * 2 / 6 * 0, 40],
				[Math.PI * 2 / 6 * 1, 40],
				[Math.PI * 2 / 6 * 2, 40],
				[Math.PI * 2 / 6 * 3, 40],
				[Math.PI * 2 / 6 * 4, 40],
				[Math.PI * 2 / 6 * 5, 40]
			], Date.now() / 100, colors.red)
		},
		update(deltaTime, entity) {
			//entity.pos.addI(entity.pos.add(state.player.pos.mul(-1)).mul(-1).normalize().mul(deltaTime / 2)).addI(vector.fromAngle(Date.now() / entity.speed + entity.offset).mul(deltaTime))

			if (entity.timer <= 0) {
				entity.charging ^= 1
				if (entity.charging) {
					entity.timer = 500
					entity.dir = entity.pos.add(state.player.pos.mul(-1)).normalize().mul(-1)
				} else {
					entity.timer = 1000
				}
			}

			if (entity.charging) {
				entity.pos.addI(entity.dir.mul(deltaTime * 2))
			}

			if (entity.timer >= 0) entity.timer -= deltaTime
			if (entity.cooldown >= 0) entity.cooldown -= deltaTime
		},
		init(entity) {
			entity.dir = [0,0]
			entity.timer = 10
			entity.charging = false
			entity.cooldown = 0
		},
		collision(hit, entity) {
			if (entity.cooldown <= 0 && state.player == hit) {
				entity.cooldown = 100
				damagePlayer(10)
			}
		},
		type: "1charger",
		maxHealth: 30,
		damage: 10,
		radius: 40,
		canDie: true
	}),
	minDiff: 0,
	chance: 0.0001
})