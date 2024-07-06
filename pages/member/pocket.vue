<template>
	<view class="container">
		<!--
  		<uni-card is-full :is-shadow="false">
  			<text class="uni-h6">通告栏组件多用于系统通知，广告通知等场景，可自定义图标，颜色，展现方式等。</text>
  		</uni-card>-->
		<uni-group title="钱包明细" mode="card">
			<!--<view> 钻石： <text class="number" v-if="!!pocket.cash">{{pocket.cash}}</text><text v-else class="number">0.00</text></view>-->
			<view> 贡献： <text class="number" v-if="!!pocket.point">{{pocket.point}}</text><text v-else class="number">0</text></view>
			<view> 金币： <text class="number" v-if="!!pocket.coin">{{pocket.coin}}</text><text v-else class="number">0</text></view>
			<view> 资源： <text class="number" v-if="!!pocket.res">{{pocket.res}}</text><text v-else class="number">0</text></view>
			<view> 冻结金币： <text class="number" v-if="!!pocket.coinfix">{{pocket.coinfix}}</text><text v-else class="number">0</text></view>
		</uni-group>
		<uni-section title="在线充值" type="line">
			<view class="list">
			  <view class="list-call">
				充值金额：
				<input class="sl-input" v-model="cashnumber" type="number"  placeholder="请输入充值额度" />
			  </view> 
			</view>
			<view v-if="pocket.openid != ''">
				<button  type="primary"  @tap="setWxpay()">微信充值</button>
			</view>
			<view v-else >
				<button type="primary" @tap="setAuth()">微信授权</button>
				<button type="primary" disabled="true"  plain="true" @tap="setWxpay()">微信充值</button>
			</view>
		</uni-section>  		
	</view>
</template>

<script>
//  var _this, js;
  import * as utils from '@/common/util.js';  //require这个js模块    
  export default {
   data() {
      return {
				cashnumber:10,
				pocket :{
					cash: 0,
					coin: 0,
					res:0,
					point:0,
				},
				payOptions : {}
			}
    }
	,onLoad(){
	}
    ,onShow() {
		let that = this;
		let auth = uni.getStorageSync('myAuth') || {};
		if (Object.keys(auth).length < 1){
			uni.reLaunch({
				url:'/pages/member/index'
			})
		}else{
			getApp().globalData.myAuth = auth;
			this.getPocket();
		}
    },
    methods: {
		getPocket(){
			let that = this;
			utils.post(getApp().globalData.eyUrl+'pocket/setInitPocket').then(res=>{
				let ret = res.data;
				if (ret.code == '1'){
					that.pocket = ret.data;
				}else{
					uni.showToast({
						icon: 'none',
						title: ret.msg
					})
				}
			});
		},
		jsApiCall(){
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				this.payOptions,
				function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok"){
						alert("支付成功");
					}else if(res.err_msg == "get_brand_wcpay_request:cancel"){
						alert("用户取消支付");
					}else{  
						alert("支付失败!请重试");
					}
				}
			);
		},
		callpay(){
			if (typeof WeixinJSBridge == "undefined"){
				if( document.addEventListener ){
					document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
				}else if (document.attachEvent){
					document.attachEvent('WeixinJSBridgeReady', this.jsApiCall); 
					document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
				}
			}else{
				this.jsApiCall();
			}
		},
		setAuth(){
			if ((!this.pocket.openid) || (this.pocket.openid == '')){
				utils.post(getApp().globalData.eyUrl+'weixin/oauth').then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						window.location.href = ret.data;
					}else{
						uni.showToast({
							icon: 'none',
							title: '授权异常'
						})
					}
				});
				return;
			}
		},
		setWxpay(){
			if (this.cashnumber < 0.1) {
				uni.showToast({
					icon: 'none',
					title: '充值金额过小。'
				});
				return;
			}
			let pdata = {};
			let that = this;
			pdata.cash = this.cashnumber;
			utils.post(getApp().globalData.eyUrl+'weixin/pay',pdata).then(res=>{
				let ret = res.data;
				//console.log("pay=>options=>",ret);
				if (ret.code == '1'){
					that.payOptions = ret.data;
					that.callpay();
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
  .number{
	  color: #fd8008;
	  font-size: 42rpx;
	  font-weight: 600;
  }
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

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 42rpx;
    margin-left: 16rpx;
	color: #fd8008;
  }
</style>
