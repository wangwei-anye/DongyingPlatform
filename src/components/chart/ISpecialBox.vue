<template>
    <v-chart-box hrefto='/index/special' boxType='polygon' iconName='special' :w="355" :h="301" boxTitle="特殊群体"
                 class="special-wrap">
        <ISpecial class="special"></ISpecial>
    </v-chart-box>
</template>

<script>
    import vLabel from '@/components/Label'
    import vChartBox from '@/components/ChartBox'
    import ISpecial from '@/components/chart/ISpecial2'
    import {createNamespacedHelpers} from 'vuex'

    export default {
        name: 'ISpecailBox',
        components: {
            vLabel,
            vChartBox,
            ISpecial
        },
        data() {
            return {}
        },
        methods: {
        },
        computed: {
        },
        created() {
        },
        watch: {
        }
    }
</script>

<style lang="scss" scoped>
    .special-wrap {
        .special {
            text-align: center;
            margin-top: 15px;
        }
    }

</style>
