<template>
	<view>
		<button type="primary" @click="open">fade</button>
		<uni-transition mode-class="fade" :styles="{'width':'100px','height':'100px','backgroundColor':'red'}" :show="show" @change="change" />
	</view>
	
	<view  @click="setModuleMake()" style="position:relative;margin-top:10px;">
		<uni-transition ref="ani" :show="true">
		<image class="btn-image" src="/static/game/btn-make.png"></image>
		</uni-transition>
		<text class="btn-text">制造</text>
	</view>	
</template>

<script>
export default {
	data() {
		return {
			show: false,
		}
	},
	onReady() {
		/*
			this.$refs.ani.init({
				duration: 1000,
				timingFunction: 'linear',
				transformOrigin: '50% 50%',
				delay: 500
			})
		*/
	},
	onLoad() {},
	methods: {
		setModuleMake(){
			console.log('yes');
			// 同时右平移到 100px,旋转 360 读
			this.$refs.ani.step({
				//translateX: '100px',
				rotate: '360'
			})
			this.$refs.ani.step({
				translateX: '0px',
				rotate: '0'
			},
			{
				timingFunction: 'linear',
				duration: 600
			})
			// 开始执行动画
			this.$refs.ani.run(()=>{
				console.log('动画支持完毕')
			})
		},
		open(mode) {
			this.show = !this.show
		},
		change() {
			console.log('触发动画')
		}
	}
}
</script>