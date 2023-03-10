import * as THREE from 'three'
import { DR_IMG_SRC, DR_SRC, HOUSE_SRC } from '../constants/constants_assetsToLoad'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const ARR_SLIDES = []
let HOUSE = null

const pause = t => new Promise(res => {
    setTimeout(() => {
        requestAnimationFrame(res)
    }, t)
})

const gallery = (root) => {
    const { TWEEN } = root


    const moveImg = (dr, map) => {
        return new Promise(res => {
            const data = {
                y: -200,
                rZ: Math.random() * Math.PI * 2 - Math.PI,
                s: 20,
            }

            const t = new TWEEN.Tween(data)
                .to({
                    y: 0,
                    rZ: 0,
                    s: 7.5,
                }, 2500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    map.position.y = data.y
                    map.rotation.z = data.rZ
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

            dr.scene.scale.set(50, 50, 50)
            //dr.scene.visible = true
            dr.scene.children[0].material.color.r = 1
            dr.scene.children[0].material.color.g = 1
            dr.scene.children[0].material.color.b = 1

            const data = {
                phase: 0,
                s: 8,
                s2: 3,
                t: 4,
                c: .7,
                b: 0,
            }
            const t = new TWEEN.Tween(data)
                .to({t: 0.001, c: 1, b: .5, s: 2, s2: 50, phase: 1}, 1500)
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
                })
                .start()
            setTimeout(() => {
                //map.visible = false
                res()
            }, 2000)
        })
    }

    const moveDr = (dr, map) => {
        return new Promise(res => {
            const data = {
                rZ: 0,
                rY: 0,
                z: 0,
            }

            const t = new TWEEN.Tween(data)
                .to({
                    rZ: Math.random() * Math.PI * 2 - Math.PI,
                    rY: (Math.floor(Math.random() * 3) - 1) * Math.PI,
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

    let finishGeom = null
    let startGeom = null
    const hideHouse = () => {
        if (!startGeom) {
            return;
        }
        const geom = HOUSE.scene.children[0].geometry

        for (let i = 0; i < finishGeom.length / 9; i += 1) {
            geom.attributes.position.array[i * 9 + 2] = startGeom[i * 9 + 2] * (1)
            geom.attributes.position.array[i * 9 + 5] = startGeom[i * 9 + 5] * (1)
            geom.attributes.position.array[i * 9 + 8] = startGeom[i * 9 + 8] * (1)
        }
        geom.attributes.position.needsUpdate = true
    }

    const showHouse = () => {
        return new Promise(res => {
            if (!finishGeom) {
                finishGeom = [...HOUSE.scene.children[0].geometry.attributes.position.array]
                startGeom = [...finishGeom]
                for (let i = 0; i < startGeom.length; i += 3) {
                    startGeom[i + 2] += 100
                }
                hideHouse()
                root.studio.addToScene(HOUSE.scene)
            }

            const data = { v: 0 }
            const geom = HOUSE.scene.children[0].geometry

            const t = new TWEEN.Tween(data)
                .to({ v: finishGeom.length / 9 }, 5000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    for (let i = 0; i < finishGeom.length / 9; i += 1) {
                        const v = Math.min(Math.max((data.v / i), 0), 1)
                        geom.attributes.position.array[i * 9 + 2] = finishGeom[i * 9 + 2] * v + startGeom[i * 9 + 2] * (1 - v)
                        geom.attributes.position.array[i * 9 + 5] = finishGeom[i * 9 + 5] * v + startGeom[i * 9 + 5] * (1 - v)
                        geom.attributes.position.array[i * 9 + 8] = finishGeom[i * 9 + 8] * v + startGeom[i * 9 + 8] * (1 - v)
                    }
                    geom.attributes.position.needsUpdate = true
                })
                .start()

            setTimeout(res, 5000)
        })
    }

    async function iterate (n) {
        if (!ARR_SLIDES[n]) {
            n = 0
        }
        const { dr, map } = ARR_SLIDES[n]

        map.material.opacity = 1
        dr.scene.rotation.set(0, 0, 0)
        dr.scene.position.set(0, -3, 0)
        dr.scene.scale.set(0, 0, 0)
        dr.scene.children[0].material.color.r = 1
        dr.scene.children[0].material.color.g = 1

        await moveImg(dr, map)
        if (HOUSE) {
            hideHouse()
        }
        await pause(15)
        await switchImgToDr(dr, map)
        await pause(15)
        moveDr(dr, map).then()
        if (HOUSE) {
            await pause(500)
            await showHouse()
        }
        iterate(++n).then()
    }
    iterate(0).then()
}


const houseRotator = (root, model) => {
    model.scene.scale.set(18, 18, 18)
    model.scene.position.z = -130
    model.scene.position.y = -30
    model.scene.rotation.x = 0.5
    model.scene.children[0].material.color.r = 1
    model.scene.children[0].material.color.g = 1
    model.scene.children[0].material.color.b = 1
    HOUSE = model

    root.frameUpdater.on(() => {
        model.scene.rotation.y += .01
        model.scene.rotation.x = Math.sin(model.scene.rotation.y * 0.7) * 0.35 + .4
    })
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
        imagesLoader.load(DR_IMG_SRC[n + ''], mapImg => {
            gltfLoader.load(DR_SRC[n + ''], dr => {
                const mat = new THREE.MeshBasicMaterial({
                    color: 0x9e88ad,
                    map: mapImg,
                    transparent: true,
                    opacity: 1,
                })
                const map = new THREE.Mesh(geom, mat)
                map.position.y = 500
                map.position.z = -10
                root.studio.addToScene(map)

                dr.scene.position.z = 500
                root.studio.addToScene(dr.scene)

                ARR_SLIDES.push({dr, map})

                if (!isStartGallery) {
                    gallery(root)
                    isStartGallery = true
                }

                if (n === 2) {
                    gltfLoader.load(HOUSE_SRC, model => {
                        houseRotator(root, model)
                        iterate(++n)
                    })
                } else {
                    iterate(++n)
                }
            })
        })
    }

    iterate(1)
}