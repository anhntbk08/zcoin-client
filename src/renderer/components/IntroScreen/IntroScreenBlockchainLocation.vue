<template>
    <div>
        <h1 v-html="$t('onboarding.set-blockchain-location.title')" />

        <p v-html="$t('onboarding.set-blockchain-location.description')" />

        <footer>
            <template v-if="!hasLocation">
                <base-button
                    :is-outline="true"
                    @click="startDaemon"
                >
                    {{ $t('onboarding.set-blockchain-location.button__use-default-location--secondary') }}
                </base-button>
                <BaseButton
                    color="green"
                    @click="selectFolder"
                >
                    {{ $t('onboarding.set-blockchain-location.button__select-folder--primary') }}
                </BaseButton>
            </template>
            <BaseButton
                v-else
                color="green"
                @click="startDaemon"
            >
                {{ $t('onboarding.set-blockchain-location.button__confirm-selection--primary') }}
            </BaseButton>
        </footer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GuideStepMixin from '@/mixins/GuideStepMixin'
import path from 'path'
import types from '~/types'

import fs from 'fs'

const { dialog } = require('electron').remote

export default {
    name: 'IntroScreenBlockchainLocation',
    mixins: [
        GuideStepMixin
    ],

    computed: {
        ...mapGetters({
            hasLocation: 'App/hasBlockchainLocation',
            location: 'App/blockchainLocation'
        })
    },

    methods: {
        selectFolder () {
            const returned = dialog.showOpenDialog({
                title: 'Select Zcoin Blockchain Location',
                // message: 'just a message',
                properties: [
                    'openDirectory',
                    'createDirectory',
                    'promptToCreate'
                ],
                buttonLabel: this.$t('onboarding.set-blockchain-location.button__select-location--primary')
            })


            if (!returned || !returned[0]) {
                this.$log.debug('user canceled the selection in the dialog box')
                return
            }

            const [ blockchainPath ] = returned

            this.$store.dispatch(types.app.SET_BLOCKCHAIN_LOCATION, blockchainPath)
            this.$store.dispatch(types.app.DAEMON_START)
        },

        startDaemon () {
            this.$store.dispatch(types.app.DAEMON_START)

            this.$nextTick(() => {
                this.actions.next()
            })
        },

        isEnabled () {
            return !this.hasLocation || !fs.existsSync(this.location)
        }
    }
}
</script>

<style scoped>

</style>
