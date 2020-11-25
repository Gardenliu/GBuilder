const tools = require('./tools');
const widget = require('./Widget');

class XBuilderForm {
  constructor() {
    this.form = {
      title: '',
      type: 'form',
      api: {},
      data: {},
      mode: 'horizontal',
      wrapWithPanel: true,
      affixFooter: false,
      controls: [],
    };
    this._tab_nav = [];
    this._buttons = [];
    this._group = {};
  }

  /**
   * 设置表单标题
   * @param title
   * @returns {XBuilderForm}
   */
  setMetaTitle($title) {
    this.form.title = $title;
    return this;
  }

  setFormMode($mode = 'horizontal', $modeCofnig = null) {
    this.form.mode = $mode;
    if ($modeCofnig && $mode === 'horizontal') {
      this.form.horizontal = $modeCofnig;
    }
    return this;
  }

  /**
   * 固定底部含有按钮footer栏
   * @param $mode
   * @returns {XBuilderForm}
   */
  setFooterAffix($mode = true) {
    this.form.affixFooter = $mode;
    return this;
  }

  /**
   * 配置表单数据-编辑使用
   * @param $form_data
   * @param $bug
   */
  setFormData($form_data, $bug = false) {
    this.form.data = $form_data;
    if ($bug) {
      this.form.debug = $bug;
    }
    return this;
  }

  setTabNav($title, $data = []) {
    if (tools.isArray($title)) {
      this._tab_nav = $title;
    } else {
      this._tab_nav.push({
        title: $title,
        body: $data,
      });
    }
  }

  /**
   * 设置提交form表单地址
   * @param $post_url
   * @param $method
   * @param $redirect
   */
  setFormUrl($post_url = '', $method = 'post', $redirect = '') {
    const $api = {
      method: $method,
      url: $post_url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    };
    this.form.api = $api;
    if ($redirect) {
      this.form.redirect = $redirect;
    }
    return this;
  }

  /**
   * 设置表单动作
   * @param $title
   * @param $attr
   * @param $actionType
   * @param $actionContent
   * @returns {XBuilderForm}
   */
  setActions($title, $attr = 'info', $actionType = '', $actionContent = null) {
    let $button = {
      label: $title,
      type: 'action',
      level: 'info',
      actionType: $actionType,
    };
    if (tools.isArray($attr)) {
      $button = Object.assign($button, $attr);
    } else {
      $button.level = $attr;
    }
    $button.actionType = $actionType;
    $button[$actionType] = $actionContent;
    if (tools.isArray(this._buttons) && this._buttons) {
      this._buttons = $button;
    } else {
      this._buttons = $button;
    }
    this.form.actions = this._buttons;
    return this;
  }

  /**
   * 添加组
   * @param $type
   * @returns {XBuilderForm}
   */
  addGroup($type = 'group') {
    this._group = {};
    this._group.type = $type;
    return this;
  }

  /**
   * 分组结束
   * @returns {XBuilderForm}
   */
  endGroup() {
    this.form.controls.push(this._group);
    this.form.controls.push({
      type: 'divider',
    });
    this._group = null;
    return this;
  }

  /**
   * @param $name
   * @param $type
   * @param $title ['title'=>'','size'=>'xs/sm/md/lg/full(input宽度)','remark'=>'','placeholder'=>'']
   * @param false $required [
   'required'=>true,
   'rule'=>[
   'isNumeric'=>true,
   'minimum'=>1
   ],
   'errMsg'=>[
   'isNumeric'=>'请输入数字',
   'minimum'=>'最小数字为1'
   ]
   ]
   * @param array $options
   * @param string $extra
   * @param string $extra_attr
   * @return $this
   */
  addFormItem($name, $type, $title, $required = false, $hidden = false) {
    const $item = widget.getFormItem($name, $type, $title, $required, $hidden);
    if (tools.isArray(this._group && JSON.stringify(this._group) !== '{}')) {
      this._group.controls = [];
      this._group.controls.push($item);
    } else {
      this.form.controls.push($item);
      this.form.controls.push({
        type: 'divider',
      });
    }
    return this;
  }

  addFormItems($items = []) {
    const $datas = [];
    $items.forEach(function($item) {
      const $title = $item.title || $item.label;
      if (!$item.options[0]) {
        delete $item.options;
      }
      $datas.push(widget.getFormItem($item.name, $item, $title));
    });
    this.form.controls = $datas;
    return this;
  }

  getFormData() {
    return this.form;
  }

  getButtonData() {
    return this._buttons;
  }
}

module.exports = XBuilderForm;
