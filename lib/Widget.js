/**
 * 组件类
 */
const tools = require('./tools');

class Widget {

  static init($attrs) {
    const $attr = tools.isArray($attrs) ? $attrs : { type: $attrs };
    try {
      const $method = $attr.type
        .toString()
        .replace('-', '_');
      const $data = this[$method]($attr);
      $data.type = $attr.type;
      return $data;
    } catch (e) {
      return $attr;
    }
  }

  static getFormItem($name, $attrs, $title, $required = false, $hidden = false) {
    let $item = {};
    $item.name = $name;
    $item = Object.assign($item, this.init($attrs));
    // console.log('$item',$item)
    if (tools.isArray($title)) {
      $item.label = $title.title;
      $item.size = $title.size;
      $item.labelRemark = $title.remark;
      $item.placeholder = $title.placeholder;
    } else {
      $item.label = $title;
    }

    if (tools.isArray($required)) {
      $item.required = $required.required;
      if ($required.requiredOn) {
        $item.requiredOn = $required.requiredOn;
      }
      $item.validations = $required.rule;
      $item.validationErrors = $required.errMsg;
    } else {
      $item.required = $required;
    }

    if (tools.isArray($hidden)) {
      $item = Object.assign($item, $hidden);
    } else {
      $item.hidden = $hidden;
    }
    return $item;
  }

  /**
   * [
   * 'type'=>'select',
   * 'multiple'=>true,       //是否多选
   * 'creatable'=>true,      //是否有增加选项（适用单选 且 label = value的情况）
   * 'addControls'=>true,    //是否有增加选项（适用多选/单选 且 label != value的情况）
   * 'addApi'=>url('addurl'),//选项添加-请求地址
   * 'options'=>[
   * ['label'=>'渠道', 'value'=>'1'], ['label'=>'外链', 'value'=>'2'], ['label'=>'审核', 'value'=>'3'],
   * 'https://www.baidu.com',
   * 'https://www.qq.com',
   * 'https://www.alibaba.com'
   * ]
   * @return mixed
   */
  static select($attrs) {
    let $item = {};
    if ($attrs.multiple) {
      $item.multiple = $attrs.multiple;
      $item.joinValues = false;
      $item.extractValue = $attrs.multiple;
    }
    if ($attrs.addApi) {
      $item.addApi = {
        method: 'post',
        url: $attrs.addApi,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };
    }
    if ($attrs.addControls) {
      $item.creatable = true;
      $item.addControls = tools.isArray($attrs.addControls) ? $attrs.addControls : [
        { type: 'text', name: 'label', label: '选项标题' },
        { type: 'text', name: 'value', label: '选项值' },
      ];
    }
    if (tools.isArray($attrs.options)) {
      $item.options = $attrs.options;
    } else {
      $item.source = $attrs.options;
    }
    $item = Object.assign($item, $attrs);
    return $item;
  }

  /**
   * [
   * 'type'=>'array',
   * 'addable'=>true,    //默认:true,是否可新增
   * 'addButtonText'=>'新增',  //默认:新增,新增按钮文字
   * 'removable'=>true,  //默认:true,是否可删除
   * 'draggable'=>true,  //默认:false,是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个$id 字段
   * 'minLength'=>1,     //是否可删除
   * 'maxLength'=>3,     //是否可删除
   * 'items'=>[  //配置单项表单类型
   * 'type'=>'text',
   * ]
   * ]
   */
  static array($attrs) {
    const $item = {
      type: 'array',
      items: {
        type: 'text',
      },
    };
    $attrs = Object.assign($item, $attrs);
    return $attrs;
  }

  /**
   [
   'buttons' => [],
   ]
   * @param $attrs
   * @param array $buttons
   * @return mixed
   */
  static button_group($attrs) {
    if (!$attrs.buttons) {
      return this.select($attrs);
    }
    return $attrs.buttons;
  }

  static button($attrs) {
    const $item = {
      label: '按钮',
      type: 'action',
      level: 'info',
    };
    return Object.assign($item, $attrs);
  }

  /**
   [
   'label' => '勾选框',
   'option' => '选项说明',
   'trueValue' => 1,   // 默认true, 映射值
   'falseValue' => 0,  // 默认false, 映射值
   ]
   * @param $attrs
   * @return array
   */
  static checkbox($attrs) {
    const $item = {
      label: '勾选框',
      option: '选项说明',
    };
    return Object.assign($item, $attrs);
  }

  static image($attrs) {
    const $item = {
      reciever: '/upload',
    };
    if (tools.isArray($attrs)) {
      return Object.assign($item, $attrs);
    }
    return $item;
  }
}

module.exports = Widget;
