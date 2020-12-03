var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: { sizes: [] },
  //options(Object)
  onLoad: function (options) {
    this.size_init();
  },
  get_ratio(e) {
    let index = e.currentTarget.dataset.index;
    let total = app.globalData.order.total;
    this.data.sizes.map((v, i) => {
      if (index == i) {
        v.ratio = e.detail.value;
        let res = this.data.sizes.reduce((v1, i1) => {
          return v1 + Number(i1.ratio);
        }, 0);
        this.data.sizes.map((value, index) => {
          value.quantity = Math.round((total / res) * value.ratio);
        });
      }
    });
    this.setData({
      sizes: this.data.sizes,
    });
  },
  next_step() {
    getApp().globalData.order.sizes = this.data.sizes;
    wx.navigateBack({
      delta: 1,
    });
  },
  handleCheck(e) {
    let item = e.currentTarget.dataset.item;
    this.data.sizes.map((v, i) => {
      if (item.id == v.id) {
        v.checked = !v.checked;
      }
    });
    this.setData({
      sizes: this.data.sizes,
    });
  },
  async size_init() {
    let res = await request({
      url: "get_size_select",
    });
    res.data.data.map((v, i) => {
      v["checked"] = false;
      v["ratio"] = "";
      v["quantity"] = "";
    });
    this.setData({
      sizes: res.data.data,
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
/* 
customer_id: 1
expect_date: "2020-12-31"
id: 0
produce_no: "2020112867206"
produce_order_size: [{id: 0, produce_no: "2020112867206", quantity: 33, ratio: 1, size: "XS", style_color_name: "红色",…},…]
size: ["S", "M", "XS"]
size_list: [{id: 3, level: "1", size_name: "XXXS", size_id: 2, sort: 1},…]
style_color_name: "红色"
style_id: "172"
total: 100
*/
