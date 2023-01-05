import * as THREE from 'three'
import { DR_IMG_SRC, DR_SRC } from '../constants/constants_assetsToLoad'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const color = new THREE.Color( 0, 0, 0 );
const ARR_SLIDES = []

const gallery = (root) => {
    const { TWEEN } = root


    const moveImg = (dr, map) => {
        return new Promise(res => {
            const data = {
                x: Math.random() * 100 - 5,
                y: -200,
                r: Math.random() * Math.PI * 2 - Math.PI,
                s: 20,
                rY: -Math.PI / 2,
            }

            const t = new TWEEN.Tween(data)
                .to({
                    x: 0,
                    y: 0,
                    r: 0,
                    rY: 0,
                    s: 8,
                }, 2500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    map.position.x = data.x
                    map.position.y = data.y
                    map.rotation.z = data.r
                    map.rotation.y = data.rY
                    map.scale.set(
                        data.s,
                        data.s,
                        data.s,
                    )
                })
                .start()

            setTimeout(() => {
                res()
            }, 2500)
        })
    }


    const switchImgToDr = (dr, map) => {
        return new Promise(res => {
            const geom = dr.scene.children[0].geometry
            const savedPos = []
            const newPos = []
            for (let i = 0; i < geom.attributes.position.array.length; ++i) {
                savedPos.push(geom.attributes.position.array[i])
                newPos.push(geom.attributes.position.array[i] + Math.random() * 5 - 2.5)
            }

            dr.scene.scale.set(
               50,
               50,
               50,
            )
            dr.scene.visible = true
            dr.scene.children[0].material.color.r = 1
            dr.scene.children[0].material.color.g = 1
            dr.scene.children[0].material.color.b = 1

            const data = {
                phase: 0,
                s: 8,
                s2: 2,
                t: 1,
                c: .7,
                b: 0,
            }
            const t = new TWEEN.Tween(data)
                .to({t: 0, c: .3, b: .5, s: 2, s2: 50, phase: 1}, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    for (let i = 0; i < geom.attributes.position.array.length; ++i) {
                       geom.attributes.position.array[i] = savedPos[i] * data.phase + (newPos[i]) * (1 - data.phase)
                    }
                    dr.scene.children[0].geometry.attributes.position.needsUpdate = true

                    map.material.opacity = data.t
                    map.scale.set(
                        data.s,
                        data.s,
                        data.s,
                    )
                    dr.scene.scale.set(
                       data.s2,
                       data.s2,
                       data.s2,
                    )
                    dr.scene.children[0].material.color.r = data.c
                    dr.scene.children[0].material.color.g = data.c
                    dr.scene.children[0].material.color.b = data.c
                    color.r = data.b
                    color.g = data.b
                    color.b = data.b
                    //root.studio.setBackColor(color)
                })
                .start()
            setTimeout(() => {
                map.visible = false
                res()
            }, 1600)
        })
    }

    const moveDr = (dr, map) => {
        return new Promise(res => {
            const data = {
                rZ: 0,
                rY: 0,
                s: 50,
                z: 0,
                c: 0,
            }

            const t = new TWEEN.Tween(data)
                .to({
                    rZ: Math.random() * Math.PI * 2 - Math.PI,
                    rY: (Math.floor(Math.random() * 3) - 1) * Math.PI,
                    s: 1000,
                    c: 0,
                    z: 40
                }, 4000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    dr.scene.rotation.z = data.rZ
                    dr.scene.rotation.y = data.rY
                    dr.scene.position.z = data.z
                })
                .start()

            setTimeout(res, 4300)
        })
    }

    async function iterate (n) {
        if (!ARR_SLIDES[n]) {
            n = 0
        }

        const { dr, map } = ARR_SLIDES[n]

        map.visible = true
        map.material.opacity = 1
        dr.scene.visible = false
        dr.scene.rotation.set(0, 0, 0)
        dr.scene.position.set(0, -3, 0)
        dr.scene.children[0].material.color.r = .8
        dr.scene.children[0].material.color.g = .8
        dr.scene.children[0].material.color.b = .8

        await moveImg(dr, map)
        await switchImgToDr(dr, map)

        iterate(++n).then()

        await moveDr(dr, map)
    }

    iterate(0).then()
}




let isStartGallery = false

export const createImagesGallery = (root) => {
    const imagesLoader = new THREE.TextureLoader()
    const gltfLoader = new GLTFLoader()
    const geom = new THREE.PlaneGeometry(8, 12)

    const iterate = n => {
        if (!DR_IMG_SRC[n + '']) {
            return
        }
        imagesLoader.load(DR_IMG_SRC[n + ''], map => {
            gltfLoader.load(DR_SRC[n + ''], dr => {
                const mat = new THREE.MeshBasicMaterial({
                    map,
                    transparent: true,
                    opacity: 1,
                })
                const mesh = new THREE.Mesh(geom, mat)
                mesh.position.set(
                    -15 + (n * 5),
                    15,
                    -10,
                )
                mesh.visible = false
                root.studio.addToScene(mesh)

                dr.scene.visible = false
                root.studio.addToScene(dr.scene)

                ARR_SLIDES.push({
                    dr, map: mesh,
                })

                if (!isStartGallery) {
                    gallery(root)
                    isStartGallery = true
                }
                iterate(++n)
            })
        })
    }

    iterate(1)
}