<template>
    <div class="ISpecail">
        <ul>
            <li>
                <v-Label switchAble :tabArr="tabArr" :activeIndex="persontype" class='label li-center'
                         @switchTabIndex="selectType"></v-Label>
            </li>
            <li v-show="persontype == 0" v-for="(value, key) in specialPersonFilter.caring">
                <label class="person" :title="key">{{ key }}</label>
                <label class="process">
                    <div class="process-item">
                        <div class="progressbar"
                             :style="{width: value / (specialPersonFilter.caringTotal + 0.0000000001) * 100 + '%'}"></div>
                    </div>
                </label>
                <label class="count">{{ value }}</label>
            </li>
            <li v-show="persontype == 1" v-for="(value, key) in specialPersonFilter.keyPerson">
                <label class="person" :title="key">{{ key }}</label>
                <label class="process">
                    <div class="process-item">
                        <div class="progressbar"
                             :style="{width: value / (specialPersonFilter.keyPersonTotal + 0.0000000001) * 100 + '%'}"></div>
                    </div>
                </label>
                <label class="count">{{ value }}</label>
            </li>
        </ul>
    </div>
</template>

<script>
    import vLabel from '@/components/Label'
    import {createNamespacedHelpers} from 'vuex'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');

    export default {
        name: 'ISpecail',
        components: {
            vLabel
        },
        data() {
            return {
                tabArr: ['关爱', '重点'],
                persontype: 0
            }
        },
        methods: {
            selectType: function (index) {
                this.persontype = index
            },
            ...mapActions([
                'getSpecialPerson'
            ])
        },
        computed: {
            ...mapGetters([
                'specialPersonFilter',
                'queryParam'
            ])
        },
        created() {
            this.getSpecialPerson();
        },
        watch: {
            queryParam() {
                this.getSpecialPerson();
            }
        }
    }
</script>

<style lang="scss" scoped>
    ul {
        padding: 0 15px;
        .li-center {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex: 1;

            display: -ms-flexbox;
            -ms-flex-align: center;
            -ms-flex-pack: center;
            -ms-flex: 1;
        }
        li {
            display: flex;
            color: #fff;
            font-size: 14px;
            padding-top: 5px;
            display: -ms-flexbox;
            .person {
                display: inline-flex;
                width: 82px;
                justify-content: flex-end;
                color: #1cb1ff;
                display: -ms-inline-flexbox;
                -ms-flex-pack: center;
            }
            .process {
                display: inline-flex;
                flex: 1;
                padding: 0 15px;
                align-items: center;
                display: -ms-inline-flexbox;
                -ms-flex-align: center;
                -ms-flex: 1;
                .process-item {
                    width: 100%;
                    height: 19px;
                    border: 2px solid #00609c;
                    box-sizing: border-box;
                    .progressbar {
                        height: 15px;
                        background: linear-gradient(90deg, #327ec9, #00ffc9);
                    }
                }
            }
            .count {
                display: inline-flex;
                width: 36px;
                color: #53b4ff;
                display: -ms-inline-flexbox;
            }
            &:first-child {
                padding-top: 8px;
                padding-bottom: 0;
                font-size: 12px;
            }
        }
    }
</style>
