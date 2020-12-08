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
    plants: [],
    factory_id: "",
    modes: [],
    produce_factory_order: [],
    produce_factory_order_length: "",
    active: 1,
    active_set: false,
    table: [],
  },
  pageLifetimes: {
    show: function () {
      this.init();
      this.get_plants(); //客户
    },
    hide: function () {},
    resize: function () {},
  },
  methods: {
    bindFactorySelect_edit(e) {
      let { produce_no, style_id } = this.data.data;
      this.data.produce_factory_order.push({
        factory_id: this.data.plants[e.detail.value].id,
        factory_name: this.data.plants[e.detail.value].factory_name,
        mode: "",
        mode_name: "",
        quantity: "",
        price: "",
        remarks: "",
        cursor: "",
        produce_no,
        style_id,
      });
      this.data.plants.map((v, i) => {
        this.data.produce_factory_order.map((v1, i1) => {
          if (Number(v1.factory_id) == v.id) {
            v1["modes"] = v.modes;
          }
        });
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
        produce_factory_order_length: this.data.produce_factory_order.length,
        factory_id: this.data.plants[e.detail.value].id,
      });
    },

    Confirm_scheduling_edit() {
      let produce_factory_order = [];
      produce_factory_order = this.data.produce_factory_order;
      for (let index = 0; index < produce_factory_order.length; index++) {
        if (produce_factory_order[index].mode == "") {
          wx.showToast({
            title: "请选择指派工厂",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].quantity == "") {
          wx.showToast({
            title: "请选择指派数量",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].price == "") {
          wx.showToast({
            title: "请输入加工价格",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].remarks == "") {
          wx.showToast({
            title: "备注",
            icon: "none",
          });
          return;
        }
      }
      let obj = {};

      let { produce_no, style_id } = this.data.data;
      obj["style_id"] = style_id;
      obj["produce_no"] = produce_no;
      obj["produce_factory_order"] = produce_factory_order;
      wx.showModal({
        title: "提示",
        content: "确定排单?",
        success: async (result) => {
          if (result.confirm) {
            let res = await request({
              url: "produce_factory_order_edit",
              method: "post",
              data: obj,
            });
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
            if (res.data.error_code === 0) {
              this.setData({ active_set: false, produce_factory_order: [] });
              this.init();
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    async table_edit() {
      let { style_id, produce_no } = this.data.data;
      let res = await request({
        url: "produce_factory_order_list",
        method: "post",
        data: {
          style_id,
          produce_no,
        },
      });
      this.data.plants.map((v, i) => {
        res.data.data.map((v1, i1) => {
          if (Number(v1.factory_id) == v.id) {
            v1["modes"] = v.modes;
            v1["cursor"] = v1.remarks.length;
          }
        });
      });
      console.log(this.data.modes);
      this.setData({ active_set: true, produce_factory_order: res.data.data });
    },
    async init() {
      let { style_id, produce_no } = this.data.data;
      let res = await request({
        url: "produce_factory_order_list",
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
          table: res.data.data,
        });
      }
    },
    Confirm_scheduling() {
      let produce_factory_order = [];
      produce_factory_order = this.data.produce_factory_order;
      for (let index = 0; index < produce_factory_order.length; index++) {
        if (produce_factory_order[index].mode == "") {
          wx.showToast({
            title: "请选择指派工厂",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].quantity == "") {
          wx.showToast({
            title: "请选择指派数量",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].price == "") {
          wx.showToast({
            title: "请输入加工价格",
            icon: "none",
          });
          return;
        }
        if (produce_factory_order[index].remarks == "") {
          wx.showToast({
            title: "备注",
            icon: "none",
          });
          return;
        }
      }
      let obj = {};

      let { produce_no, style_id } = this.data.data;
      obj["style_id"] = style_id;
      obj["produce_no"] = produce_no;
      obj["produce_factory_order"] = produce_factory_order;
      wx.showModal({
        title: "提示",
        content: "确定排单?",
        success: async (result) => {
          if (result.confirm) {
            let res = await request({
              url: "produce_factory_order_add",
              method: "post",
              data: obj,
            });
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
            if (res.data.error_code === 0) {
              this.setData({ active_set: false, produce_factory_order: [] });
              this.init();
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    get_remarks(e) {
      let index = e.currentTarget.dataset.index;
      this.data.produce_factory_order.map((v, i) => {
        if (index == i) {
          console.log(v);
          v.remarks = e.detail.value;
          v.cursor = e.detail.cursor;
        }
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
      });
    },
    get_price(e) {
      let index = e.currentTarget.dataset.index;
      this.data.produce_factory_order.map((v, i) => {
        if (index == i) {
          v.price = e.detail.value;
        }
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
      });
    },
    get_quantity(e) {
      let index = e.currentTarget.dataset.index;
      this.data.produce_factory_order.map((v, i) => {
        if (index == i) {
          v.quantity = e.detail.value;
        }
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
      });
    },
    bindModesSelect(e) {
      let index = e.currentTarget.dataset.index;
      this.data.produce_factory_order.map((v, i) => {
        if (index == i) {
          v.mode = v.modes[e.detail.value].id;
          v.mode_name = v.modes[e.detail.value].mode_name;
        }
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
      });
    },
    bindFactorySelect(e) {
      let { produce_no, style_id } = this.data.data;
      this.data.produce_factory_order.push({
        factory_id: this.data.plants[e.detail.value].id,
        factory_name: this.data.plants[e.detail.value].factory_name,
        mode: "",
        mode_name: "",
        quantity: "",
        price: "",
        remarks: "",
        cursor: "",
        produce_no,
        style_id,
      });
      this.data.plants.map((v, i) => {
        this.data.produce_factory_order.map((v1, i1) => {
          if (Number(v1.factory_id) == v.id) {
            v1["modes"] = v.modes;
          }
        });
      });
      this.setData({
        produce_factory_order: this.data.produce_factory_order,
        produce_factory_order_length: this.data.produce_factory_order.length,
        factory_id: this.data.plants[e.detail.value].id,
      });
    },
    async get_plants() {
      let res = await request({
        url: "factory_list",
        method: "post",
        data: {
          page: 1,
          page_size: 999,
        },
      });
      this.setData({
        plants: res.data.data,
      });
      this.setData({
        factory_name: "",
      });
    },
  },
  created: function () {},
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},
});
