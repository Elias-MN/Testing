import Phaser from "phaser";

import Scene_01 from "./scene_01";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 480,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Scene_01],
};

export default new Phaser.Game(config);
