import * as THREE from "/modules/three.module.js";

class OtherPlayer {
  constructor(scene) {
    this.scene = scene;
    this.create();
  }

  create() {
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

    let sphereGeo = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh = new THREE.Mesh(sphereGeo, mat2);
    sphereMesh.position.x += 0.3;
    sphereMesh.position.y += 0.25;
    sphereMesh.position.z -= 0.5;

    let sphereGeo2 = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh2 = new THREE.Mesh(sphereGeo2, mat2);
    sphereMesh2.position.x -= 0.3;
    sphereMesh2.position.y += 0.25;
    sphereMesh2.position.z -= 0.5;

    sphereMesh.scale.copy(new THREE.Vector3(0.1, 0.1, 0.1));
    sphereMesh2.scale.copy(new THREE.Vector3(0.1, 0.1, 0.1));
    mesh.scale.copy(new THREE.Vector3(0.1, 0.1, 0.1));

    mesh.attach(sphereMesh);
    mesh.attach(sphereMesh2);

    this.mesh = mesh;
    this.mesh.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.mesh);
    return mesh;
  }
  update(playerData) {
    const { position, quaternion } = playerData;
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  }

  delete() {
    this.scene.remove(this.mesh);
  }
}

export { OtherPlayer };
