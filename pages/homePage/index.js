import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    production_order_list: [],
    Production_procurement_list: [],
    production_arranged_list: [],
    tailor_list: [],
    Production_shipments_list: [],
    permission: [],
    homepage: "",
    Z7000: "",
    Z8000: "",
    Z9000: "",
    Z10000: "",
    Z11000: "",
  },
  QueryParams: {
    // 页码
    page: 1,
    // 页容量
    page_size: 10,
  }, // 总页数
  totalPages: 0,
  onLoad: function (options) {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }
    let permission = wx.getStorageSync("permission").split(",");
    let homepage = permission.indexOf("homepage") != -1;
    let Z7000 = permission.indexOf("Z7000") != -1;
    let Z8000 = permission.indexOf("Z8000") != -1;
    let Z9000 = permission.indexOf("Z9000") != -1;
    let Z10000 = permission.indexOf("Z10000") != -1;
    let Z11000 = permission.indexOf("Z11000") != -1;
    this.setData({
      permission,
      homepage,
      Z7000,
      Z8000,
      Z9000,
      Z10000,
      Z11000,
    });
    this.The_production_order_init();
    this.Production_procurement_init();
    this.production_arranged_init();
    this.tailor_init();
    this.Production_shipments_init();
  },
  async The_production_order_init() {
    if (this.data.permission.indexOf("Z7000") != -1) {
      let res = await request({
        url: "get_produce_list",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        production_order_list: res.data.data,
      });
      console.log(this.data.production_order_list);
    }
  },
  async Production_procurement_init() {
    if (this.data.permission.indexOf("Z8000") != -1) {
      let res = await request({
        url: "get_produce_procure_list",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        Production_procurement_list: res.data.data,
      });
    }
  },
  async production_arranged_init() {
    if (this.data.permission.indexOf("Z9000") != -1) {
      let res = await request({
        url: "get_produce_factory_list",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        production_arranged_list: res.data.data,
        production_arranged_list_length: res.data.count,
      });
    }
  },
  async tailor_init() {
    if (this.data.permission.indexOf("Z10000") != -1) {
      let res = await request({
        url: "get_produce_cut_list",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        tailor_list: res.data.data,
      });
    }
  },
  async Production_shipments_init() {
    if (this.data.permission.indexOf("Z11000") != -1) {
      let res = await request({
        url: "get_produce_complete_list",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        Production_shipments_list: res.data.data,
      });
    }
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
