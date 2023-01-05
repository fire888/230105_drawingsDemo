import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


const params = {
    exposure: 1.2,
    bloomStrength: 1.5,
    bloomThreshold: .7,
    bloomRadius: .5,
};

export const createStudio = () => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0x400080)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set( 0, 0, 30);
    camera.lookAt(0, 0, 0)


    const scene = new THREE.Scene()

    const lightA = new THREE.AmbientLight( 0xcc99ff, .2, 1000)
    lightA.position.set( 5, 5, 5 )
    scene.add( lightA )

    const light = new THREE.PointLight( 0xcc99ff, .6, 300)
    light.position.set( 0, 0, 30)
    scene.add( light )
    scene.fog = new THREE.Fog(0x000000, 0, 1000)


    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );



    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight);
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
            //renderer.render(scene, camera)
            
				composer.render();
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