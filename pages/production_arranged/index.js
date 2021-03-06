import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    my_role: "",
    goods: [],
    goodsSearch: [],
    switchover_active: false,
    imgwidth: "",
    imgheight: "",
    productionScheduling: "",
    produce_info: "",
    produce_factory_order_add: "",
    permission: [],
  },
  QueryParams: {
    styleno: "",
    page: 1,
    page_size: 9,
  },
  TotalPages: 1,
  //options(Object)
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let productionScheduling = permission.indexOf("productionScheduling") != -1;
    let produce_info = permission.indexOf("produce_info") != -1;
    let produce_factory_order_add = permission.indexOf("produce_factory_order_add") != -1;
    this.setData({
      permission,
      productionScheduling,
      produce_info,
      produce_factory_order_add,
    });
  },

  newProject() {
    navigateTo(`/pages/designFile/index`);
  },
  go_production_files(e) {
    let item = e.currentTarget.dataset.item;
    navigateTo(
      `/pages/sc_materialPurchasing/index?style_id=${item.style_id}&produce_no=${item.produce_no}`
    );
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.styleno = e.detail.value;
    this.setData({
      styleno: this.QueryParams.styleno.trim(),
      goodsSearch: [],
    });
    this.init();
  },
  async init() {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }

    if (this.QueryParams["styleno"] == undefined) {
      let res = await request({
        url: "get_produce_factory_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...this.data.goods, ...res.data.data],
      });
    }
    if (this.QueryParams["styleno"] != undefined) {
      let res = await request({
        url: "get_produce_factory_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goods: [],
        goodsSearch: [...this.data.goodsSearch, ...res.data.data],
      });
    }
  },
  onReady: function () {},
  onShow: function () {
    let my_role = wx.getStorageSync("role");
    this.setData({
      my_role,
      goodsSearch: [],
      goods: [],
    });
    this.QueryParams.page = 1;
    this.QueryParams.styleno = "";
    this.setData({
      styleno: "",
    });

    this.init();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {
    this.setData({
      goods: [],
      goodsSearch: [],
    });
    this.QueryParams.page = 1;
    this.init();
  },
  onReachBottom: function () {
    if (this.totalPages >= this.QueryParams.page) {
      this.QueryParams.page++;
      this.init();
    } else {
      wx.showToast({
        title: "已经没有下一页的数据了",
        icon: "none",
      });
    }
  },
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
