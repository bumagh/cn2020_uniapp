<template>
	
	<view v-if="!loginfo.uid" class="login">
		<view class="header">
		  <image :src="upUrl+loginfo.avatar"></image>
		</view>

		<view class="list">
		  <view class="list-call">
			<image class="img" src="/static/shilu-login/1.png"></image>
			<input class="sl-input" v-model="loginfo.username" type="number" maxlength="8" placeholder="输入数字帐号" />
		  </view>
		  <view class="list-call">
			<image class="img" src="/static/shilu-login/2.png"></image>
			<input class="sl-input" v-model="loginfo.password" type="text" maxlength="32" placeholder="输入密码" password="true" />
		  </view>
		<view class="agreement">
		  <image @tap="agreementSuccess" :src="loginfo.record==true?'/static/shilu-login/ty1.png':'/static/shilu-login/ty0.png'"></image>
		  <text @tap="agreementSuccess"> 保留当前登录</text>
		</view>
		</view>

		<view class="button-login" hover-class="button-hover" @tap="bindLogin()">
		  <text>登录</text>
		</view>

		<view class="agreement">
		  <navigator url="forget" open-type="navigate">忘记密码</navigator>
		  <text>|</text>
		  <navigator url="reg" open-type="navigate">注册账户</navigator>
		</view>		
	</view>
	<view v-else class="main" style="background-color: #e4ecf7;min-height: 100vh;">
		<view class="user_header_box">
			<view class="avatar_box">
				<image class="img" src="../../static/user/avatar.png" mode=""></image>
			</view>
			<view class="user_info">
				<view class="name">
					{{loginfo.name}}
				</view>
				<view class="uid">
					ID:{{loginfo.username}}
				</view>
			</view>
		</view>
		<view class="user_amount_box">
			<view class="user_level">
				<image class="icon" src="../../static/user/level_icon.png"></image>
				<view class="level_desc_box">
					<view class="title">
						申请会员权益
					</view>
					<view class="desc">
						加入会员享受更多特权
					</view>
				</view>
				<image class="right_icon" src="../../static/user/right.png" mode=""></image>
			</view>
			<view class="amount_box">
				<view class="amount">
					360,000.00 <text style="font-size: 26rpx;">元</text>
				</view>
				<view class="now_with">
					立即提现
				</view>
			</view>
		</view>
		<view class="user_tab_box">
			<view class="tab_title">
				常用服务
			</view>
			<view class="tab_list_box">
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/amount.png" mode=""></image>
					<view class="text">我的钱包</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/xieyi.png" mode=""></image>
					<view class="text">注册协议</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/account.png" mode=""></image>
					<view class="text">我的资料</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/help.png" mode=""></image>
					<view class="text">常见问题</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/kefu.png" mode=""></image>
					<view class="text">我的客服</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/level.png" mode=""></image>
					<view class="text">激活权限</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/about.png" mode=""></image>
					<view class="text">关于我们</view>
				</view>
				<view class="list_item">
					<image class="icon" src="../../static/user/tab_icon/setting.png" mode=""></image>
					<view class="text">我的设置</view>
				</view>
			</view>
		</view>
		<view class="loan_box">
			<view class="loan_title_box">
				<view class="title">
					热门产品
				</view>
				<view class="link">
					查看更多
				</view>
			</view>
			<view class="loan_list">
				<view class="list_item" v-for="(item,index) in productList" :key="index">
					<view class="item_head">
						<image class="pic" src="../../static/logo.png" mode=""></image>
						<view class="loan_info">
							<view class="name">
								产品名称
							</view>
							<view class="date">
								产品描述
							</view>
						</view>
						<view class="join_btn">
							立即购买
						</view>
					</view>
					<view class="item_bottom">
						<view class="bottom_item">
							<view class="names">
								价格
							</view>
							<view class="amount">
								{{index+1}}300
							</view>
						</view>
						<view class="bottom_item">
							<view class="names">
								服务周期
							</view>
							<view class="amount">
								3-24
							</view>
						</view>
						<view class="bottom_item">
							<view class="names">
								售后服务
							</view>
							<view class="amount">
								{{index+1}}次
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_line">
			<view class="line"></view>
			<text style="margin: 0 20rpx;font-size: 28rpx;">我的也有底线的</text>
			<view class="line"></view>
		</view>
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';  //require这个js模块    
	export default {
		data() {
			return {
				loginfo:{
					record : false,
					username:'',
					password:''
				}
				,productList:[1,2,3,4,5,6,7]
			}
		},
		onLoad() {
			//if (!!param.username) this.loginfo.username = param.username;
			this.loginfo = uni.getStorageSync('myAuth') || {};
			if(Object.keys(this.loginfo).length >0){  
				
			}else{
			}
			//console.log("loginfo=>",this.loginfo);
		},
		onShow(){
			this.loginfo = uni.getStorageSync('myAuth') || {};
		},
		methods: {
			agreementSuccess() {
				this.loginfo.record = !this.loginfo.record;
			},

			bindLogin() {
				if ((String(this.loginfo.username).length < 6) || (String(this.loginfo.username).length > 8)) {
					uni.showToast({
						icon: 'none',
						title: '请输入入6-8位数字帐号'
					});
					return;
				}
				if (String(this.loginfo.password).length < 6) {
				  uni.showToast({
				    icon: 'none',
				    title: '请输入入6位字符以上的密码'
				  });
				  return;
				}
				utils.post(getApp().globalData.eyUrl+'member/login',this.loginfo).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					//console.log("ret=>", ret);
					if (ret.code == '1'){
						ret.data.record = this.loginfo.record;
						this.login = ret.data;
						uni.setStorageSync('myAuth', ret.data);
						uni.showToast({
						  icon: 'none',
						  title: '登录成功'
						});
						uni.reLaunch({
							url: '/pages/member/index'
						});
					}else if (ret.code == '0'){
						uni.showToast({ title: '登录失败', icon: 'error', duration: 1000 });
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 登录 begin : */
	.login {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	
	.header {
	  width: 161rpx;
	  height: 161rpx;
	  background: rgba(63, 205, 235, 1);
	  box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
	  border-radius: 50%;
	  margin-top: 30rpx;
	  margin-left: auto;
	  margin-right: auto;
	}
	
	.header image {
	  width: 161rpx;
	  height: 161rpx;
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
	
	.list-call .sl-input {
	  flex: 1;
	  text-align: left;
	  font-size: 32rpx;
	  margin-left: 16rpx;
	}
	
	.button-login {
	  color: #FFFFFF;
	  font-size: 34rpx;
	  width: 470rpx;
	  height: 100rpx;
	  background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
	  box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
	  border-radius: 50rpx;
	  line-height: 100rpx;
	  text-align: center;
	  margin-left: auto;
	  margin-right: auto;
	  margin-top: 100rpx;
	}
	
	.button-hover {
	  background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
	}
	
	.agreement {
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  font-size: 30rpx;
	  margin-top: 80rpx;
	  color: #FFA800;
	  text-align: center;
	  height: 40rpx;
	  line-height: 40rpx;
	}
	
	.agreement text {
	  //font-size: 24rpx;
	  margin-left: 15rpx;
	  margin-right: 15rpx;
	}
	.agreement image {
	width: 60rpx;
	height: 60rpx;
	}	
	/* end; */
	.user_header_box{
		height: 340rpx;
		width: 100%;
		background-image: url(../../static/user/head_bg.png);
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: left;
		.avatar_box{
			margin-left: 80rpx;
			.img{
				height: 120rpx;
				width: 120rpx;
			}
		}
		.user_info{
			color: #fff;
			margin-left: 20rpx;
			.name{
				
			}
			.uid{
				
			}
		}
	}
	.user_amount_box{
		width: 90%;
		margin: -90rpx auto 0 auto;
		.user_level{
			border-radius: 10rpx 10rpx 0 0;
			background-color: #e2eefe;
			padding: 10rpx 14rpx;
			display: flex;
			align-items: center;
			.icon{
				height: 60rpx;
				width: 60rpx;
			}
			.level_desc_box{
				margin-left: 20rpx;
				.title{
					font-size: 28rpx;
				}
				.desc{
					font-size: 20rpx;
					color: #808080;
				}
			}
			.right_icon{
				height: 26rpx;
				width: 16rpx;
				margin-left: auto;
				padding-right: 10rpx;
			}
		}
		.amount_box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			border-radius: 0 0 10rpx 10rpx;
			padding: 40rpx 60rpx;
			.amount{
				font-size: 46rpx;
			}
			.now_with{
				background-color: #ffa415;
				color: #fff;
				padding: 8rpx 30rpx;
				border-radius: 5rpx;
			}
		}
	}
	.user_tab_box{
		background-color: #fff;
		width: 90%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		.tab_title{
			font-size: 30rpx;
		}
		.tab_list_box{
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			.list_item{
				width: 25%;
				text-align: center;
				margin: 16rpx 0;
				.icon{
					height: 80rpx;
					width: 80rpx;
				}
				.text{
					color: #666666;
					margin-top: -10rpx;
					font-size: 26rpx;
				}
			}
		}
	}
	.loan_box{
		background-color: #fff;
		width: 90%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		.loan_title_box{
			display: flex;
			align-items: center;
			padding-top: 6rpx;
			.title{
				font-size: 30rpx;
			}
			.link{
				margin-left: auto;
				color: #797979;
				font-size: 20rpx;
			}
		}
		.loan_list{
			margin-top: 30rpx;
			.list_item{
				padding: 0 10rpx;
				border-bottom: 1px solid #e9e9e9;
				margin-top: 20rpx;
				.item_head{
					display: flex;
					align-items: center;
					.pic{
						height: 100rpx;
						width: 100rpx;
					}
					.loan_info{
						margin-left: 20rpx;
						.name{
							color: #797979;
							font-weight: 600;
						}
						.date{
							color: #797979;
							margin-top: 6rpx;
						}
					}
					.join_btn{
						background-color: #2979ff;
						color: #fff;
						margin-left: auto;
						margin-right: 20rpx;
						padding: 6rpx 30rpx;
						border-radius: 30rpx;
						font-size: 28rpx;
					}
				}
				.item_bottom{
					display: flex;
					margin-top: 20rpx;
					padding-bottom: 14rpx;
					width: 100%;
					.bottom_item{
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
						font-size: 26rpx;
						.names{
							color: #797979;
						}
						.amount{
							color: #ff0548;
							margin-top: 6rpx;
							font-weight: 600;
						}
					}
				}
			}
		}
	}
	.foot_line{
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
		color: #5f5f5f;
		.line{
			width: 200rpx;
			border-bottom: 1px solid #5f5f5f;
		}
	}
</style>
