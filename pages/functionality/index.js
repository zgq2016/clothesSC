import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {},
  //options(Object)
  onLoad: function (options) {},
  go_supplier() {
    navigateTo(`/pages/supplier/index`);
  },
  go_materialProcess() {
    navigateTo(`/pages/materialProcess/index`);
  },
  go_project() {
    navigateTo(`/pages/project/index`);
  },
  go_production_order() {
    navigateTo(`/pages/The_production_order/index`);
  },
  go_Production_procurement() {
    navigateTo(`/pages/Production_procurement/index`);
  },
  go_production_arranged() {
    navigateTo(`/pages/production_arranged/index`);
  },
  go_tailor() {
    navigateTo(`/pages/tailor/index`);
  },
  go_shipment() {
    navigateTo(`/pages/shipment/index`);
  },


  go_designFile() {
    navigateTo(`/pages/designFile/index`);
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
