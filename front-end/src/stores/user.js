import { defineStore } from 'pinia'

export default defineStore('user', {
    state: () => ({
        userDatas: null,
    }),
    actions: {
        updateUserDatas(newDatas) {
            this.userDatas = newDatas;
        },
        getUserDatas() {
            return this.userDatas;
        },
        checkUserDatas() {
            if (this.userDatas !== null) {
                return true;
            } else {
                return false;
            }
        }

    }
})