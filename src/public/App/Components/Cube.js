import * as THREE from "/modules/three.module.js";

class Cube {
  constructor(scene) {
    this.scene = scene;

    this.create();
  }

  create() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0xffffff),
    });

    let geo = new THREE.BoxGeometry(1, 1, 1);
    let mesh = new THREE.Mesh(geo, mat);

    this.mesh = mesh;
    this.scene.add(this.mesh);
    return this.mesh;
  }

  updateFromNetwork(authoritativeGameState) {
    // console.log("updateFromNetwork", authoritativeGameState)
    let quaternion = new THREE.Quaternion();
    quaternion._x = authoritativeGameState.Cube.quaternion[0];
    quaternion._y = authoritativeGameState.Cube.quaternion[1];
    quaternion._z = authoritativeGameState.Cube.quaternion[2];
    quaternion._w = authoritativeGameState.Cube.quaternion[3];
    this.mesh.quaternion.copy(quaternion);

    this.mesh.position.x = authoritativeGameState.Cube.position.x;
    this.mesh.position.y = authoritativeGameState.Cube.position.y;
    this.mesh.position.z = authoritativeGameState.Cube.position.z;
    
  }
}

export { Cube };
