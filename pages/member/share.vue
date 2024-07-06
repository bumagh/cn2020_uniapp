<template>
	<view class="container">
<uni-card style="background-color: wheat;" isFull="true">
	<view><text class="uni-h6">个人自编辑推广不得发布违法虚假内容，个人行为自行负责。</text></view>
</uni-card>
	<!--<uni-easyinput  v-model="disInfo.content" maxlength="100" placeholder="请输入内容"></uni-easyinput>
	<textarea style="min-height:200px;padding:10px" @input="input" maxlength="500"  placeholder="请详细描述一下您要发布的信息...(500字以内)" />-->
	
	<uni-forms ref="customForm"  :modelValue="disInfo" label-position="top">
		<uni-forms-item label="标题" required name="title">
			<uni-easyinput v-model="disInfo.title" placeholder="请输入标题" />
		</uni-forms-item>
		<uni-forms-item label="内容">
			<uni-easyinput type="textarea" v-model="disInfo.content" placeholder="请输入内容" />
		</uni-forms-item>
	</uni-forms>
	
	
	
	<button style="margin-top:30px;"  type="primary"  @tap="submitShare()">确 认</button>
	<uni-section title="分享&推广预览" type="line">
	<uni-card style="background-color: wheat;">
		<uni-link :href="disInfo.url" :text="disInfo.title"></uni-link>
		<view><text class="uni-h6">{{disInfo.content}}</text></view>
	</uni-card>
</uni-section>	
	<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />	
	</view>
</template>
<script>
import * as utils from '@/common/util.js';	
export default {  
    data() {  
        return {  
			disInfo : {
				title : '',
				content:'',
			},
			actMenu : getApp().globalData.actMenu
        };  
    }, 
	onLoad(){
		this.disInfo = uni.getStorageSync('myShare') || {};
		uni.setNavigationBarTitle({
			title: '我的分享'
		});
	},
    methods: { 
		clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
		submitShare(){
			let myAuth = getApp().globalData.myAuth;
			if (!myAuth.uid){
				uni.showToast({
					icon:'none',
					title: '当前登录已过期，正在跳转激活'
				});
				uni.switchTab({
					url:'/pages/member/index'
				})
				return;
			}
			if (String(this.disInfo.title).length < 2){
				uni.showToast({
					icon : 'none',
					title: '标题过短'
				});
				return;
			}
			let that = this;
			let pdata = {};
			pdata = this.disInfo;
			pdata.url = getApp().globalData.upUrl+'h5/#/pages/member/reg?invited='+myAuth.username;
			utils.post(getApp().globalData.eyUrl+'share/setData',pdata).then(res=>{
				let ret = res.data;
				if (ret.code == '1'){
					uni.showToast({
						title: '编辑完成',				
						success:function(){
							uni.setStorageSync('myShare', pdata);
							setTimeout(function(){
							uni.navigateTo({
								//url:'/pages/share/share?e='+encodeURIComponent(JSON.stringify(pdata)),
								url:'/pages/share/share?title='+pdata.title+'&uid='+myAuth.uid,
							})
							},1000);						
						}
					});
				}else if (ret.code == '0'){
					uni.showToast({
						title:ret.msg
					})
				}
			});
			
//			uni.setStorageSync('myShare', pdata);
			
		},
    }  
};
</script>