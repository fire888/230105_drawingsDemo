import {createStudio} from "../entities/studio"
import {startFrameUpdater} from "../helpers/createFrameUpater";
import {createImagesGallery} from '../entities/imgsGallery'
const TWEEN = require('tween.js');

const root = {}




export const initApp = () => {
    root.studio = createStudio(root)
    root.TWEEN = TWEEN
    root.frameUpdater = startFrameUpdater(root)
    root.frameUpdater.on(n => {
        TWEEN.update()
        root.studio.render()
    })
    createImagesGallery(root)
}