var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: { sizes: [], options_index: "" },
  //options(Object)
  onShow: function () {},
  onLoad: function (options) {
    this.setData({
      options_index: options.index,
    });
    if (
      app.globalData.produce_order[this.data.options_index].produce_order_size
        .length == 0
    ) {
      this.size_init();
    } else {
      app.globalData.produce_order[
        this.data.options_index
      ].produce_order_size.map((v, i) => {
        v["style_color_name"] =
          app.globalData.produce_order[
            this.data.options_index
          ].style_color_name;
      });
      this.setData({
        sizes:
          app.globalData.produce_order[this.data.options_index]
            .produce_order_size,
      });
    }
  },
  get_ratio(e) {
    let index = e.currentTarget.dataset.index;
    let total = app.globalData.produce_order[this.data.options_index].total;
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
    let sizes = [];
    // return;
    this.data.sizes.map((v, i) => {
      if (v.checked == true) {
        sizes.push(v);
      }
    });
    if (sizes.length == "") {
      wx.showToast({
        title: "请选择尺码",
        icon: "none",
      });
      return;
    }
    for (let index = 0; index < sizes.length; index++) {
      sizes[index].id = 0;
      if (sizes[index].ratio == "") {
        wx.showToast({
          title: "请输入比例",
          icon: "none",
        });
        return;
      }
    }
    getApp().globalData.produce_order[
      this.data.options_index
    ].produce_order_size = this.data.sizes;
    wx.navigateBack({
      delta: 1,
    });
  },
  handleCheck(e) {
    let total = app.globalData.produce_order[this.data.options_index].total;
    let item = e.currentTarget.dataset.item;
    this.data.sizes.map((v, i) => {
      if (item.size == v.size) {
        v.checked = !v.checked;
      }
      if (v.checked == false) {
        v.quantity = "";
        v.ratio = "";
      }
      let res = this.data.sizes.reduce((v1, i1) => {
        return v1 + Number(i1.ratio);
      }, 0);
      this.data.sizes.map((value, index) => {
        value.quantity = Math.round((total / res) * value.ratio);
      });
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
      v["size"] = v.size_name;
      v["checked"] = false;
      v["ratio"] = "";
      v["quantity"] = "";
      v["style_color_name"] =
        app.globalData.produce_order[this.data.options_index].style_color_name;
    });
    this.setData({
      sizes: res.data.data,
    });
  },
  onReady: function () {},
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

checked: true
id: 0
produce_no: "2020112899987"
quantity: 50
ratio: 1
size: "XS"
style_color_name: "红色"
style_id: "172"
*/
