<template>
	<view class="container">
	<uni-section titleFontSize="18px" title="网友留言"  type="line">
		<scroll-view scroll-y="true" :style="'height:'+page.height+'px'">
			<uni-list-chat v-if="disInfo.count>0" clickable v-for="(item,index) in disInfo.data" @click="showFullContent(item)" :key="index" :avatar-circle="true" :title="disInfo.member[item.uid].name" :avatar="upUrl+disInfo.member[item.uid].avatar" :note="item.content" :time="item.created_at.substring(5,16)" />
			<uni-card v-else style="background-color: wheat;">
				<text class="uni-h6">尚未有人发表内容.</text>
			</uni-card>
		</scroll-view>
		<view style="padding:15px;">
			<uni-pagination @change="changeDisInfo" :total="disInfo.count" :pageSize="10" />
		</view>
	</uni-section>
	<button @tap="clickDisInfoApply()" type="primary" plain="true">发布留言</button>
	<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />	
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				upUrl : '',
				disInfo : {},
				page: {
					height: 0,
				}
				,actMenu : getApp().globalData.actMenu
			}
		},
		onLoad(param){
			//console.log("onload=>",JSON.stringify(this.voteInfo));
			this.upUrl = getApp().globalData.upUrl;
			this.page.height = getApp().globalData.page.height-235;
		},
		onShow(){
			this.getDiscuz();
		},
		methods: {
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			changeDisInfo(){},
			clickDisInfoApply(obj){
				let myAuth = getApp().globalData.myAuth;
				if (!!myAuth.uid){
					uni.navigateTo({
						url:'/pages/discuz/apply'
					})
				}else{
					uni.showToast({
						icon:'none',
						title: '当前登录已过期，正在跳转激活'
					});
					uni.switchTab({
						url:'/pages/member/index'
					})
				}
			},
			showFullContent(e){
				uni.showModal({
					showCancel:false,
					title: this.disInfo.member[e.uid].name+'发表的内容:',
					content: e.content,
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getDiscuz(id, index){
				let that = this;
				let pdata = {};
				pdata.id = id;
				pdata.module = 'discuz';
				utils.post(getApp().globalData.eyUrl+'discuz/getData',pdata).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						that.disInfo = ret;
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
		}
	}
</script>

<style>
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
