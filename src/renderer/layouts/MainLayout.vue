<template>
    <transition name="fade">
        <div
            v-if="show"
            class="main-layout wrapper"
            :class="{ 'has-overlay': hasOpenOverlay }"
        >
            <transition
                name="fade"
                :duration="overlayDuration"
            >
                <ConnectivityOverlay v-if="showConnectivityOverlay" />
                <IntroScreen v-else-if="showIntro" />
                <restarting-overlay v-else-if="showRestartingOverlay" />
            </transition>

            <NotificationCenter />

            <transition
                name="fade"
                :duration="overlayDuration"
            >
                <div
                    v-if="hasOpenModal"
                    class="active-window-overlay"
                />
            </transition>
            <!--<header class="header">
                Header
            </header>-->
            <Sidebar class="aside" />
            <main
                ref="main"
                class="main default-tooltip-boundary"
            >
                <transition name="fade">
                    <router-view class="child" />
                </transition>
            </main>
            <!--<footer class="footer"></footer>-->
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { sleep } from '../../lib/utils'
import types from '~/types'

import Sidebar from '@/components/Sidebar'
import NotificationCenter from '@/components/NotificationCenter'
import ConnectivityOverlay from '@/components/Overlay/ConnectivityOverlay'
import IntroScreen from '@/components/IntroScreen/IntroScreen'
import RestartingOverlay from '@/components/Overlay/RestartingOverlay'

export default {
    name: 'MainLayout',
    components: {
        IntroScreen,
        Sidebar,
        NotificationCenter,
        ConnectivityOverlay,
        RestartingOverlay
    },

    data () {
        return {
            show: false,
            overlayDuration: 100
        }
    },

    computed: {
        ...mapGetters({
            isRestarting: 'App/isRestarting',
            hasOpenModal: 'Window/hasOpenModal',
            networkConnectionLost: 'Network/connectionLost',
            networkConnectionError: 'Network/connectionError',
            showIntroScreen: 'App/showIntroScreen',
            showIncomingPaymentRequest: 'App/showIncomingPaymentRequest',
            hasOpenAppOverlay: 'App/hasOpenOverlay'
        }),

        // todo do some clean up and combine getters here
        hasOpenOverlay () {
            return this.hasOpenModal ||
                    this.hasOpenAppOverlay ||
                    this.showConnectivityOverlay ||
                    this.showIntro ||
                    this.showRestartingOverlay
        },

        showConnectivityOverlay () {
            return ((this.networkConnectionLost || this.networkConnectionError) && !this.isRestarting)
        },

        showRestartingOverlay () {
            return this.isRestarting && !this.showIntro
        },

        showIntro () {
            return this.showIntroScreen && !this.showConnectivityOverlay
        }
    },

    mounted () {
        this.show = true
    },

    async created () {
        await sleep(1000)
        this.overlayDuration = 1000
    },
}
</script>

<style lang="scss">
    .main-layout {
        min-height: 100vh;
        max-width: 100vw;
        box-sizing: border-box;

        &.has-overlay {
            .header,
            .aside,
            .main {
                filter: blur(1rem);
                transition: filter 1s linear;
            }
        }
    }

    .main-layout.wrapper {
        position: relative;
        display: grid;
        //grid-template-areas: "sidebar header header header header header header header header"
        grid-template-areas: "sidebar main main main main main main main main"
        "sidebar main main main main main main main main"
        "sidebar main main main main main main main main";
        // "sidebar footer footer footer footer footer footer footer footer";
        grid-template-rows: emRhythm(3*$base-line-multi) auto emRhythm($base-line-multi);
        grid-template-columns: minmax(min-content, 14rem) auto;

        overflow: hidden;

        & > div,
        & > section {
            box-sizing: border-box;
        }
    }

    .active-window-overlay {
        position: absolute;
        background: rgba($color--dark, 0.7);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 20000;
        transition: opacity 0.15s ease-out;
    }

    .aside {
        grid-area: sidebar;
    }

    .main {
        grid-area: main;

        margin-top: $overlay--blur-offset-neg;
        padding-top: $overlay--blur-offset;

        margin-right: $overlay--blur-offset-neg;
        padding-right: $overlay--blur-offset;

        margin-bottom: $overlay--blur-offset-neg;
        padding-bottom: $overlay--blur-offset;

        z-index: 1;
    }

    .aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        z-index: 2;
    }

    .main {
        position: relative;
        background: $color--polo-light;
        // padding: 0 emRhythm(5);

        @include lato-font('light');
        color: $color--dark;

        & > section {
            position: absolute;
            box-sizing: border-box;
        }

        @include typography();

        .child {
            width: 100%;
            height: 100vh;
            //overflow-y: scroll;
            padding-right: $overlay--blur-offset;
        }
    }

    @keyframes animate--text-shadow-green-bright {
        to {
            color: $color--green-bright;
            text-shadow: 0 0 10px $color--green-bright,
            0 0 3px $color--green-bright;
        }
    }
</style>
