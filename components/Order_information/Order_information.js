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
  data: {
    produce_order: [],
    colors: [],
    customer_select: [],
    produceOrderInfo: [],
    produceOrderInfo_length: "",
    expect_date: "",
    t_size: [],
    t_quantity: [],
    all: [],
    total: "",
    colorList: [],
    active: 1,
    produce_order_length: "",
    active_set: false,
  },
  pageLifetimes: {
    show: function () {
      this.init(); // init
      this.size_init(); //尺码
      this.get_customer(); //客户
      this.color_init(); //颜色
      this.setData({
        produce_order: app.globalData.produce_order,
        produce_order_length: app.globalData.produce_order.length,
      });
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    /**
     * edit
     */
    async add_close_edit(e) {
      let { item, index } = e.currentTarget.dataset;
      this.data.produce_order.splice(index, 1);
      this.setData({ produce_order: this.data.produce_order });
    },
    async edit_close_edit(e) {
      console.log(e);
      let { item, index } = e.currentTarget.dataset;
      this.data.produce_order.splice(index, 1);
      let res = await request({
        url: "produce_order_del",
        method: "post",
        data: { id: item.id },
      });
      if (this.data.produce_order.length == 0) {
        this.init();
      }
      this.setData({ produce_order: this.data.produce_order });
    },

    bindColorSelect_edit(e) {
      let color = this.data.colors[e.detail.value].style_color_name;
      for (let index = 0; index < this.data.produce_order.length; index++) {
        if (this.data.produce_order[index].style_color_name == color) {
          wx.showToast({
            title: "颜色不能重复",
            icon: "none",
          });
          return;
        }
      }
      if (this.data.produce_order.length == 0) {
        this.data.produce_order.push({
          id: 0,
          customer_id: "",
          companyname: "",
          expect_date: "",
          style_color_name: color,
          total: "",
          produce_order_size: [],
          style_id: this.data.data.style_id,
          produce_no: this.data.data.produce_no,
        });
      } else {
        this.data.produce_order.push({
          id: 0,
          customer_id: this.data.produce_order[0].customer_id,
          companyname: this.data.produce_order[0].companyname,
          expect_date: this.data.produce_order[0].expect_date,
          style_color_name: color,
          total: "",
          produce_order_size: [],
          style_id: this.data.data.style_id,
          produce_no: this.data.data.produce_no,
        });
      }
      this.setData({ produce_order: this.data.produce_order });
    },
    Confirm_the_order_edit() {
      let produce_order = app.globalData.produce_order;
      produce_order.map((v, i) => {
        v.produce_order_size = v.produce_order_size.map((v1, i1) => {
          v1["style_id"] = v.style_id;
          v1["produce_no"] = v.produce_no;
          if (v1.checked == true) {
            return v1;
          }
        });
      });
      for (let index = 0; index < produce_order.length; index++) {
        if (produce_order[index].customer_id == "") {
          wx.showToast({
            title: "请选择客户",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].expect_date == "") {
          wx.showToast({
            title: "请选择出货时间",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].total == "") {
          wx.showToast({
            title: "请输入总数",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].produce_order_size.length == 0) {
          wx.showToast({
            title: "请选择尺码",
            icon: "none",
          });
          return;
        }
      }

      wx.showModal({
        title: "提示",
        content: "确定下单?",
        success: async (result) => {
          if (result.confirm) {
            let obj = {};
            let { style_id, produce_no } = this.data.data;
            obj["style_id"] = style_id;
            obj["produce_no"] = produce_no;
            obj["produce_order"] = produce_order;
            console.log(obj);
            let res = await request({
              url: "produce_order_edit",
              method: "post",
              data: obj,
            });
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
            if (res.data.error_code === 0) {
              this.setData({ active_set: false, produce_order: [] });
              this.init();
              app.globalData.produce_order = [];
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    /**
     * table
     */
    async table_edit() {
      let { style_id, produce_no } = this.data.data;
      let res = await request({
        url: "produce_order_info",
        method: "post",
        data: {
          style_id,
          produce_no,
        },
      });
      res.data.data.map((v, i) => {
        this.data.customer_select.map((v1, i1) => {
          if (v.customer_id == v1.id) {
            v["companyname"] = v1.companyname;
          }
        });
        let size_arr = [];
        this.data.sizes.map((v1, i1) => {
          size_arr.push({
            size: v1.size_name,
            quantity: 0,
            ratio: 0,
            checked: false,
          });
        });
        size_arr.map((v1, i1) => {
          v.produce_order_size.map((v2, i2) => {
            if (v1.size == v2.size) {
              v2.checked = true;
              size_arr.splice(i1, 1, v2);
            }
          });
        });
        v.produce_order_size = size_arr;
      });
      getApp().globalData.produce_order = res.data.data;
      this.setData({
        produce_order: res.data.data,
        produce_order_length: res.data.data.length,
        active_set: true,
      });
    },
    async init() {
      let { style_id, produce_no } = this.data.data;
      let res = await request({
        url: "produce_order_info",
        method: "post",
        data: {
          style_id: style_id,
          produce_no,
        },
      });
      if (res.data.data.length == 0) {
        this.setData({
          active: 1,
        });
        return;
      }
      if (res.data.data.length > 0) {
        this.setData({
          active: 0,
          active_set: false,
        });
      }
      let t_size = [];
      let t_quantity = [];
      let all = [];
      res.data.data.map((v, i) => {
        v.produce_order_size.map((a, j) => {
          a["size_names_id"] = a.id;
          t_size.push(a.size);
          t_size = [...new Set(t_size)];
        });
      });
      res.data.data.map((v, i) => {
        v.produce_order_size.map((a, j) => {
          let quant = [];
          t_size.map((x, y) => {
            if (x == a.size) {
              quant.push(a.quantity);
            } else {
              quant.push(0);
            }
          });
          t_quantity.push(quant);
        });
        let al = [];
        al = t_quantity.reduce((pre, cur, index) => {
          pre.forEach((item, index) => {
            if (pre[index] === cur[index]) {
              pre[index] += 0;
            } else {
              pre[index] += cur[index];
            }
          });
          return pre;
        });
        all.push(al);
        t_quantity = [];
      });
      let total = res.data.data.reduce((value, index) => {
        return value + Number(index.total);
      }, 0);
      this.setData({
        produceOrderInfo: res.data.data,
        produceOrderInfo_length: res.data.data.length - 1,
        expect_date: res.data.data[0].expect_date,
        t_size,
        t_quantity,
        all,
        total,
        colorList: this.data.colorList,
      });
    },
    /**
     * add
     */
    Confirm_the_order() {
      let produce_order = app.globalData.produce_order;
      produce_order.map((v, i) => {
        v.produce_order_size = v.produce_order_size.map((v1, i1) => {
          v1["style_id"] = v.style_id;
          v1["produce_no"] = v.produce_no;
          if (v1.checked == true) {
            return v1;
          }
        });
      });
      for (let index = 0; index < produce_order.length; index++) {
        if (produce_order[index].customer_id == "") {
          wx.showToast({
            title: "请选择客户",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].expect_date == "") {
          wx.showToast({
            title: "请选择出货时间",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].total == "") {
          wx.showToast({
            title: "请输入总数",
            icon: "none",
          });
          return;
        }
        if (produce_order[index].produce_order_size.length == 0) {
          wx.showToast({
            title: "请选择尺码",
            icon: "none",
          });
          return;
        }
      }
      wx.showModal({
        title: "提示",
        content: "确定下单?",
        success: async (result) => {
          if (result.confirm) {
            let res = await request({
              url: "produce_order_add",
              method: "post",
              data: { produce_order: this.data.produce_order },
            });
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
            if (res.data.error_code === 0) {
              this.setData({ active_set: false, produce_order: [] });
              this.init();
              app.globalData.produce_order = [];
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    go_get_size(e) {
      let index = e.currentTarget.dataset.index;
      navigateTo(`/pages/get_size/index?index=${index}`);
      getApp().globalData.produce_order = this.data.produce_order;
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
      let color = this.data.colors[e.detail.value].style_color_name;
      for (let index = 0; index < this.data.produce_order.length; index++) {
        if (this.data.produce_order[index].style_color_name == color) {
          wx.showToast({
            title: "颜色不能重复",
            icon: "none",
          });
          return;
        }
      }
      if (this.data.produce_order.length == 0) {
        this.data.produce_order.push({
          id: 0,
          customer_id: "",
          companyname: "",
          expect_date: "",
          style_color_name: color,
          total: "",
          produce_order_size: [],
          style_id: this.data.data.style_id,
          produce_no: this.data.data.produce_no,
        });
      } else {
        this.data.produce_order.push({
          id: 0,
          customer_id: this.data.produce_order[0].customer_id,
          companyname: this.data.produce_order[0].companyname,
          expect_date: this.data.produce_order[0].expect_date,
          style_color_name: color,
          total: "",
          produce_order_size: [],
          style_id: this.data.data.style_id,
          produce_no: this.data.data.produce_no,
        });
      }
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
    async size_init() {
      let res = await request({
        url: "get_size_select",
      });
      this.setData({
        sizes: res.data.data,
      });
    },
  },
  created: function () {},
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},
});
