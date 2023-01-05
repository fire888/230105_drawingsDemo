import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export const createStudio = () => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0xd7d7d7)
    //renderer.setClearColor(0x000000)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set( 0, 0, 30);
    camera.lookAt(0, 0, 0)


    const scene = new THREE.Scene()

    const lightA = new THREE.AmbientLight( 0x4c1200, 1, 1000)
    lightA.position.set( 5, 5, 5 )
    scene.add( lightA )

    const light = new THREE.PointLight( 0x5b7558, 2, 10000)
    light.position.set( 0, 0, 30)
    scene.add( light )
    scene.fog = new THREE.Fog(0x000000, 0, 1000)


    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
    }
    window.addEventListener('resize', resize)


    return {
        light,
        render: () => {
            if (!camera ) {
                return;
            }
            renderer.render(scene, camera)
        },
        addToScene: mesh => {
            scene.add(mesh)
        },
        setBack: back => {
            //scene.background = back
        },
        setBackColor: back => {
            //renderer.setClearColor(back)
        }
    }
}