import {checkDevice} from "../helpers/checkDevice";
import {createStudio} from "../entities/studio";
import {createLoadManager} from "../helpers/loadManager";
import {ASSETS_TO_LOAD } from "../constants/constants_assetsToLoad";
import {startFrameUpdater} from "../helpers/createFrameUpater";
import {createImagesGallery} from '../entities/imgsGallery'

const root = {}

export const initApp = () => {
    root.device = checkDevice()
    root.studio = createStudio(root)
    root.loadManager = createLoadManager()

    root.loadManager.startLoad(ASSETS_TO_LOAD).then(assets => {
        root.assets = assets
        root.studio.setBack(assets.skyBox)

        root.frameUpdater = startFrameUpdater(root)
        root.frameUpdater.on(n => {
            root.studio.render()
        })

        createImagesGallery(root)
    })
}