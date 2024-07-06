<template>
	<view class="container">
<uni-section title="排行榜" sub-title="" type="line">
	<uni-table border stripe emptyText="暂无更多数据" >
		<!-- 表头行 -->
		<uni-tr>
			<uni-th align="center" width="50">排行</uni-th>
			<uni-th align="center">用户</uni-th>
			<uni-th align="center" width="60">当月</uni-th>
			<uni-th align="center" width="60">累计</uni-th>
		</uni-tr>
		<!-- 表格数据行 -->		
		<!-- 表格数据行 -->
		<uni-tr v-for="(item,index) in signin.data" :key="index">
			<uni-td v-if="((signin.page==1) && (index < 3))"><image :src="'/static/c'+(index+1)+'.png'" style="height:20px;width:20px;"></image></uni-td>
			<uni-td v-else class="numb">{{parseInt(signin.page-1)*parseInt(signin.limit)+parseInt(index+1)}}</uni-td>
			<uni-td v-if="item.name">
				<view class="member_head">
					<image class="member_avatar" :src="upUrl+item.avatar" mode=""></image>
					<view class="member_info">
						<view class="member_name">{{item.name}}</view>
						<view class="member_sign">{{item.sign}}</view>
					</view>
				</view>		
			</uni-td>
			<uni-td v-else>异常用户</uni-td>
			<uni-td><text class="numb">{{!!item.curmonth ? item.curmonth : 0}}</text></uni-td>
			<uni-td><text class="numb">{{!!item.total ? item.total : 0}}</text></uni-td>
		</uni-tr>
	</uni-table>
	</uni-section>
	<view style="padding:15px;">
		<uni-pagination @change="changesignin" :total="signin.count" :pageSize="signin.limit" />
	</view>	
	<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />		
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				signin : {limit:10},
				actMenu : getApp().globalData.actMenu,
				page:{},
			}
		},
		onLoad() {
			this.upUrl = getApp().globalData.upUrl;
			this.page.height = getApp().globalData.page.height-265;
			this.getSignIn();
		},

		methods: {
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			changesignin(e){
				this.signin.page = e.current;
				this.getSignIn();
			},
			getSignIn(){
				uni.showLoading({title: '加载中'});
				let that = this;
				let pdata = {};
				pdata.page = this.signin.page;
				pdata.limit = this.signin.limit;
				pdata.count = this.signin.count;
				pdata.type = 'point';
				utils.post(getApp().globalData.eyUrl+'signin/getData',pdata).then(res=>{
				  let ret = res.data;
				  //console.log('getsignin=>',JSON.stringify(ret));
				  if (ret.code == '1'){
					that.signin = ret;
				  }else if(ret.code == '0'){
					uni.showToast({title: '暂无数据',icon: 'error',});
				  }else{
					uni.showToast({title: '无搜索结果',icon: 'error',});
				  }
				})
				uni.hideLoading();				
			},
		}
	}
</script>

<style>
	.numb{
		color: #fd8008;
	  font-size: 36rpx;
	  font-weight: 500;
	  width:20px;
	  padding-left:15px;
	  text-align: center;
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
		color: #0000ff;
		font-size: 24rpx;
		margin-top: 6rpx;
		font-weight: 600;
	}		
</style>
