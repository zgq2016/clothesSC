import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Component({
  properties: {
    myProperty: {
      type: String,
      value: "",
      observer: function () {},
    },
  },
  data: {
    customer_select: [], //客户
  },
  pageLifetimes: {
    show: function () {
      this.get_customer(); //客户
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    bindCustomerSelect(e) {
      // 选择客户
      this.setData({
        customer_id: this.data.customer_select[e.detail.value].id,
        companyname: this.data.customer_select[e.detail.value].companyname,
      });
    },

    async get_customer() {
      // 获取客户
      let res = await request({
        url: "get_customer_select",
      });
      this.setData({
        customer_select: res.data.data,
      });
    },
  },
  created: function () {},
  attached: function () {},// 在组件实例进入页面节点树时执行
  ready: function () {},
  moved: function () {},
  detached: function () {},// 在组件实例被从页面节点树移除时执行
});
