spawnList.push({
	prototype: new EntityPrototype({
		draw(entity) {
			polygon(entity.pos.add(vector.random(2).mul(2)), [
				[Math.PI * 2 / 6 * 0, 40],
				[Math.PI * 2 / 6 * 1, 40],
				[Math.PI * 2 / 6 * 2, 40],
				[Math.PI * 2 / 6 * 3, 40],
				[Math.PI * 2 / 6 * 4, 40],
				[Math.PI * 2 / 6 * 5, 40]
			], Date.now() / 100, colors.orange)
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
			entity.dir = [0, 0]
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
},
	{
		prototype: new EntityPrototype({
			draw: (entity) => {
				polygon(entity.pos, [
					[0, 40],
					[Math.PI * 2 / 3, 40],
					[Math.PI, 10],
					[Math.PI * 2 / 3 * 2, 40]
				], entity.pos.mul(-1).add(state.player.pos).normalize().toAngle(), colors.red)
			},
			update: (deltaTime, entity) => {

				var diff = entity.pos.mul(-1).add(state.player.pos)
				var size = diff.size()
				var speed = [0, 0]

				var side = [diff[1], diff[0]]
				if (size < 400)	entity.pos.addI(side.normalize().mul(deltaTime / 2))

				if (size > 350) {
					speed.addI(diff.normalize().mul(0.5).mul(Math.clamp(Math.abs(size - 350) / 100, 0, 1)))
				}


				entity.pos.addI(speed.mul(deltaTime))

				if (entity.timer <= 0) {
					entity.timer = 500
					spawnEntity("1bullet", entity.pos).dir = entity.pos.mul(-1).add(state.player.pos).normalize().mul(1).add(speed)
				}
				entity.timer -= deltaTime
			},
			init: (entity) => {
				entity.timer = 0
			},
			maxHealth: 50,
			type: "1shooter",
			radius: 40,
			canDie: true
		}),
		minDiff: 10,
		chance: 0.00001,
		maxAmount: 3
	},
	{
		prototype: new EntityPrototype({
			draw(entity) {
				ctx.setColor(colors.orange)
				var base = transform(entity.pos)
				repeat(Math.ceil(entity.timer / 1000), () => {
					ctx.line(base.add(vector.random(2).mul(10)), base.add(vector.random(2).mul(10)))
				})
			},
			init(entity) {
				entity.timer = 4000
				entity.dir = [0, 0]
			},
			update(deltaTime, entity) {
				entity.pos.addI(entity.dir.mul(deltaTime))
				entity.timer -= deltaTime
				if (entity.timer < 0) {
					entity.destroy()
				}
			},
			collision(hit, entity) {
				if (hit == state.player) {
					entity.destroy()
					damagePlayer(10)
				}
			},
			radius: 10,
			type: "1bullet"
		})
	}
)