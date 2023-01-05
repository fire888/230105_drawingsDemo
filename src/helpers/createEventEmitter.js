

export const createEventEmitter = () => {
    const storage = []

    return {
        emit: (keyEvent, data) => {
            if (!storage[keyEvent]) {
                storage[keyEvent] = []
            }

            for (let i = 0; i < storage[keyEvent].length; ++i) {
                storage[keyEvent][i](data)
            }
        },

        subscribe: (keyEvent, func) => {
            if (!storage[keyEvent]) {
                storage[keyEvent] = []
            }

            storage[keyEvent].push(func)
        },

        getStorage: () => {
            return storage
        }
    } 

} 
