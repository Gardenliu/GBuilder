const tools = require('./tools');

class XBuilderList {
  constructor() {
    this.form = {
      title: '',
      remark: '',
      type: 'page',
      toolbar: [],
      body: {
        type: 'crud',
        headerToolbar: [
          'statistics',
          'bulkActions',
        ],
        syncLocation: false,
        bulkActions: [],
        columns: [],
      },
    };
    this._table_data_list = [];
    this._table_data_list_key = 'id';
    this._right_button_list = {
      buttons: [],
    };
    this._hove_right_button = false;
    this._tab_nav = [];
  }

  setTabNav($title, $data) {
    if (tools.isArray($title)) {
      this._tab_nav = $title;
    } else {
      this._tab_nav.push({
        title: $title,
        body: $data,
      });
    }
    return this;
  }

  setMetaTitle($meta_title) {
    this.form.title = $meta_title;
    return this;
  }

  setTitleTips($tips) {
    this.form.remark = $tips;
    return this;
  }

  setTableDataListKey($table_data_list_key) {
    this._table_data_list_key = $table_data_list_key;
    return this;
  }

  addTableColumn($name, $title, $type = 'text', $isSearch = false, $isSort = false, $param = null) {

    let $column = {
      name: $name,
      label: $title,
      type: $type,
    };
    if ($isSearch) {
      $column.searchable = $isSearch;
    }
    if ($isSort) {
      $column.sortable = $isSort;
    }
    if ($column.sortable) {
      $column.searchable = false;
    }
    if ($param && tools.isArray($param)) {
      $column = Object.assign($column, $param);
    }
    this.form.body.columns.push($column);
    return this;
  }

  setRightHover($isHover = false) {
    this._hove_right_button = $isHover;
    return this;
  }

  _buttonTypeMap($type, $isGroup = false) {
    const groupMsg = $isGroup ? '批量' : '';
    const typeMap = [
      {
        type: 'delete',
        label: `${groupMsg}删除`,
        confirmText: `确定要${groupMsg}删除?`,
      },
      {
        type: 'forbid',
        value: 0,
        label: `${groupMsg}禁用`,
        confirmText: `确定要${groupMsg}禁用?`,
      },
      {
        type: 'resume',
        value: 1,
        label: `${groupMsg}启用`,
        confirmText: `确定要${groupMsg}启用?`,
      },
      {
        type: 'recycle',
        value: -1,
        label: `${groupMsg}回收`,
        confirmText: `确定要${groupMsg}回收?`,
      },
      {
        type: 'restore',
        value: 1,
        label: `${groupMsg}还原`,
        confirmText: `确定要${groupMsg}还原?`,
      },
    ];
    return typeMap.find(item => {
      return item.type === $type;
    });
  }

  addRightButton($type, $attribute = null) {
    this._right_button_list.label = '操作';
    this._right_button_list.type = 'operation';
    let $button_attribute = {};
    switch ($type) {
      case 'edit':
        $button_attribute = {
          label: '修改',
          type: 'button',
          actionType: 'url',
          blank: false,
          url: '/news/info/${id}',
        };
        break;
      default: {
        const filterType = this._buttonTypeMap($type);
        if (!filterType) break;
        let model = '';
        try {
          model = $attribute.model;
        } catch (e) {
          model = '';
        }
        $button_attribute = {
          label: filterType.label,
          type: 'button',
          confirmText: filterType.confirmText,
          actionType: 'ajax',
          model,
          api: {
            method: 'post',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            url: 'news/setstatus/' + filterType.type + '/${id}',
          },
        };
        break;
      }
    }
    if ($attribute && tools.isArray($attribute)) {
      $button_attribute = Object.assign($button_attribute, $attribute);
    }
    this._right_button_list.buttons.push($button_attribute);
    return this;
  }

  setTableApi($url = '', $method = 'get', $cache = 2000) {
    this.form.body.api = {
      url: $url,
      method: $method,
      cache: $cache,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    };
    return this;
  }

  addTopExport() {
    const headerToolBar = this.form.body.headerToolbar;
    if (!headerToolBar.includes('Glenn')) {
      this.form.body.headerToolbar.push('export-csv');
    }
    return this;
  }


  addTopButton($type, $attribute = null) {
    let $my_attribute = {};
    switch ($type) {
      case 'add':
        $my_attribute = {
          label: '新增',
          type: 'button',
          level: 'info',
          actionType: 'url',
          blank: false,
          url: '/news/info',
        };
        if ($attribute && tools.isArray($attribute)) {
          $my_attribute = Object.assign($my_attribute, $attribute);
        }
        this.form.toolbar.push($my_attribute);
        break;
      default: {
        const filterType = this._buttonTypeMap($type, true);
        if (!filterType) break;
        let model = '';
        try {
          model = $attribute.model;
        } catch (e) {
          model = '';
        }
        $my_attribute = {
          label: filterType.label,
          type: 'button',
          confirmText: filterType.confirmText,
          actionType: 'ajax',
          model,
          api: {
            method: 'post',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            url: 'news/setstatus/' + filterType.type + '/all',
          },
        };
        if ($attribute && tools.isArray($attribute)) {
          $my_attribute = Object.assign($my_attribute, $attribute);
        }
        this.form.body.bulkActions.push($my_attribute);
      }
    }
    return this;
  }

  getListData() {
    if (this._right_button_list.label) {
      if (this._hove_right_button) {
        this.form.body.itemActions = this._right_button_list.buttons;
      } else {
        this.form.body.columns.push(this._right_button_list);
      }
    }
    return this.form;
  }
}

module.exports = XBuilderList;
