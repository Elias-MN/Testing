import Phaser from "phaser";

export default class Scene_01 extends Phaser.Scene {
  constructor() {
    super();
  }

  money;
  coins = 0;

  // Runs once, loads up assets like images and audio
  preload() {
    // this.load.image('keyWord', 'assets/...');
    this.load.image("cielo", "assets/Background.png");
    this.load.image("tierra", "assets/tileset.png");

    // Load map
    this.load.tilemapTiledJSON("map", "assets/clase.json");

    // Load player
    this.load.atlas("player", "assets/squirtle.png", "assets/squirtle.json");

    // Load music
    this.load.audio("jump", "assets/jump.mp3");

    // Load elements
    this.load.image("apple", "assets/apple.png");
  }

  // Runs once, after all assets in preload are loaded
  create() {
    // Create map
    const map = this.make.tilemap({ key: "map" });

    // Add tileset in the map
    // map.addTilesetImage('keyWord from Tiled tileset', 'keyWord from preload');
    const skyTile = map.addTilesetImage("sky", "cielo");
    const tilesetTile = map.addTilesetImage("tileset", "tierra");

    // Add layers in the map
    // Careful with the order of layers! Must to be like in Tiled
    // map.createLayer('keyWord from Tiled layer', 'variable of map.addTilesetImage', x, y);
    map.createLayer("Sky_Layer", skyTile);
    map.createLayer("Elements_Layer", tilesetTile);

    const floor = map.createLayer("Floor_Layer", tilesetTile);
    // This is to make everything collide with the floor
    floor.setCollisionByExclusion([-1], true);

    // Create player
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.physics.add.collider(this.player, floor);
    this.jump_sound = this.sound.add("jump", { volume: 0.5, loop: false });
    this.player.setGravityY(200);

    this.anims.create({
      key: "move",
      // The prefix of 'move_01, move_02...' is 'move_'
      // end is the last number 'move_01 to move_04': 4
      // zeroPad is the number of elements '00, 01, 02...': 2
      frames: this.anims.generateFrameNames("player", {
        prefix: "move_",
        start: 1,
        end: 3,
        zeroPad: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: "idle" }],
      frameRate: 1,
      repeat: -1,
    });

    map.createLayer("Ground_Layer", tilesetTile);

    // Create a group of apples
    this.apples = this.physics.add.group({
      key: "apple",
      repeat: 3,
      setXY: { x: 20, y: 100, stepX: 100 },
    });

    this.physics.add.overlap(
      this.player,
      this.apples,
      this.collect,
      null,
      this
    );

    this.apples.children.iterate(function (apple) {
      // Change hitbox size
      apple.body.setSize(10, 10);

      // Set random position
      // let value = Phaser.Math.Between(10, 250);
      // apple.setPosition(apple.x, apple.y + value);

      // Move hitbox position
      // apple.body.setOffset(0, 0);
      // Move elements
      // apple.setVelocityX(20);
      // let left = true;
      // setInterval(() => {
      //   if (left) {
      //     left = false;
      //     apple.setVelocityX(-20);
      //   } else {
      //     left = true;
      //     apple.setVelocityX(20);
      //   }
      // }, 3000);
    });

    this.money = this.add.text(20, 20, "Apples: " + this.coins, {
      fontFamily: "Quicksand",
      fontSize: "16px",
      color: "#101010",
      fontStyle: "normal",
      strokeThickness: 2,
    });
  }

  // Runs once per frame for the duration of the scene
  update() {
    console.log(this.player.x + ", " + this.player.y);

    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-50);
      this.player.setFlipX(true);
      this.player.anims.play("move", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(50);
      this.player.setFlipX(false);
      this.player.anims.play("move", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    // Player jump
    if (
      (this.spacebar.isDown || this.cursors.up.isDown) &&
      this.player.body.onFloor()
    ) {
      this.player.setVelocityY(-250);
      this.jump_sound.play();
    }
  }

  collect(player, element) {
    this.coins += 1;
    this.money.setText("Apples: " + this.coins);

    element.destroy();
  }
}
