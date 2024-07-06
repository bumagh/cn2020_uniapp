<template>
	<view class="container">
<uni-section title="排行榜" sub-title="" type="line">
	<uni-table border stripe emptyText="暂无更多数据" >
		<!-- 表头行 -->
		<uni-tr>
			<uni-th align="center" width="50">排行</uni-th>
			<uni-th align="center">用户</uni-th>
			<uni-th align="center" width="80">贡献值</uni-th>
		</uni-tr>
		<!-- 表格数据行 -->		
		<!-- 表格数据行 -->
		<uni-tr v-for="(item,index) in ranking.data" :key="index">
			<uni-td v-if="((ranking.page==1) && (index < 3))"><image :src="'/static/c'+(index+1)+'.png'" style="height:20px;width:20px;"></image></uni-td>
			<uni-td v-else class="numb">{{parseInt(ranking.page-1)*parseInt(ranking.limit)+parseInt(index+1)}}</uni-td>
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
			<uni-td><text class="numb">{{!!item.point ? item.point : 0}}</text></uni-td>
		</uni-tr>
	</uni-table>
	</uni-section>
	<view style="padding:15px;">
		<uni-pagination @change="changeRanking" :total="ranking.count" :pageSize="ranking.limit" />
	</view>	
	<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />		
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				ranking : {limit:10},
				actMenu : getApp().globalData.actMenu,
				page:{},
			}
		},
		onLoad() {
			this.upUrl = getApp().globalData.upUrl;
			this.page.height = getApp().globalData.page.height-265;
			this.getRanking();
		},

		methods: {
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			changeRanking(e){
				this.ranking.page = e.current;
				this.getRanking();
			},
			getRanking(){
				uni.showLoading({title: '加载中'});
				let that = this;
				let pdata = {};
				pdata.page = this.ranking.page;
				pdata.limit = this.ranking.limit;
				pdata.count = this.ranking.count;
				pdata.type = 'point';
				utils.post(getApp().globalData.eyUrl+'pocket/getRanking',pdata).then(res=>{
				  let ret = res.data;
				  //console.log('getRanking=>',JSON.stringify(ret));
				  if (ret.code == '1'){
					that.ranking = ret;
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
		font-size: 28rpx;
		margin-top: 6rpx;
		font-weight: 600;
	}		
</style>
