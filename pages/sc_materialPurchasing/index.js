//Page Object
Page({
  data: { obj: {} },
  //options(Object)
  onLoad: function (options) {
    console.log(options);
    let obj = {};
    obj["style_id"] = options.style_id;
    obj["produce_no"] = options.produce_no;
    this.setData({ obj });
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
