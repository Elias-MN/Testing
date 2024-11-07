import Phaser from "phaser";

export default class Scene_01 extends Phaser.Scene {
  constructor() {
    super();
  }

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
    this.physics.add.collider(this.player, floor);
    this.jump_sound = this.sound.add("jump", { volume: 0.5, loop: false });

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
  }

  // Runs once per frame for the duration of the scene
  update() {
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
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-250);
      this.jump_sound.play();
    }
  }
}
