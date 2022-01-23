<template>
    <div class="container">
        <div class="content">
            <div class="details">
                <div class="figure">
                    <div class="figure_count count_key">
                        <img src="../../assets/image/special/icon/people.png" height="94" width="78" alt="">
                        <div>重点人员</div>
                        <span>{{specialData.key.count}}</span>人
                    </div>
                    <div class="figure_count count_love">
                        <img src="../../assets/image/special/icon/heart.png" height="78" width="94" alt="">
                        <div>关爱人员</div>
                        <span>{{specialData.love.count}}</span>人
                    </div>
                    <div class="figure_circle circle_key">
                        <div id="key_1">
                            <i-circle :percent="specialData.key.percent" class='circle' :size="184" :trail-width='4'
                                      trail-color='#235182' :stroke-width='6' stroke-color='#32d6ee'>
                                <div class="circleNum">
                                    {{specialData.key.percent}}<span>%</span>
                                </div>
                            </i-circle>
                        </div>
                        <div>重点人员</div>
                    </div>
                    <div class="figure_circle circle_love">
                        <div id="love_1">
                            <i-circle :percent="specialData.love.percent" class='circle' :size="184" :trail-width='4'
                                      trail-color='#235182' :stroke-width='6' stroke-color='#dbcf45'>
                                <div class="circleNum">
                                    {{specialData.love.percent}}<span>%</span>
                                </div>
                            </i-circle>
                        </div>
                        <div>关爱人员</div>
                    </div>
                </div>
                <div class="charts">
                    <div class="chart chart_key">
                        <div id="key_2">

                        </div>
                        <div>重点人员</div>
                    </div>
                    <div class="chart chart_love">
                        <div id="love_2">

                        </div>
                        <div>关爱人员</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import axios from '../../utils/http.js'
    import echarts from 'echarts'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    //var d3 = require('d3')
    export default {
        name: 'DataCharts',
        methods: {
            drawKey_1() {
                let width = document.getElementById('key_1').offsetWidth;
                let height = document.getElementById('key_1').offsetHeight;
                let svg = d3.select('#key_1').append('svg')
                    .attr('width', width)
                    .attr('height', height);
                let filter = svg.append("defs")
                    .append("filter")
                    .attr("id", "blur")
                    .append("feGaussianBlur")
                    .attr("stdDeviation", 1);
                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", 2)
                    .attr("dy", 2)
                    .attr("result", "offsetBlur");
                let arc0 = d3.arc()
                    .outerRadius(width * 0.5)
                    .innerRadius(width * 0.5 - 10)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);
                svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .append("path")
                    .attr("fill", '#235182')
                    .attr("d", arc0);
                let arc = d3.arc()
                    .outerRadius(width * 0.5)
                    .innerRadius(width * 0.5 - 15)
                    .startAngle(0)
                    .endAngle(this.specialData.key.percent / 100 * 2 * Math.PI);
                svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .append("path")
                    .attr("fill", '#32d6ee')
                    .attr("d", arc)
                    .attr("filter", "url(#blur)");
                svg.append("text")
                    .attr("x", width * 0.25)
                    .attr("y", height * 0.6)
                    .attr("fill", "#fff")
                    .attr("style", "font-size:60")
                    .text(this.specialData.key.percent);
                svg.append("text")
                    .attr("x", width * 0.6)
                    .attr("y", height * 0.6)
                    .attr("fill", "#fff")
                    .attr("style", "font-size:30; text-anchor:end")
                    .text('%');
            },
            drawLove_1() {
                let width = document.getElementById('love_1').offsetWidth;
                let height = document.getElementById('love_1').offsetHeight;
                let svg = d3.select('#love_1').append('svg')
                    .attr('width', width)
                    .attr('height', height);
                let filter = svg.append("defs")
                    .append("filter")
                    .attr("id", "blur")
                    .append("feGaussianBlur")
                    .attr("stdDeviation", 1);
                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", 2)
                    .attr("dy", 2)
                    .attr("result", "offsetBlur");
                let arc0 = d3.arc()
                    .outerRadius(width * 0.5)
                    .innerRadius(width * 0.5 - 10)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);
                svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .append("path")
                    .attr("fill", '#235182')
                    .attr("d", arc0);
                let arc = d3.arc()
                    .outerRadius(width * 0.5)
                    .innerRadius(width * 0.5 - 15)
                    .startAngle(0)
                    .endAngle(this.specialData.love.percent / 100 * 2 * Math.PI);
                svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .append("path")
                    .attr("fill", '#dbcf45')
                    .attr("d", arc)
                    .attr("filter", "url(#blur)");
                svg.append("text")
                    .attr("x", width * 0.25)
                    .attr("y", height * 0.6)
                    .attr("fill", "#fff")
                    .attr("style", "font-size:60; text-anchor:start")
                    .text(this.specialData.love.percent);
                svg.append("text")
                    .attr("x", width * 0.6)
                    .attr("y", height * 0.6)
                    .attr("fill", "#fff")
                    .attr("style", "font-size:30; text-anchor:end")
                    .text('%');
            },
            ...mapActions([
                'getData',
                'drawKeyAndLove'
            ])
        },
        mounted() {
            console.log("charts mounted");
            this.getData();
            this.drawKeyAndLove();
        },
        computed: {
            ...mapState([
                'specialData',
                'city_code',
                'selection',
                'key',
                'love'
            ])
        }
    }
</script>

<style lang='scss' scoped>
    $textPrimary: #45c1fb;
    $textSecondary: #f1f1f1;
    .container {
        background-size: 100% 100%;
        width: 100%;
        height: 935px;
        color: $textSecondary;
        position: relative;
        .content {
            position: absolute;
            background: url('../../assets/image/special/bg_data.png') no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 95%;
            .details {
                width: 90%;
                height: calc(100% - 140px);
                margin-left: 5%;
                margin-top: 80px;
                .figure {
                    margin-bottom: 90px;
                    .figure_count {
                        display: inline-block;
                        img {
                            display: block;
                            margin-bottom: 10px;
                        }
                        div {
                            color: $textPrimary;
                            font-size: 18px;
                        }
                        span {
                            font-size: 36px;
                        }
                    }
                    .count_key {
                        width: 80px;
                        text-align: center;
                    }
                    .count_love {
                        img {
                            margin-top: 16px;
                        }
                        width: 94px;
                        text-align: center;
                    }
                    .figure_circle {
                        display: inline-block;
                        text-align: center;
                        font-size: 24px;
                        color: $textPrimary;
                        div {
                            &:nth-child(1) {
                                width: 190px;
                                height: 190px;
                            }
                        }
                        .circleNum {
                            line-height: 190px;
                            font-size: 60px;
                            color: #fff;
                            span {
                                font-size: 30px;
                            }
                        }
                    }
                    .count_key {
                        margin-left: 160px;
                        margin-right: 170px;
                    }
                    .circle_key {
                        margin-left: 250px;
                        margin-right: 160px;
                    }
                }
                .charts {
                    clear: both;
                    .chart {
                        display: inline-block;
                        width: calc(50% - 50px);
                        float: left;
                        text-align: center;
                        div {
                            &:nth-child(1) {
                                height: 370px;
                            }
                            &:nth-child(2) {
                                padding: 5px 10px;
                                background-color: #11497c;
                                font-size: 20px;
                                width: 120px;
                                margin: auto;
                            }
                        }
                    }
                    .chart_love {
                        margin-left: 100px;
                    }
                }
            }
        }
    }
</style>