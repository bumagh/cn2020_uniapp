<template>
	<view class="container">
  		<uni-section v-if="invitcode!=''" title="当前已绑定" type="line">
			
<!--<uni-notice-bar text="可以通过两种方式来解除绑定:\n1.发送消息给该ID的会员,由对方会员解除对我帐号的绑定;\n2.可以通过消耗500项献值来强制解除绑定." />-->
			<uni-title  type="h1" align="center" :title="invitcode"></uni-title>
			
			<button type="default" @tap="clickTip()">提醒解绑</button>
			<button type="primary" @tap="clickForceCancel()">强制解绑</button>
<uni-card style="background-color: wheat;">
	<text class="uni-h6">可以通过两种方式来解除绑定:\n1.发送消息给该ID的会员,由对方会员解除对我帐号的绑定;\n2.可以通过消耗500项献值来强制解除绑定.</text>
</uni-card>
  		</uni-section>
		<uni-section v-else title="绑定邀请码" type="line">
			<view class="list">
			  <view class="list-call">
				邀请码：
				<input class="sl-input" v-model="newcode" type="number"  placeholder="请输入邀请码" />
			  </view> 
			</view>			
			
			<button type="primary" @tap="clickSetBind()">绑 定</button>
		</uni-section>
	</view>
</template>

<script>
//  var _this, js;
  import * as utils from '@/common/util.js';  //require这个js模块    
  export default {
   data() {
      return {
				invitcode : '',
				newcode : '',
				tip : true
			}
    }
    ,onShow() {
		let that = this;		
		this.member = uni.getStorageSync('myAuth') || {};
		if (Object.keys(this.member).length < 1){
			uni.reLaunch({
				url:'/pages/member/index'
			})
		}else{
			this.getMemberInfo();
		}
    },
    methods: {
		clickSetBind(){
			if ((String(this.newcode).length < 6) || (String(this.newcode).length > 8)) {
				uni.showToast({
					icon: 'none',
					title: '请输入入6-8位数字邀请码'
				});
				return;
			}
			let pdata = {};
			pdata.newcode = this.newcode;
			utils.post(getApp().globalData.eyUrl+'member/setMyInvited',pdata).then(res=>{
				//let res = JSON.parse(_res);
				let ret = res.data;
				if (ret.code == '1'){
					uni.showToast({
					  title: '绑定成功，正返回。'
					});
					setTimeout(function() {
					  uni.navigateBack();
					}, 1500)
				}else{
					uni.showToast({
						icon: 'none',
						title: ret.msg
					})
				}
			});
		},
		clickTip(){
			let that = this;
			let pdata = {};
			pdata.invitcode = this.invitcode;
			utils.post(getApp().globalData.eyUrl+'message/unMyInvited', pdata).then(res=>{
				let ret = res.data;
				//console.log("clickTip=>",ret);
				if (ret.code == '1'){
					uni.showToast({
						title: '消息已发送',
						success: function (res) {
							setTimeout(function(){
								uni.navigateBack();
							},1000)
						}
					});
				}else if (ret.code == '0'){
					uni.showToast({
						icon : 'none',
						title: ret.msg,
					});
				}
			});
		},
		clickForceCancel(){
			let that = this;
			uni.showModal({
				content : '确定消耗500贡献来强制解绑吗？',
				success: function (res) {
					if (res.confirm) {
						let pdata  = {};
						pdata.invitcode = that.invitcode;
						utils.post(getApp().globalData.eyUrl+'member/forceCancel', pdata).then(res=>{
							let ret = res.data;
							if (ret.code == '1'){
								uni.showToast({
									title: '成功解除绑定',
									success: function (res) {
										setTimeout(function(){
											uni.navigateBack();
										},1000)
									}
								});
							}else if (ret.code == '0'){
								uni.showToast({
									icon:'none',
									title: ret.msg,
								});								
							}
						});
					}
				},
			});
		},
		getMemberInfo(){
			let that = this;
			utils.get(getApp().globalData.eyUrl+'member/getMyInvited').then(res=>{
				let ret = res.data;
				if (ret.code == '1'){
					if (ret.data.invitcode != ''){
						that.invitcode = ret.data.invitcode;
					}
				}else{
					uni.showToast({
						icon: 'none',
						title: ret.msg
					})
				}
			});
		},
    }
  }
</script>

<style>
  button{margin:20px;}
  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
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
	color: #18282b;
  }
</style>
