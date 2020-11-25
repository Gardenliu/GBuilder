# builder

Builder QuickStart

### Development

```bash
$ npm install gbuilder
```

### Use

```javascript
import { XBuilderForm } form 'gbuilder'

// or

const { XBuilderForm } = require('gbuilder')

const buidler = new XBuilderForm();
const ressult = buidler
      .setMetaTitle('表单')
      .addFormItem('title', 'text', '演示标题', $sortRule)
      .addFormItem('url', 'text', '链接')
      .addFormItem('cover', 'image', '我的头像')
      .addFormItem('status', $statusOpt, '审核')
      .addFormItem('sort', 'number', '排序')
      .setFormUrl('/news/add')
      .getFormData();
```
