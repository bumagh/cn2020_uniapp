<template>	
	  <view class="header" >
		<image :src="upUrl+avatar"></image>
	  </view>
	  <view class="list">
		<view class="list-call">
		  用户昵称：{{name}}
		</view> 
	  </view>
		<button style="margin: 20px;" type="primary" @click="toFriendChat" >私 聊</button>
</template>

<script>
	export default {
		name:"ey-userdetail",
		//emits: ['userdetail'],
		props: {
			uid: {
					type: String,
					default: ''
				},
			name: {
				type: String,
				default: ''
			},
			avatar: {
				type: String,
				default: ''
			},
			sign: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				upUrl : getApp().globalData.upUrl,
			};
		},
		onLoad(){  
		    // 监听事件  
			console.log("ey-userdetail...ok");
			/*
		    uni.$on('userdetail',(uinfo)=>{  
				this.uid = uinfo.uid;
				this.name = uinfo.name;
				this.avatar = uinfo.avatar;
				this.sign = uinfo.sign;
		    })
			*/
		},  
		onUnload() {  
		    // 移除监听事件  
			//uni.$off('userdetail');  
			
		},
		methods: {
			/*
			onClick(type) {
				this.$emit('click', type)
			}
			*/
		   toFriendChat(e){
				console.log("ttt=>",this.uid);
				uni.navigateTo({
					url:'/pages/chat/chat?type=friend&rid='+this.uid+'&title='+this.name
				})
		   }
		},
	}
</script>

<style>
	.header {
	  width: 100rpx;
	  height: 100rpx;
	  /*background: rgba(63, 205, 235, 1);
	  box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);*/
	  border-radius: 50%;
	  margin-top: 30rpx;
	  margin-left: auto;
	  margin-right: auto;
	}
	
	.header image {
	  width: 150rpx;
	  height: 150rpx;
	  border-radius: 50%;
	}
	
	.list {
	  display: flex;
	  flex-direction: column;
	  padding-top: 50rpx;
	  padding-left: 70rpx;
	  padding-right: 70rpx;
	}
	
	.list-call {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  height: 100rpx;
	  color: #333333;
	  border-bottom: 0.5px solid #e2e2e2;
	}
	
	.list-call .img {
	  width: 40rpx;
	  height: 40rpx;
	}
</style>