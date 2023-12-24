import * as THREE from "/modules/three.module.js";

class LocalNetworkedPlayer {
  constructor(scene, camera) {
    this.player = null
    this.scene = scene;
    this.camera = camera;

    this.create();
  }
  getPlayer(){
    return this.player
  }

  create() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x004ea1),
    });

    let mat2 = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x51dbe8),
    });
    let geo = new THREE.BoxGeometry(10, 10, 10);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = this.camera.position.x;
    mesh.position.y = this.camera.position.y;
    mesh.position.z = this.camera.position.z;

    let sphereGeo = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh = new THREE.Mesh(sphereGeo, mat2);
    sphereMesh.position.x = this.camera.position.x + .3;
    sphereMesh.position.y = this.camera.position.y + .25;
    sphereMesh.position.z = this.camera.position.z - .5;

    let sphereGeo2 = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh2 = new THREE.Mesh(sphereGeo2, mat2);
    sphereMesh2.position.x = this.camera.position.x - .3;
    sphereMesh2.position.y = this.camera.position.y + .25;
    sphereMesh2.position.z = this.camera.position.z - .5;

    sphereMesh.scale.copy(new THREE.Vector3(.1, .1, .1))
    sphereMesh2.scale.copy(new THREE.Vector3(.1, .1, .1))
    mesh.scale.copy(new THREE.Vector3(.1, .1, .1))

    mesh.attach(sphereMesh);
    mesh.attach(sphereMesh2);

    this.player = mesh
    this.player.lookAt(new THREE.Vector3(0, 0, 0))
    this.scene.add(this.player);
    console.log("Player Mesh added to scene,", this.player);

    return mesh;
  }

  update() {
    // console.log(this.player.position, this.player.quaternion)
    this.player.position.x = this.camera.position.x;
    this.player.position.y = this.camera.position.y;
    this.player.position.z = this.camera.position.z;
    this.player.quaternion.copy(this.camera.quaternion)

  }
}

export { LocalNetworkedPlayer };
