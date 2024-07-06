<template>
	<view class="container">
	<uni-easyinput  type="textarea" v-model="disInfo.content" maxlength="100" placeholder="请输入内容"></uni-easyinput>
	<!--<textarea style="min-height:200px;padding:10px" @input="input" maxlength="500"  placeholder="请详细描述一下您要发布的信息...(500字以内)" />-->
	<button style="margin-top:30px;"  type="primary"  @tap="submitDiscuz()">我要发布</button>
	<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />	
	</view>
</template>
<script>
import * as utils from '@/common/util.js';	
export default {  
    data() {  
        return {  
			disInfo : {
				content:'',
			},
			actMenu : getApp().globalData.actMenu
        };  
    },  
    methods: { 
		clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
		input(e){
			this.disInfo.content = e.detail.value;
		},
		submitDiscuz(){
			if (this.disInfo.content.length < 2){
				uni.showToast({
					icon : 'none',
					title: '内容过少'
				});
				return;
			}
			let that = this;
			let pdata = {};
			pdata.module = 'discuz';
			pdata.content = this.disInfo.content;
			utils.post(getApp().globalData.eyUrl+'discuz/setData',pdata).then(res=>{
				let ret = res.data;
				//console.log("submitDiscuz=>",res);
				if (ret.code == '1'){
					uni.showToast({
						title: '发表成功'
					});
					uni.navigateBack();
				}else if(ret.code == '0'){
					uni.showToast({
						icon:'none',
						title: ret.msg
					});
				}
			});
		},
    }  
};
</script>