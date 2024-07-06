<template>
	<view class="container">
		<uni-segmented-control :current="switchtab.current" :values="switchtab.items"  @clickItem="onClickTab" />
		<view class="content">
			<view v-if="switchtab.current === 0">
<uni-card  v-for="(item,index) in vote0.data" :key="index" :isFull="true" style="margin-top:15px">
					<template v-slot:title>
						<uni-list>
							<uni-list-item link="navigateTo" :to="'/pages/toupiao/detail?e='+encodeURIComponent(JSON.stringify(item))" showArrow :title="item.title" :rightText="((!!item.etime && (item.etime!='')) ? ('截止:'+item.etime.substring(0,10)) : '')" />
							<uni-list-item v-if="item.intro!=''" :note="item.intro"  />
							<uni-list-item  v-for="(option,index2) in vote0.result[item.id].options" :key="index2"  clickable  @click="onClickVote(item,index2)">
								<template v-slot:header>
									<text class="slot-text" style="width:100px;">{{option}}</text>
								</template>
								<template v-slot:body>
									<view class="slot-box slot-text" style="width:100px;">
									{{vote0.result[item.id].items[index2]}}票
									</view>
								</template>
								<template v-slot:footer>
									<view class="slot-text">{{(vote0.result[item.id].total > 0) ? (parseFloat(vote0.result[item.id].items[index2]/vote0.result[item.id].total).toFixed(4)*100) : 0}}%</view>
								</template>
							</uni-list-item>
							<uni-list-chat v-if="!!vote0.discuz[item.id]"  clickable="true" @click="clickDiscuzLink(item)" :border="false" :avatar-circle="true" :avatar="upUrl+vote0.discuz[item.id].avatar" :title="vote0.discuz[item.id].name"  :note="vote0.discuz[item.id].content">
								<view class="chat-custom-right">
									<uni-icons type="arrow-right" color="#999" size="18"></uni-icons>
								</view>
							</uni-list-chat>
						</uni-list>
					</template>
				</uni-card>
				<view style="padding:15px;">
				<uni-pagination @change="changeVote0" :total="vote0.count" :pageSize="vote0.limit" />
				</view>
			</view>
			<view v-if="switchtab.current === 1">
				<uni-card  v-for="(item,index) in vote1.data" :key="index" :isFull="true" style="margin-top:15px">
					<template v-slot:title>
						<uni-list>
							<uni-list-item link="navigateTo" :to="'/pages/toupiao/detail?e='+encodeURIComponent(JSON.stringify(item))" showArrow :title="item.title" :rightText="((!!item.etime && (item.etime!='')) ? ('截止:'+item.etime.substring(0,10)) : '')" />
							<uni-list-item v-if="item.intro!=''" :note="item.intro"  />
							<uni-list-item  v-for="(option,index2) in vote1.result[item.id].options" :key="index2">
								<template v-slot:header>
									<text class="slot-text" style="width:100px;">{{option}}</text>
								</template>
								<template v-slot:body>
									<view class="slot-box slot-text" style="width:100px;">
									{{vote1.result[item.id].items[index2]}}票
									</view>
								</template>
								<template v-slot:footer>
									<view class="slot-text">{{(vote1.result[item.id].total > 0) ? (parseFloat(vote1.result[item.id].items[index2]/vote1.result[item.id].total).toFixed(4)*100) : 0}}%</view>
								</template>
							</uni-list-item>
							<uni-list-chat v-if="!!vote1.discuz[item.id]"  clickable="true" @click="clickDiscuzLink(item)" :border="false" :avatar-circle="true" :avatar="upUrl+vote1.discuz[item.id].avatar" :title="vote1.discuz[item.id].name"  :note="vote1.discuz[item.id].content">
								<view class="chat-custom-right">
									<uni-icons type="arrow-right" color="#999" size="18"></uni-icons>
								</view>
							</uni-list-chat>
						</uni-list>
					</template>
				</uni-card>
				<view style="padding:15px;">
				<uni-pagination @change="changeVote1" :total="vote1.count" :pageSize="vote1.limit" />
				</view>
			</view>
			<view v-if="switchtab.current === 2">
				<uni-card  v-for="(item,index) in vote2.data" :key="index" :isFull="true" style="margin-top:15px">
					<template v-slot:title>
						<uni-list>
							<uni-list-item link="navigateTo" :to="'/pages/toupiao/detail?e='+encodeURIComponent(JSON.stringify(item))" showArrow :title="item.title" :rightText="((!!item.etime && (item.etime!='')) ? ('截止:'+item.etime.substring(0,10)) : '')" />
							<uni-list-item v-if="item.intro!=''" :note="item.intro"  />
							<uni-list-item  v-for="(option,index2) in vote2.result[item.id].options" :key="index2" clickable  @click="onClickVote(item,index2)">
								<template v-slot:header>
									<text class="slot-text" style="width:100px;">{{option}}</text>
								</template>
								<template v-slot:body>
									<view class="slot-box slot-text" style="width:100px;">
									{{vote2.result[item.id].items[index2]}}票
									</view>
								</template>
								<template v-slot:footer>
									<view class="slot-text">{{(vote2.result[item.id].total > 0) ? (parseFloat(vote2.result[item.id].items[index2]/vote2.result[item.id].total).toFixed(4)*100) : 0}}%</view>
								</template>
							</uni-list-item>
							<uni-list-chat v-if="!!vote2.discuz[item.id]"  clickable="true" @click="clickDiscuzLink(item)" :border="false" :avatar-circle="true" :avatar="upUrl+vote2.discuz[item.id].avatar" :title="vote2.discuz[item.id].name"  :note="vote2.discuz[item.id].content">
								<view class="chat-custom-right">
									<uni-icons type="arrow-right" color="#999" size="18"></uni-icons>
								</view>
							</uni-list-chat>
						</uni-list>
					</template>
				</uni-card>
				<view style="padding:15px;">
				<uni-pagination @change="changevote2" :total="vote2.count" :pageSize="vote2.limit" />
				</view>
			</view>
			<view v-if="switchtab.current === 3">
				<uni-card  v-for="(item,index) in vote3.data" :key="index" :isFull="true" style="margin-top:15px">
					<template v-slot:title>
						<uni-list>
							<uni-list-item link="navigateTo" :to="'/pages/toupiao/detail?e='+encodeURIComponent(JSON.stringify(item))" showArrow :title="item.title" :rightText="((!!item.etime && (item.etime!='')) ? ('截止:'+item.etime.substring(0,10)) : '')" />
							<uni-list-item v-if="item.intro!=''" :note="item.intro"  />
							<uni-list-item  v-for="(option,index2) in vote3.result[item.id].options" :key="index2" clickable  @click="onClickVote(item,index2)">
								<template v-slot:header>
									<text class="slot-text" style="width:100px;">{{option}}</text>
								</template>
								<template v-slot:body>
									<view class="slot-box slot-text" style="width:100px;">
									{{vote3.result[item.id].items[index2]}}票
									</view>
								</template>
								<template v-slot:footer>
									<view class="slot-text">{{(vote3.result[item.id].total > 0) ? (parseFloat(vote3.result[item.id].items[index2]/vote3.result[item.id].total).toFixed(4)*100).toFixed(2) : 0}}%</view>
								</template>
							</uni-list-item>
							<uni-list-chat v-if="!!vote3.discuz[item.id]" clickable="true" @click="clickDiscuzLink(item)" :border="false" :avatar-circle="true" :avatar="upUrl+vote3.discuz[item.id].avatar" :title="vote3.discuz[item.id].name"  :note="vote3.discuz[item.id].content">
								<view class="chat-custom-right">
									<uni-icons type="arrow-right" color="#999" size="18"></uni-icons>
								</view>
							</uni-list-chat>
						</uni-list>
					</template>
				</uni-card>
				<view style="padding:15px;">
				<uni-pagination @change="changeVote3" :total="vote3.count" :pageSize="vote3.limit" />
				</view>	
				<button @tap="clickTopicApply()" type="primary" plain="true">发起议题</button>
			</view>
		</view>
		<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		components: {},
		data() {
			return {
				upUrl : ''
				,myAuth : {}
				,switchtab:{
					items: ['进行中投票', '已结束投票', '议题研讨','议题发起'],
					current: 0,
					colorIndex: 0,
					activeColor: '#007aff',
					styleType: 'button'
				}
				,vote0 : {
					count : 0,
					page : 0,
					limit:3,
				}
				,vote1 : {
					count : 0,
					page : 0,
					limit:3,
				}
				,vote2 : {
					count : 0,
					page : 0,
					limit:3,
				}
				,vote3 : {
					count : 0,
					page : 0,
					limit:3,
				}
				,page:{
					height:0,
				}
				,actMenu : getApp().globalData.actMenu
			}
		},
		onLoad(param) {
		//	console.log("param=>",param);
			let that = this;
			if (!!param.current) that.switchtab.current = parseInt(param.current);
			that.upUrl = getApp().globalData.upUrl;
			that.page.height = getApp().globalData.page.height-265;
		},
		onShow(){
			this.myAuth = getApp().globalData.myAuth;
			this.getToupiao(this.switchtab.current);
		},
		methods: {
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			// 点击用户言跳转
			clickDiscuzLink(e){
				uni.navigateTo({
					url:'/pages/toupiao/detail?e='+encodeURIComponent(JSON.stringify(e))
				})
			},			
			clickTopicApply(){
				if (!!this.myAuth.uid){
					uni.navigateTo({
						url:'/pages/toupiao/topic'
					})
				}else{
					uni.switchTab({
						url:'/pages/member/index'
					})
				}
			},
			changeVote0(e){
				this.vote0.page = e.current;
				this.getToupiao(0);
			},
			changeVote1(e){
				this.vote1.page = e.current;
				this.getToupiao(1);
			},
			changeVote2(e){
				this.vote2.page = e.current;
				this.getToupiao(2);
			},
			changeVote3(e){
				this.vote3.page = e.current;
				this.getToupiao(3);
			},			
			onClickVote(e,opt){
				let that = this;		
				if (e.status == '2'){
					uni.showToast({
						icon : 'none',
						title: '该投票已结束'
					});
					return;
				}
				uni.showModal({
					content: '确定要为该选项投票吗？',
					confirmText:'确定',
					cancelText:'取消',
					success: function (res) {
						if (res.confirm) {
							let pdata = {};
							pdata.id= e.id;
							pdata.tag = e.tag;
							pdata.vote = opt;
							utils.post(getApp().globalData.eyUrl+'vote/join',pdata).then(res=>{
								//let res = JSON.parse(_res);
								let ret = res.data;
								if (ret.code == '1'){
									if (pdata.tag == "0"){
										if (ret.data.length > 0){
											for (var k in ret.data) that.vote0.result[k] = ret.data[k];
										}
									}else if (pdata.tag == "2"){
										if (ret.data.length > 0){
											for (var k in ret.data) that.vote2.result[k] = ret.data[k];
										}
									}else if (pdata.tag == "3"){
										if (ret.data.length > 0){
											for (var k in ret.data) that.vote3.result[k] = ret.data[k];
										}										
									}
									
									
									uni.showToast({
										title: '投票成功'
									});
									that.getToupiao(pdata.tag);
								}else{
									uni.showToast({
										icon: 'none',
										title: ret.msg
									});
								}
							});
						}
					}
				});
			},
			getToupiao(index){
				//console.log("getPaiMai=>",index);
				let that = this;
				let pdata = {};
				pdata.tag = index;
				if (index == 0){
					pdata.page = this.vote0.page;
					pdata.limit = this.vote0.limit;
					pdata.count = this.vote0.count;
					pdata.status = 1;
				}else if (index == 1){
					pdata.page = this.vote1.page;
					pdata.limit = this.vote1.limit;
					pdata.count = this.vote1.count;
					pdata.status = 2;
				}else if (index == 2){
					pdata.page = this.vote2.page;
					pdata.limit = this.vote2.limit;
					pdata.count = this.vote2.count;
				}else if (index == 3){
					pdata.page = this.vote3.page;
					pdata.limit = this.vote3.limit;
					pdata.count = this.vote3.count;
				}
				utils.post(getApp().globalData.eyUrl+'vote/getData',pdata).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					//console.log("getToupiao=>ret=>",ret);					
					if (ret.code == '1'){
						if (index== 0){
							that.vote0 = ret;
						}else if(index ==1) {
							that.vote1 = ret;
						}else if(index ==2) {
							that.vote2 = ret;
						}else if(index ==3) {
							that.vote3 = ret;
						}
					}
					
				});
			},
			onClickTab(e) {
				if (this.switchtab.current !== e.currentIndex) {
					this.switchtab.current = e.currentIndex;
					this.getToupiao(e.currentIndex);
				}
			}
		}
	}
</script>


<style>
	.container {
		padding: 15px;
		font-size: 14px;
		line-height: 24px;
	}
	.slot-text{font-size:14px;color:blue;}
</style>
