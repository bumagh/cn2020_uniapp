<template>
	<view class="container">
		<uni-list :border="true">
			<!-- 右侧带角标 -->
			<view v-for="(item,index) in message.data" :key="index">
				<uni-list-chat clickable @click="clickMessageItem(item,index)" v-if="item.fromuid==0" :title="item.tag" avatar="/static/tipsystem.png" :note="item.content">
					<view class="chat-custom-right">
						<text class="chat-custom-text">{{item.created_at}}</text>
						<uni-icons v-if="item.status==1"  type="smallcircle-filled" color="#f90000" size="14"></uni-icons>
						<uni-icons v-else  type="smallcircle-filled" color="#bfbfbf" size="14"></uni-icons>
					</view>
				</uni-list-chat>
				<uni-list-chat clickable @click="clickMessageItem(item,index)" v-else :title="item.tag" avatar="/static/tipmember.png" :note="item.content">
					<view class="chat-custom-right">
						<text class="chat-custom-text">{{item.created_at}}</text>
						<uni-icons  v-if="item.status==1" type="smallcircle-filled" color="#f90000" size="14"></uni-icons>
						<uni-icons v-else  type="smallcircle-filled" color="#bfbfbf" size="14"></uni-icons>
					</view>
				</uni-list-chat>
			</view>
		</uni-list>
		<uni-pagination @change="change" :total="message.count" :pageSize="10" title="标题文字" />
	</view>	
</template>

<script>
//  var _this, js;
  import * as utils from '@/common/util.js';  //require这个js模块    
  export default {
	data() {
		return {
			message : {
				data : [],
				count : 0,
				page : 0,
				limit:10,
			}
		}
    }
	,mounted() {
		
	}
	,onLoad(){
		let that = this;		
		this.login = uni.getStorageSync('myAuth') || {};
		if (Object.keys(this.login).length < 1){
			uni.reLaunch({
				url:'/pages/member/index'
			})
		}
	}
    ,onShow() {
		this.getMessage();
    },
    methods: {
		change(e) {
			this.message.page = e.current;
			this.getMessage();
		},
		clickMessageItem(item,index){
			let that = this;
			uni.showModal({
				title: (item.fromuid=='0') ? '系统消息：' : '用户消息：' + item.tag,
				content: item.content,
				confirmText:'知道了',
				cancelText:'删除',
				cancelColor:'#ff0a00',
				success: function (res) {
					let pdata = {};
					pdata.id = item.id;
					if (res.confirm) {
						utils.post(getApp().globalData.eyUrl+'message/setread', pdata).then(res=>{
							let ret = res.data;
							if (ret.code == '1'){
								that.message.data[index].status=0;
							}else{
								uni.showToast({
									icon: 'none',
									title: ret.msg
								})
							}
						});
					} else if (res.cancel) {
						utils.post(getApp().globalData.eyUrl+'message/del', pdata).then(res=>{
							let ret = res.data;
							if (ret.code == '1'){
								that.message.data.splice(index,1);
								
							}else{
								uni.showToast({
									icon: 'none',
									title: ret.msg
								})
							}
						});
					}
				}
			})
		},
		getMessage(){
			let that = this;
			let pdata = {};
			pdata.page = this.message.page;
			pdata.limit = this.message.limit;
			pdata.count = this.message.count;
			utils.post(getApp().globalData.eyUrl+'message/getmine', pdata).then(res=>{
				let ret = res.data;
				//console.log("getMessage=>",JSON.stringify(ret));				
				if (ret.code == '1'){
					that.message.data = ret.data;
					if (!!ret.count) that.message.count = ret.count;
					if (!!ret.page) that.message.page = ret.page;
					if (!!ret.limit) that.message.limit = ret.limit;
				}else{
					uni.showToast({
						icon: 'none',
						title: ret.msg
					})
				}
			});
		},
		setRead(){
			
		},
		setDel(){
			
		},
    }
  }
</script>
<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}	
	.content{margin-bottom: 50px;height:600px;}
	.page{
		position:fixed;bottom:0;height:30px;
	}
 .chat-custom-right {
 	flex: 1;
 	/* #ifndef APP-NVUE */
 	display: flex;
 	/* #endif */
 	flex-direction: column;
 	justify-content: space-between;
 	align-items: flex-end;
 }
 
 .chat-custom-text {
 	font-size: 12px;
 	color: #999;
 }
</style>
