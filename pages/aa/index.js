var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Component({
  properties: {
    data: {
      type: Object,
      value: "",
      observer: function (e) {},
    },
  },
  data: {
    customer_select: [], //客户
    total: "", //总量
    sizes: [],
    sizes_length: "",
    add_form: {},
  },
  pageLifetimes: {
    show: function () {
      this.setData({
        sizes: app.globalData.order.sizes,
        sizes_length: app.globalData.order.sizes.length,
        add_form: {
          produce_order: [],
        },
      });
      // getApp().globalData.order.sizes = this.data.claim_num;
      this.get_customer(); //客户
      this.color_init(); //颜色
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    Confirm_the_order_edit() {},
    go_get_size() {
      navigateTo(`/pages/get_size/index`);
    },
    get_total(e) {
      // 选择总量
      this.setData({ total: e.detail.value });
    },
    bindCustomerSelect(e) {
      // 选择客户
      this.setData({
        customer_id: this.data.customer_select[e.detail.value].id,
        companyname: this.data.customer_select[e.detail.value].companyname,
      });
    },
    bindColorSelect(e) {
      this.data.add_form.produce_order.push({
        customer_id: "",
        companyname: "",
        expect_date: "",
        id: 0,
        produce_no: this.data.data.produce_no,
        style_color_name: this.data.colors[e.detail.value].style_color_name,
        produce_order_size: [],
        style_id: this.data.data.style_id,
        total: "",
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
      console.log(this.data.colors);
    },
  },
  created: function () {},
  attached: function () {}, // 在组件实例进入页面节点树时执行
  ready: function () {},
  moved: function () {},
  detached: function () {}, // 在组件实例被从页面节点树移除时执行
});
