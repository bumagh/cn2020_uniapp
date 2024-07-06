<template>
	<view>开始跳转至游戏....</view>
</template>

<script>
	export default {
		data() {
			return {
				upUrl : '',
				myInfo : {},
				/*
				menu:{
					item : ['时空堡垒','战斗配置','AI对决','交易大厅'],
					height : 50,
				}
				*/
			}
		},

		onLoad(param){

		},
		onShow(){
			//console.log("getApp().globalData.myAuth.uid=>",getApp().globalData.myAuth.uid);
			if (!!getApp().globalData.myAuth.uid){
				uni.redirectTo({
					url: '/pages/game/game'
					//url: '/pages/game/demo'
				});
			}else{
				uni.switchTab({
					url:'/pages/member/index'
				})
			}
		}
	}
</script>

<style>
</style>