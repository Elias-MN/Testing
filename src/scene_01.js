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
    map.createLayer("Ground_Layer", tilesetTile);

    // Create player
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
  }

  // Runs once per frame for the duration of the scene
  update() {}
}
