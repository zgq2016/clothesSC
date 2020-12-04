var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Component({
  properties: {
    data: {
      type: Object,
      value: "",
      observer: function () {},
    },
  },
  data: { produce_order: [], colors: [], customer_select: [] },
  pageLifetimes: {
    show: function () {
      this.get_customer(); //客户
      this.color_init(); //颜色
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    Confirm_the_order_edit() {
      console.log(this.data.produce_order);
    },
    go_get_size(e) {
      let index = e.currentTarget.dataset.index;
      navigateTo(`/pages/get_size/index?index=${index}`);
    },
    get_total(e) {
      // 选择总量
      let index = e.currentTarget.dataset.index;
      this.data.produce_order.map((v, i) => {
        if (index == i) {
          v.total = e.detail.value;
        }
      });
      this.setData({ produce_order: this.data.produce_order });
    },
    bindDateChange: function (e) {
      // 出货时间
      let index = e.currentTarget.dataset.index;
      this.data.produce_order.map((v, i) => {
        if (index == i) {
          v.expect_date = e.detail.value;
        }
      });
      this.setData({ produce_order: this.data.produce_order });
    },
    bindCustomerSelect(e) {
      // 选择客户
      let index = e.currentTarget.dataset.index;
      this.data.produce_order.map((v, i) => {
        if (index == i) {
          v.customer_id = this.data.customer_select[e.detail.value].id;
          v.companyname = this.data.customer_select[e.detail.value].companyname;
        }
      });
      this.setData({ produce_order: this.data.produce_order });
    },
    bindColorSelect(e) {
      // 增加颜色
      this.data.produce_order.push({
        customer_id: "",
        companyname: "",
        expect_date: "",
        style_color_name: this.data.colors[e.detail.value].style_color_name,
        total: "",
        produce_order_size: [],
        style_id: this.data.data.style_id,
        produce_no: this.data.data.produce_no,
      });
      this.setData({ produce_order: this.data.produce_order });
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
    async color_init() {
      // 获取颜色
      let res = await request({
        url: "get_style_color_select",
        method: "post",
        data: {
          style_id: this.data.data.style_id,
        },
      });
      this.setData({
        colors: res.data.data,
      });
    },
  },
  created: function () {},
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},
});
