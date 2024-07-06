<template>
		<view class="member_list">
			<view class="member_item" v-for="(item,index) in cash.data" :key="index">
				<view class="member_head">
					<image class="member_avatar" :src="upUrl+item.avatar" mode=""></image>
					<view class="member_info">
						<view class="member_name">
							xxxfdsaf
						</view>
						<view class="member_sign">
							ID:fdsafdsaf fadsafdf
						</view>
					</view>
					
				</view>
			</view>
		</view>		
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				upUrl : '',
				cash: {}
			}
		},
		onLoad(){
			this.upUrl = getApp().globalData.upUrl;
		},
		onShow(){
			this.getPaiMai(0);
		},
		methods: {
			getPaiMai(index){
				let that = this;
				let pdata = {};
				pdata.tag = index;
				utils.post(getApp().globalData.eyUrl+'paimai/getData',pdata).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						if (index== 0){
							that.cash = ret;
						}else if(index ==1) {
							that.coin = ret;
						}else if(index ==2) {
							that.resource = ret;
						}
					}
				});
			},
		}
	}
</script>

<style>
	.container {
		padding: 15px;
		font-size: 14px;
		line-height: 24px;
	}
		
	.member_list{margin-top: 30rpx;}
	.member_item{
		padding: 0 10rpx;
		border-bottom: 1px solid #e9e9e9;
		margin-top: 20rpx;
	}
	.member_head{
		display: flex;
		align-items: center;
	}
	.member_avatar{
		height: 64rpx;
		width: 64rpx;
		border-radius: 50%;
	}
	.member_info{
		font-size:24rpx;
		margin-left: 20rpx;
	}
	.member_name{
		color: #797979;
	}
	.member_sign{
		color: #797979;
		margin-top: 6rpx;
		font-weight: 600;
	}	
</style>
