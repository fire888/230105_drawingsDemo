import * as THREE from 'three'
import { DR_IMG_SRC, DR_SRC } from '../constants/constants_assetsToLoad'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import drSrc from '../assets/dr1.gltf'

const S = 30
const SCALE = 10


const gallery = arr => {
    for (let item of arr) {
        item.dr.scene.visible = false
        item.map.visible = false
    }

    const iterate = n => {
        if (!arr[n]) {
            n = 0
        }

        const { dr, map } = arr[n]
        dr.scene.position.set(0, -10, 0)
        dr.scene.visible = true

        map.position.set(0, 10, -10)
        map.visible = true

        setTimeout(() => {
            dr.scene.visible = false
            map.visible = false

            iterate(++n)
        }, 4000)
    }


    iterate(0)
}






export const createImagesGallery = (root) => {
    const imagesLoader = new THREE.TextureLoader()
    const gltfLoader = new GLTFLoader()
    const geom = new THREE.PlaneGeometry(8, 12)

    const arr = []

    const iterate = n => {
        if (!DR_IMG_SRC[n + '']) {
            gallery(arr)
            return
        }
        imagesLoader.load(DR_IMG_SRC[n + ''], map => {
            gltfLoader.load(DR_SRC[n + ''], dr => {
                const mat = new THREE.MeshBasicMaterial({ map })
                const mesh = new THREE.Mesh(geom, mat)
                mesh.position.set(
                    -15 + (n * 5),
                    15,
                    -10,
                )
                root.studio.addToScene(mesh)

                dr.scene.position.x = -15 + (n * 5)
                dr.scene.scale.set(10, 10, 10)
                root.studio.addToScene(dr.scene)

                arr.push({
                    dr, map: mesh,
                })

                iterate(++n)
            })
        })
    }

    iterate(1)
}